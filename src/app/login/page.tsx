"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      router.push("/dashboard")
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 relative overflow-hidden">
      {/* Bakgrunnsbilde av håndverker */}
      <img
        src="https://images.unsplash.com/photo-1618090584176-7132b9911657?q=80&w=1828&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Håndverker bakgrunn"
        className="absolute inset-0 w-full h-full object-cover opacity-40 z-0"
        aria-hidden="true"
      />
      {/* Mørk overlay for bedre lesbarhet */}
      <div className="absolute inset-0 bg-gray-950/70 z-10" aria-hidden="true"></div>
      <form onSubmit={handleLogin} className="relative z-20 bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-sm border border-gray-800">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-100">Logg inn</h1>
        <div className="mb-4">
          <label className="block mb-1 text-gray-300">E-post</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-700 rounded bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600"
            required
            placeholder="din@email.no"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-300">Passord</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-700 rounded bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600"
            required
            placeholder="••••••••"
          />
        </div>
        {error && <div className="mb-4 text-red-400 text-sm">{error}</div>}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed font-semibold mt-2"
          disabled={loading}
        >
          {loading ? "Logger inn..." : "Logg inn"}
        </button>
        <button
          type="button"
          onClick={handleRegister}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed font-semibold mt-2"
          disabled={loading}
        >
          {loading ? "Oppretter bruker..." : "Opprett bruker"}
        </button>
      </form>
    </div>
  )
}
