'use client'

import { signIn } from 'next-auth/react'
import { SvgIcon } from '@mui/material'
import Button from '@/components/Button'
import LogoUdeM from '@/images/logo-udem.svg'

export default function SigninWithGitHub() {

  return (
    <form>
      <Button
        startIcon={<SvgIcon component={LogoUdeM} inheritViewBox />}
        variant='outlined'
        onClick={() => signIn('udem')}
      >
        Connectez-vous
      </Button>
    </form>
  )
}