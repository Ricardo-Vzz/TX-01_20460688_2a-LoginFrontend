'use client';
import { useEffect, useState } from 'react';

interface DashboardResponse {
  username: string;
  message: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Verificar sesión al montar
  useEffect(() => {
    const verificarSesion = async () => {
      try {
        const response = await fetch('/api/signup', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.status === 401) {
          setError('Sesión no válida o expirada. Por favor, inicia sesión nuevamente.');
          setLoading(false);
          return;
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError('Error al verificar la sesión.');
      } finally {
        setLoading(false);
      }
    };

    verificarSesion();
  }, []);

  const cerrarSesion = async () => {
    try {
      await fetch('/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      setError('Sesión cerrada');
    } catch {
      setError('Error al cerrar sesión');
    }
  };

  if (loading) return <p>Cargando sesión...</p>;

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <a href="/login">Ir al inicio de sesión</a>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Bienvenido, {user?.username}</h1>
      <p>{user?.message}</p>
      <button onClick={cerrarSesion}>Cerrar Sesión</button>
    </div>
  );
}
