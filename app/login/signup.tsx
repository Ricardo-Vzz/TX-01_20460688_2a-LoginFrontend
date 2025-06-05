"use client"
import { useState, useEffect } from "react"
import type React from "react"
import { useRouter } from "next/navigation"
import "./login.css"

interface SignupRequest {
  username: string
  password1: string
  password2: string
  csrfToken: string
}

export default function SignupPage() {
  const [username, setUsername] = useState("")
  const [password1, setPassword1] = useState("")
  const [password2, setPassword2] = useState("")
  const [csrfToken, setCsrfToken] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch("http://localhost:3001/csrf-token")
        const data = await response.json()
        setCsrfToken(data.csrfToken)
      } catch (error) {
        setError("Error al obtener token de seguridad")
      }
    }
    fetchCsrfToken()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    // Validaciones en el frontend
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/

    // Verificar que las contraseñas coincidan
    if (password1 !== password2) {
      setError("contraseñas no coinciden")
      setLoading(false)
      return
    }

    if (!usernameRegex.test(username)) {
      setError("El usuario debe tener entre 3 y 20 caracteres alfanuméricos, guiones o guiones bajos.")
      setLoading(false)
      return
    }

    if (!passwordRegex.test(password1)) {
      setError(
        "La contraseña debe tener mínimo 8 caracteres, incluyendo mayúsculas, minúsculas, un número y un carácter especial.",
      )
      setLoading(false)
      return
    }

    const request: SignupRequest = { username, password1, password2, csrfToken }

    try {
      const response = await fetch("http://localhost:3001/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(request),
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
        return
      }

      // Registro exitoso
      setSuccess(data.message)

      // Limpiar formulario
      setUsername("")
      setPassword1("")
      setPassword2("")

      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        router.push("/auth/login")
      }, 2000)
    } catch (error) {
      setError("Error en el registro")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Crear Cuenta</h1>
        <p className="login-subtitle">Regístrate para crear una nueva cuenta</p>

        {error && <div className="error-message">{error}</div>}

        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input
              type="text"
              id="username"
              name="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input"
              disabled={loading}
              placeholder="3-20 caracteres alfanuméricos, guiones o guiones bajos"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password1">Contraseña</label>
            <input
              type="password"
              id="password1"
              name="password1"
              required
              value={password1}
              onChange={(e) => setPassword1(e.target.value)}
              className="input"
              disabled={loading}
              placeholder="Mín. 8 caracteres, mayúscula, minúscula, número y símbolo"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password2">Confirmar Contraseña</label>
            <input
              type="password"
              id="password2"
              name="password2"
              required
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              className="input"
              disabled={loading}
              placeholder="Repite la contraseña"
            />
          </div>

          <input type="hidden" value={csrfToken} name="csrfToken" />
          <button type="submit" className="button-primary" disabled={loading || !csrfToken}>
            {loading ? "Creando cuenta..." : "Crear Cuenta"}
          </button>
          <a href="/auth/login" className="button-secondary">
            Ya tengo una cuenta
          </a>
        </form>
      </div>
    </div>
  )
}
