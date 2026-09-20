import { Navigate } from"react-router-dom"
import { useAuth } from"../context/AuthContext"

export default function ProtectedRoute({ children }) {
 const { user, loading } = useAuth()

 if (loading) {
 return (
 <div className="flex h-screen w-screen items-center justify-center bg-[#0b0f17] text-white">
 <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
 </div>
 )
 }

 if (!user) {
 // If not authenticated, force routing to landing using the hash mechanism the app uses.
 // Or we can use Navigate if they use standard react-router. 
 // Wait, the app uses window.location.hash mostly, but we can do a Navigate component.
 // Given the app structure, we will just render null and redirect manually or use Navigate.
 window.location.hash ="#landing"
 return null
 }

 return children
}
