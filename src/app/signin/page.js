import { Card, CardContent, Typography, Box } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import SigninWithAzure from '@/components/auth/SignInWithAzure';
import Image from 'next/image';
import logoImage from '@/images/biblio-logo.png'; // Import image

export default function SigninPage() {
    return (
        <Grid
            container
            direction='row'
            alignItems='center'
            height='100vh'
            sx={{ padding: 0, margin: 0 }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    marginTop: '-300px',
                    padding: '25px 0 0',
                }}
            >
                <Card sx={{ padding: '20px', maxWidth: 500, textAlign: 'center' }}>
                    <CardContent>
                        <Image
                            src={logoImage}
                            alt="Biblio Logo"
                            width={270}
                            style={{ marginBottom: '70px', height:'auto' }}
                        />
                        <Typography variant="h3" component="h3" color="secondary" sx={{ marginBottom: '20px',textShadow: '1px 1px 2px #000' }}>
                            PLATEFORME AVIS
                        </Typography>
                        <Typography variant="h4" component="h4" color="primary" sx={{ marginBottom: '50px' }}>
                            Accès réservé
                        </Typography>
                        <SigninWithAzure />
                    </CardContent>
                </Card>
            </Box>
        </Grid>
    );
}
