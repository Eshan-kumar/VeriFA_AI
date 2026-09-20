import { createContext, useContext, useEffect, useState } from"react"
import { supabase } from"../../lib/supabaseClient"

const AuthContext = createContext({
 user: null,
 loading: true,
 login: async () => {},
 signup: async () => {},
 logout: async () => {},
})

export const AuthProvider = ({ children }) => {
 const [user, setUser] = useState(null)
 const [loading, setLoading] = useState(true)

 useEffect(() => {
 // Get initial session
 supabase.auth.getSession().then(({ data: { session } }) => {
 setUser(session?.user ?? null)
 setLoading(false)
 })

 // Listen for auth state changes
 const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
 setUser(session?.user ?? null)
 setLoading(false)
 })

 return () => {
 subscription?.unsubscribe()
 }
 }, [])

 const login = async (email, password) => {
 const { data, error } = await supabase.auth.signInWithPassword({
 email,
 password,
 })
 if (error) throw error
 return data
 }

 const signup = async (email, password) => {
 const { data, error } = await supabase.auth.signUp({
 email,
 password,
 })
 if (error) throw error
 return data
 }

 const logout = async () => {
 const { error } = await supabase.auth.signOut()
 if (error) throw error
 setUser(null)
 }

 return (
 <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
 {children}
 </AuthContext.Provider>
 )
}

export const useAuth = () => {
 return useContext(AuthContext)
}
