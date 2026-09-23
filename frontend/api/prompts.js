import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // Initialize Supabase Admin Client
        const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
        const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY);

        const { category } = req.query;

        // Start building the query
        let query = supabaseAdmin.from('prompt_library').select('*');

        // Apply category filter if provided
        if (category) {
            query = query.eq('category', category);
        }

        // Execute the query
        const { data, error } = await query;

        if (error) {
            throw error;
        }

        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("Prompts fetch error:", error);
        return res.status(500).json({ error: "Failed to fetch prompts from the database." });
    }
}
