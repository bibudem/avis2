'use client'

import Add from '@mui/icons-material/Add'
import { Fab } from '@mui/material'

export default function AddAvis() {

  return (
    <Fab
      color='primary'
      sx={{
        position: 'absolute',
        bottom: (theme) => theme.spacing(2),
        right: (theme) => theme.spacing(2),
      }}
    >
      <Add />
    </Fab>
  )
}