'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../estilos.css';

interface LoginRequest {
  username: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const request: LoginRequest = { username, password};
    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      const data = await response.json();
      
      if (response.ok) {
        router.push("/dashboard");
      } else {
        alert(data.error || "Error en el inicio de sesión");
      }

      if (data.error) {
        alert(data.error);
        return;
      }

      alert('Inicio de sesión exitoso');
    } catch {
      alert('Error en el inicio de sesión');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Bienvenido</h1>
        <p className="login-subtitle">Inicia sesión en tu cuenta para continuar</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input
              type="text"
              id="username"
              name="username"
              required
              onChange={(e) => setUsername(e.target.value)}
              className="input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />
          </div>
          <button type="submit" className="button-primary">Iniciar Sesión</button>
          <a href="/signup" className="button-secondary">Crear Nueva Cuenta</a>
        </form>
      </div>
    </div>
  );
}
