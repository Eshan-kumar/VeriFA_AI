import { supabase } from "../../lib/supabaseClient"

export const chatService = {
  async fetchEvaluations(userId) {
    // Validate UUID format to prevent Postgres 22P02 errors
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!userId || !uuidRegex.test(userId)) return { evaluations: [] }
    
    const { data, error } = await supabase
      .from("evaluations")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching evaluations:", error)
      throw error
    }

    return { evaluations: data }
  },

  async saveEvaluation({ userId, targetChatbot, userPrompt, botResponse, metrics, overallScore }) {
    const { data, error } = await supabase
      .from("evaluations")
      .insert([
        {
          user_id: userId,
          target_chatbot: targetChatbot,
          user_prompt: userPrompt,
          bot_response: botResponse,
          ethical_scores: metrics,
          overall_score: overallScore
        }
      ])
      .select()
      .single()

    if (error) {
      console.error("Error saving evaluation:", error)
      throw error
    }

    return data
  },

  async deleteEvaluation(evaluationId) {
    const { error } = await supabase
      .from("evaluations")
      .delete()
      .eq("id", evaluationId)
    
    if (error) throw error
    return true
  }
}
