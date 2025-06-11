'use client';

import React from 'react';
import { Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function SigninWithAzure() {
    const handleSignIn = () => {
        if(localStorage.getItem('session')){
            localStorage.removeItem('session');
        }
        // Rediriger vers la route d'authentification Azure
        window.location.href = '/api/auth/login';
    };

    return (
        <Button
            variant="contained"
            color="primary"
            sx={{
                borderRadius: '60px',
                display: 'flex',
                height: '50px',
                padding: '0px 20px 0px 25px',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
            }}
            onClick={handleSignIn}
        >
            <span>Connectez-vous</span>
            <ArrowForwardIcon /> {/* Ajout de l'icône de flèche */}
        </Button>
    );
}
