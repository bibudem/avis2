"use client";

import { useEffect, useState } from 'react';

const ClientPage = () => {
    const [session, setSession] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSessionData = async () => {
            try {
                const response = await fetch('/api/auth/user', {
                    credentials: 'include' // Important pour inclure les cookies
                });

                if (response.ok) {
                    const data = await response.json();
                    setSession(data);
                } else if (response.status === 401) {
                    // Si non authentifié, rediriger vers la page de connexion
                    window.location.href = '/api/auth/login';
                } else {
                    throw new Error('Failed to fetch session data');
                }
            } catch (err) {
                console.error('Error fetching session data:', err);
                setError(err);
            }
        };

        fetchSessionData();
    }, []);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

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
                <p>Loading session data...</p>
            )}
        </div>
    );
};

export default ClientPage;
