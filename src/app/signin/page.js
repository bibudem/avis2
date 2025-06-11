import { Card, CardContent, Typography, Box } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import SigninWithAzure from '@/components/auth/SignInWithAzure';
import Image from 'next/image';
import banierImage from '@/images/depot.jpg'; // Import image

export default function SigninPage() {
    return (
        <Grid
            container
            height="100vh"
            sx={{ padding: 0, margin: 0 }}
        >
            {/* Section image */}
            <Grid
                xs={12} md={7}
                sx={{
                    backgroundColor: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Image
                    src={banierImage}
                    alt="Biblio Logo"
                    style={{
                        maxWidth: '100%',
                        height: 'auto',
                    }}
                />
            </Grid>

            {/* Section texte et contenu */}
            <Grid
                xs={12} md={5}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    marginTop: '-20px'
                }}
            >
                <Card
                    sx={{
                        padding: '10px',
                        maxWidth: 500,
                        background:'none',
                        boxShadow:'none'

                    }}
                >
                    <Typography
                        variant="h3"
                        component="h3"
                        color="secondary"
                        sx={{
                            marginBottom: '20px',
                            fontFamily: 'Figtree, sans-serif',
                            fontSize: '56px',
                            fontStyle: 'normal',
                            textColor: '#0057AC',
                            fontWeight: 500,
                            lineHeight: '120%',
                            fontVariantNumeric: 'lining-nums tabular-nums',
                            fontFeatureSettings: "'liga' off, 'clig' off",
                        }}
                    >
                        Plateforme Avis
                    </Typography>
                    <Typography
                        variant="h4"
                        component="h4"
                        color="#F04E24"
                        sx={{ marginBottom: '50px',  }}
                    >
                        Accès réservé
                    </Typography>
                    <SigninWithAzure />
                </Card>
            </Grid>
        </Grid>
    );
}
