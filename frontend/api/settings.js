import { createClient } from '@supabase/supabase-js';
import { encrypt, decrypt } from './_utils/encryption.js';

const SENSITIVE_KEYS = ['openaiKey', 'anthropicKey', 'geminiKey', 'apiKey'];

function processSensitiveFields(obj, action) {
    if (!obj || typeof obj !== 'object') return obj;
    const result = Array.isArray(obj) ? [] : {};
    
    for (const [key, value] of Object.entries(obj)) {
        if (SENSITIVE_KEYS.includes(key) && typeof value === 'string' && value.trim() !== '') {
            result[key] = action === 'encrypt' ? encrypt(value) : (decrypt(value) || value);
        } else if (typeof value === 'object' && value !== null) {
            result[key] = processSensitiveFields(value, action);
        } else {
            result[key] = value;
        }
    }
    return result;
}

export default async function handler(req, res) {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY);

    // 1. Authenticate user via Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }
    const token = authHeader.split(' ')[1];
    
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    
    const verifiedUserId = user.id;

    if (req.method === 'GET') {
        try {
            const { data, error } = await supabaseAdmin
                .from('user_settings')
                .select('settings_json')
                .eq('user_id', verifiedUserId)
                .single();
                
            let settings = data?.settings_json || {};
            
            // Decrypt sensitive fields before returning to frontend
            settings = processSensitiveFields(settings, 'decrypt');
                
            return res.status(200).json({ 
                success: true, 
                settings
            });
        } catch (error) {
            console.warn("Settings fetch warning:", error.message);
            // Default empty object if no row exists or error
            return res.status(200).json({ 
                success: true, 
                settings: {} 
            });
        }
    } else if (req.method === 'POST') {
        let settingsPayload = req.body || {};
        
        // Remove client-supplied userId to prevent pollution (we rely entirely on verifiedUserId)
        if (settingsPayload.userId) {
            const { userId, ...rest } = settingsPayload;
            settingsPayload = rest;
        }
        
        try {
            // Encrypt only the sensitive fields
            const encryptedSettings = processSensitiveFields(settingsPayload, 'encrypt');

            const { error } = await supabaseAdmin
                .from('user_settings')
                .upsert(
                    { 
                        user_id: verifiedUserId, 
                        settings_json: encryptedSettings,
                        updated_at: new Date().toISOString()
                    }, 
                    { onConflict: 'user_id' }
                );
                
            if (error) throw error;
            
            return res.status(200).json({ success: true });
        } catch (error) {
            console.error("Settings save error:", error);
            return res.status(500).json({ error: "Failed to save settings." });
        }
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
}
