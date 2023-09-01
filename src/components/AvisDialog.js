'use client'

import { Dialog, DialogContent, IconButton } from '@mui/material'
import Close from '@mui/icons-material/Close'
import EditAvis from '@/components/EditAvis'
import { useSmall } from '@/hooks/useSmall'
// import { useState } from 'react'

export default function AvisDialog({ avis }) {
  const isSmall = useSmall()
  // const navigate = useNav
  // const [dialogOpen, setDialogOpen] = useState(true)

  function closeDialog() {

  }

  return (
    <Dialog
      open={true}
      fullScreen={isSmall}
      fullWidth
      maxWidth='xl'
    >
      <IconButton
        aria-label='fermer'
        onClick={() => { closeDialog() }}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <Close />
      </IconButton>
      <DialogContent dividers>
        <EditAvis avis={avis} />
      </DialogContent>
    </Dialog>
  )
}