import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFoundPage = () => {
    return (
        <Container maxWidth="sm" sx={{ textAlign: 'center', padding: '50px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <ErrorOutlineIcon sx={{ fontSize: 100, color: 'error', marginBottom: '20px' }} />
                <Typography variant="h2" component="h1" sx={{ fontSize: '4rem', color: 'orange', marginBottom: '20px' }}>
                    404 - Page non trouvée
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '1.5rem' }}>
                    Désolé, la page que vous recherchez n'existe pas.
                </Typography>
            </Box>
        </Container>
    );
};

export default NotFoundPage;
