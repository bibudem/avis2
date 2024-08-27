"use client";

import { useEffect, useState } from 'react';

const ClientPage = () => {
    const [session, setSession] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            const storedSession = localStorage.getItem('session');
            if (storedSession) {
                const data = JSON.parse(storedSession);
                setSession(data);
            } else {
                // Si aucune session n'est trouvée, rediriger vers la page de connexion
                window.location.href = '/api/auth/login';
            }
        } catch (err) {
            console.log(err); // Log the error to the console
            setError(err); // Set the error to handle it if needed later
        }
    }, []);

    return (
        <div>
            <h1>Client Information</h1>
            {session ? (
                <div>
                    <p><strong>Email:</strong> {session.email}</p>
                    <p><strong>Family Name:</strong> {session.familyName}</p>
                    <p><strong>Given Name:</strong> {session.givenName}</p>
                </div>
            ) : (
                <p>No session data available</p>
            )}
        </div>
    );
};

export default ClientPage;
