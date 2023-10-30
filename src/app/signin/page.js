import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { Card, CardContent } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import SigninWithGitHub from '@/components/auth/SignInWithGitHub'
import { authOptions } from '@/config/auth'

export default async function SigninPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/')
  }
  return (
    <Grid
      container
      direction='column'
      alignContent='center'
      height='100%'
    >
      <Card>
        <CardContent>
          <SigninWithGitHub />
        </CardContent>
      </Card>
    </Grid>
  )
}