'use client'

import { signIn } from 'next-auth/react'
import GitHub from '@mui/icons-material/esm/GitHub'
import Button from '@/components/Button'

export default function SigninWithGitHub() {

  return (
    <form>
      <Button
        startIcon={<GitHub />}
        variant='outlined'
        onClick={() => signIn('github')}
      >
        Connectez-vous
      </Button>
    </form>
  )
}