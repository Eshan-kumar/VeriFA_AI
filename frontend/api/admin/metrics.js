import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
        const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY);
        
        const { data, error } = await supabaseAdmin
            .from('evaluations')
            .select('id, user_id, overall_score, ethical_scores, created_at')
            .order('created_at', { ascending: false });

        if (error) throw error;

        const evaluations = data || [];
        const totalEvals = evaluations.length;
        
        const avgScore = totalEvals 
            ? Math.round(evaluations.reduce((acc, curr) => acc + (curr.overall_score || 0), 0) / totalEvals)
            : 0;
            
        const uniqueUsers = new Set(evaluations.map(e => e.user_id).filter(Boolean)).size;

        const feed = evaluations.slice(0, 50).map(ev => ({
            id: ev.id,
            date: ev.created_at,
            user_id: ev.user_id,
            overall_score: ev.overall_score,
            toxicity_score: ev.ethical_scores?.Toxicity?.score || 1
        }));

        return res.json({
            success: true,
            totalEvals,
            avgScore,
            activeUsers: uniqueUsers,
            feed
        });
    } catch (error) {
        console.error("Admin Metrics Error:", error);
        return res.status(500).json({ error: "Failed to fetch admin metrics securely." });
    }
}
