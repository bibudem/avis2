'use client'

import { Fab } from '@mui/material'
import Add from '@mui/icons-material/Add'
import { create } from '@/actions'
import { useSmall } from '@/hooks/useSmall'
import noop from '@/utils/noop'

export default function AddAvisButton({ onSuccess = noop }) {
  const isSmall = useSmall()

  function onClick() {
    create()
      .then(result => {
        console.log('result: %o', result)
        if (result.success) {
        }
        onSuccess.apply(null, result.data)
      })
      .catch(error => {
        console.error('error: %o', error)
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