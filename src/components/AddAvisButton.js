'use client'

import { useTransition } from 'react'
import { Fab } from '@mui/material'
import Add from '@mui/icons-material/Add'
import { create } from '@/actions'
import { useSmall } from '@/hooks/useSmall'

export default function AddAvisButton() {
  const [isPending, startTransition] = useTransition()
  const isSmall = useSmall()

  function onClick() {
    startTransition(() => {
      create()
        .then(result => {
          console.log('result: %o', result)
        })
        .catch(error => {
          console.error('error: %o', error)
        })
    })
  }

  return (
    <Fab
      color='primary'
      sx={{
        position: 'fixed',
        bottom: isSmall ? '1rem' : '2rem',
        right: isSmall ? '1rem' : '2rem',
      }}
      onClick={onClick}
    >
      <Add />
    </Fab>
  )
}