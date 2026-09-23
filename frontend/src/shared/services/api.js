/**
 * API Service for Backend Communication
 * Connects to Express backend for Passwordless Auth and Model Evaluation
 */

const envBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
// Sanitize trailing slash
const sanitizedBaseUrl = envBaseUrl.endsWith('/') ? envBaseUrl.slice(0, -1) : envBaseUrl;
export const API_BASE_URL = `${sanitizedBaseUrl}/api`;

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include", // Include cookies for httpOnly session handling
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

export const authApi = {
  /**
   * Request passwordless 6-digit OTP auth code (unified signup & login)
   */
  async requestAuth(email) {
    return request("/auth/request", {
      method: "POST",
      body: JSON.stringify({ email }),
    })
  },

  /**
   * Verify 6-digit OTP code or magic token and consume session
   */
  async verifyAuth({ email, otpCode, magicToken }) {
    return request("/auth/verify", {
      method: "POST",
      body: JSON.stringify({ email, otpCode, magicToken }),
    })
  },

  /**
   * Logout user and clear session cookie
   */
  async logout() {
    return request("/auth/logout", {
      method: "POST",
    })
  },

  /**
   * Get current authenticated user session
   */
  async getCurrentUser() {
    return request("/auth/me", {
      method: "GET",
    })
  },
}

export const chatApi = {
  async getChats(userId) {
    const query = userId ? `?userId=${encodeURIComponent(userId)}` : ""
    return request(`/chats${query}`, { method: "GET" })
  },

  async createChat(chatData) {
    return request("/chats", {
      method: "POST",
      body: JSON.stringify(chatData),
    })
  },

  async addMessage(chatId, message, title, userId) {
    return request(`/chats/${chatId}/messages`, {
      method: "POST",
      body: JSON.stringify({ message, title, userId }),
    })
  },

  async deleteChat(chatId) {
    return request(`/chats/${chatId}`, {
      method: "DELETE",
    })
  },

  async clearAllChats(userId) {
    return request("/chats", {
      method: "DELETE",
      body: JSON.stringify({ userId }),
    })
  },
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
