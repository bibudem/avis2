import { Card, CardContent,Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import SigninWithAzure from '@/components/auth/SignInWithAzure'

export default async function SigninPage() {

    return (
        <Grid
            container
            direction='column'
            alignItems='center'
            justifyContent='center'
            height='50vh'
            sx={{ textAlign: 'center', padding: '20px' }}
        >
            <Grid item>
                <Card sx={{ padding: '30px' }}>
                    <CardContent>
                        <Typography variant="h4" sx={{ marginBottom: '20px' }}>
                            Bienvenue!
                        </Typography>
                        <Grid container direction="column" spacing={5}>
                            <Grid item>
                                <Card>
                                    <CardContent sx={{ margin: '20px' }}>
                                        <SigninWithAzure />
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}
