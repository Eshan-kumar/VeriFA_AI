import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY);

    if (req.method === 'GET') {
        const { userId } = req.query;
        
        if (!userId) {
            return res.status(400).json({ error: "Missing userId in request." });
        }
        
        try {
            const { data, error } = await supabaseAdmin
                .from('user_settings')
                .select('*')
                .eq('user_id', userId)
                .single();
                
            return res.json({ 
                success: true, 
                settings: data || { theme: 'dark', email_alerts: false } 
            });
        } catch (error) {
            console.warn("Settings fetch warning:", error.message);
            return res.json({ 
                success: true, 
                settings: { theme: 'dark', email_alerts: false } 
            });
        }
    } else if (req.method === 'POST') {
        // payload from frontend includes userId, providers, models, etc.
        const { userId, ...settingsPayload } = req.body;
        
        if (!userId) {
            return res.status(400).json({ error: "Missing userId in request body." });
        }
        
        try {
            const { error } = await supabaseAdmin
                .from('user_settings')
                .upsert({ user_id: userId, settings_json: settingsPayload }, { onConflict: 'user_id' });
                
            if (error) {
                // If column settings_json doesn't exist, try dumping everything into root columns
                // or just log the error. We will attempt a direct upsert of the payload.
                console.warn("Upsert with settings_json failed, attempting direct root upsert:", error.message);
                const directUpsert = await supabaseAdmin
                    .from('user_settings')
                    .upsert({ user_id: userId, ...settingsPayload }, { onConflict: 'user_id' });
                    
                if (directUpsert.error) throw directUpsert.error;
            }
            
            return res.json({ success: true });
        } catch (error) {
            console.error("Settings save error:", error);
            return res.status(500).json({ error: "Failed to save settings." });
        }
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
}
