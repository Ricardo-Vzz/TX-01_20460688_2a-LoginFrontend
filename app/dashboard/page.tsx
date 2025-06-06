'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import '../estilos.css';

export default function DashboardPage() {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch('/api/dashboard', {
            credentials: 'include',
        });

        if (res.status === 401) {
          router.push('/login'); // Redirige si no hay sesión
          return;
        }

        const data = await res.json();
        setUsername(data.username);
      } catch (err) {
        console.error('Error al cargar el dashboard:', err);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
    });

    router.push('/login');
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Dashboard</h1>
        <p className="login-subtitle">Bienvenido, {username}</p>

        <div className="dashboard-content">
          <p>Contenido de tu aplicación aquí.</p>

          <button onClick={handleLogout} className="button-secondary">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}