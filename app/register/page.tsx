"use client"
import { useState } from "react"
import type React from "react"
import { useRouter } from "next/navigation"
import "../estilos.css"

export default function SignupPage() {
  const [username, setUsername] = useState("")
  const [password1, setPassword1] = useState("")
  const [password2, setPassword2] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    if (!username || !password1 || !password2) {
      setError("Todos los campos son obligatorios.")
      setLoading(false)
      return
    }

    if (password1 !== password2) {
      setError("Las contraseñas no coinciden.")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username,
          password: password1,
          confirmPassword: password2,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Error desconocido.")
        return
      }

      setSuccess(data.message || "Cuenta creada correctamente.")

      setUsername("")
      setPassword1("")
      setPassword2("")

      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (err) {
      setError("Error en el registro. Inténtalo más tarde.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Crear Cuenta</h1>
        <p className="login-subtitle">Regístrate para comenzar</p>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password1">Contraseña</label>
            <input
              type="password"
              id="password1"
              value={password1}
              onChange={(e) => setPassword1(e.target.value)}
              className="input"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password2">Confirmar Contraseña</label>
            <input
              type="password"
              id="password2"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              className="input"
              disabled={loading}
              required
            />
          </div>

          <button type="submit" className="button-primary" disabled={loading}>
            {loading ? "Registrando..." : "Crear Cuenta"}
          </button>

          <a href="/login" className="button-secondary">
            Ya tengo una cuenta
          </a>
        </form>
      </div>
    </div>
  )
}