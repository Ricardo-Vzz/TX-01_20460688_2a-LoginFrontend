'use client';
import { request } from 'http';
/**
 * En next.js los componentes se dividen en dos tipos: estaticos y de tipo cliente;
 * - Los componetes estaticos son los que no tienen logica, solo se encargan de mostrar la informacion 
 * - Los de tipo cliente son los que se encargan de la logica de la pagina
 * 
 * En este caso el componente Login es de tipo cliente porque se encarga de la logica de la pagina
 */

import {useState, useEffect, use} from 'react';

interface loginRequest{
    username: string;
    password: string;
    csrfToken: string;
}

export default function Login(){

    //Controlar estados de los inputs (actualizar el estado a valores predeterminados vacíos)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [csrfToken, setCsrfToken] = useState('');

    //Obtener el token de CSRF (a través de una petición fetch)
    useEffect(() => {
        const getcSRFToken = async () => {//funcion asincrona (crea un nuevo hilo para ejecutar la funcion)
            const response = await fetch('http://localhost:3001/csrf-token'); //esperamos la respuesta de la petición
            const data = await response.json();
            setCsrfToken(data.csrfToken); //actualizamos CSRF
        }
        //llamado a funcion que obtiene el token de CSRF (porque se necesita antes de hacer el submit)
        getcSRFToken();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {//e = evento del envio del formulario
        e.preventDefault();
        try {
        const request: loginRequest = { username, password, csrfToken };
        //Aquí se hace la petición al servidor para iniciar sesión (se envía el token de CSRF)
        //El servidor se encarga de verificar el token de CSRF y la contraseña (si es correcta o no)
        const response = await fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(request)
        });
        const data = await response.json();
        if (data.error){
            alert(data.error);
            return;
        }
        alert('Login successful');
        }catch (error) {
            alert('Login failed');
        }
    }

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Usuario</label>
                    <input type="text" id="username" onChange={(e)=> setUsername(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" onChange={(e)=> setPassword(e.target.value)} required autoFocus/>
                </div>
                <input type="hidden" id="csrfToken" value={csrfToken}/>
                <button type="submit">Iniciar Sesión</button>
            </form>
        </div>
    )
}