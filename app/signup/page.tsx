'use client';
import { useState, useEffect } from 'react';
import '../estilos.css';

interface RegisterRequest {
  username: string;
  password: string;
  confirmPassword: string;
  csrfToken: string;
}

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    const fetchCsrfToken = async () => {
      const response = await fetch('http://localhost:3001/csrf-token');
      const data = await response.json();
      setCsrfToken(data.csrfToken);
    };
    fetchCsrfToken();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const request: RegisterRequest = {
      username,
      password,
      confirmPassword,
      csrfToken,
    };

    try {
      const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      alert('Cuenta creada correctamente');
    } catch {
      alert('Error al registrar la cuenta');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Crear Cuenta</h1>
        <p className="login-subtitle">Ingresa los datos para registrarte</p>

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

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input"
            />
          </div>

          <input type="hidden" value={csrfToken} name="csrfToken" />
          <button type="submit" className="button-primary">Registrarse</button>
          <a href="/login" className="button-secondary">Volver al Inicio de Sesión</a>
        </form>
      </div>
    </div>
  );
}