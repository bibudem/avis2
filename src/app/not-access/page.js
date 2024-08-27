"use client";

import { useEffect, useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const NotAccessPage = () => {
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
            console.log(err);
            setError(err);
        }
    }, []);

    return (
        <Container maxWidth="sm" sx={{ textAlign: 'center', marginTop: '50px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <LockOutlinedIcon sx={{ fontSize: 100, color: 'error', marginBottom: '30px' }} />
                <Typography variant="h2" component="h1" gutterBottom>
                    Accès réservé
                </Typography>
                <Typography variant="body1">
                    Si vous pensez que vous devez avoir accès à cette plateforme et que vous n'êtes pas capable de vous connecter,
                    veuillez nous écrire : <strong>service@bib.umontreal.ca</strong>
                </Typography>
            </Box>
        </Container>
    );
};

export default NotAccessPage;
