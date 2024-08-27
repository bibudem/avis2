'use client';

import React from 'react';
import { Button } from '@mui/material';

export default function SigninWithAzure() {
    const handleSignIn = () => {
        if(localStorage.getItem('session')){
            localStorage.removeItem('session');
        }
        // Rediriger vers la route d'authentification Azure
        window.location.href = '/api/auth/login';
    };

    return (
        <Button variant='contained' color='primary' sx={{ marginBottom: '20px' }} onClick={handleSignIn}>
            Connectez-vous
        </Button>
    );
}
