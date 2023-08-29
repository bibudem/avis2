import { useState } from 'react'
import { IconButton, Slide, Snackbar } from '@mui/material'
import Close from '@mui/icons-material/Close'

// eslint-disable-next-line react/display-name
export const withSnackbar = WrappedComponent => props => {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [duration, setDuration] = useState(6000)
  const [severity, setSeverity] = useState('success') /** error | warning | info */

  const showMessage = (message, severity = "success", duration = 6000) => {
    setMessage(message)
    setSeverity(severity)
    setDuration(duration)
    setOpen(true)
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }

  return (
    <>
      <WrappedComponent {...props} showSnackbar={showMessage} />
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        autoHideDuration={duration}
        open={open}
        onClose={handleClose}
        TransitionComponent={Slide}
        message={message}
        sx={{ bottom: { xs: 90, sm: 0 } }}
        action={
          <IconButton
            size='small'
            aria-label='fermer'
            color='inherit'
            onclick={handleClose}
          >
            <Close fontSize='inherit' />
          </IconButton>
        }
      />
    </>
  )
}