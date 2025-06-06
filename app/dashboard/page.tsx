'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import '../estilos.css';

export default function DashboardPage() {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch('/api/dashboard', {
          credentials: 'include',
        });

        if (res.status === 401) {
          router.push('/login');
          return;
        }

        const data = await res.json();
        setUsername(data.username);
      } catch (err) {
        console.error('Error al cargar el dashboard:', err);
        setError('Hubo un error al cargar tu información.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    } finally {
      router.push('/login');
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

 return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Dashboard</h1>
        <p className="login-subtitle">Bienvenido, {username}</p>

        <div className="dashboard-content">
          <button onClick={handleLogout} className="button-primary">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}