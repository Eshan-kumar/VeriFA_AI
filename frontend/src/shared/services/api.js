/**
 * API Service for Backend Communication
 * Connects to Vercel Serverless Functions
 */

const envBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
// Sanitize trailing slash
const sanitizedBaseUrl = envBaseUrl.endsWith('/') ? envBaseUrl.slice(0, -1) : envBaseUrl;
export const API_BASE_URL = envBaseUrl === '/api' ? '/api' : `${sanitizedBaseUrl}/api`;

async function request(endpoint, options = {}) {
  // If API_BASE_URL is '/api', don't append it again if endpoint already has it, 
  // but for consistency we expect endpoint to be like '/settings'
  const url = `${API_BASE_URL}${endpoint}`
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "An error occurred during request.")
    }

    return data
  } catch (err) {
    console.error(`API Error [${endpoint}]:`, err)
    throw err
  }
}

export const settingsApi = {
  async getSettings(userId) {
    const query = userId ? `?userId=${encodeURIComponent(userId)}` : ""
    return request(`/settings${query}`, { method: "GET" })
  },

  async saveSettings(settingsData) {
    return request("/settings", {
      method: "POST",
      body: JSON.stringify(settingsData),
    })
  },
}
