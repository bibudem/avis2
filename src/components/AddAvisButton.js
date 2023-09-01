'use client'

import { useTransition } from 'react'
import { Fab } from '@mui/material'
import Add from '@mui/icons-material/Add'
import { create } from '@/actions'

export default function AddAvisButton() {
  const [isPending, startTransition] = useTransition()

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
        position: 'absolute',
        bottom: '2rem',
        right: '2rem',
      }}
      onClick={onClick}
    >
      <Add />
    </Fab>
  )
}