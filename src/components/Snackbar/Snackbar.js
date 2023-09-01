import { createContext, useEffect, useState } from 'react'
import { IconButton, Snackbar as MUISnackbar, Portal } from '@mui/material'
import Slide from '@mui/material/Slide'
import { snackbarAutoHideDuration } from '@/config/app'
import { Close } from '@mui/icons-material'

function SlideUp(props) {
  return <Slide {...props} direction='up' />
}

export const SnackbarContext = createContext(null)

export default function SnackbarProvider({ children }) {

  const [open, setOpen] = useState(false)
  const [_message, setMessage] = useState('')
  const [_showCloseButton, setShowCloseButton] = useState(false)
  const [_action, setAction] = useState(null)
  const [_autoHide, setAutoHide] = useState(true)
  const [autoHideDuration, setAutoHideDuration] = useState(null)

  // 

  function openSnackbar({ autoHide = true, message, action = null, showCloseButton = false }) {

    setMessage(message)
    setShowCloseButton(showCloseButton)
    setAction(action)
    setAutoHide(autoHide)
    setOpen(true)
  }

  function closeSnackbar() {
    setOpen(false)
  }

  function CloseButton() {
    return (
      <IconButton
        aria-label='fermer'
        color='inherit'
        sx={{ p: 0.5 }}
        onClick={closeSnackbar}
      >
        <Close />
      </IconButton>
    )
  }

  function onSnackbarClose(event, reason) {
    if (!_autoHide && reason === 'clickaway') {
      // Don't close the snackbar on click away when option autoHide === true
      event.preventDefault()
      return
    }

    // Otherwise, close the snackbar
    closeSnackbar()
  }

  useEffect(() => {
    setAutoHideDuration(_autoHide ? snackbarAutoHideDuration : null)
  }, [_autoHide])

  // Returns the Provider that must wrap the application
  return (
    <SnackbarContext.Provider value={{ openSnackbar, closeSnackbar }}>
      {children}
      <Portal>
        <MUISnackbar
          autoHideDuration={autoHideDuration}
          message={_message}
          open={open}
          ContentProps={{ sx: { alignItems: 'flex-start' } }}
          sx={{
            '& .MuiSnackbarContent-action': {
              pt: .5
            }
          }}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          action={
            <>
              {
                _action
              }
              {
                _autoHide ? (
                  _showCloseButton && <CloseButton />
                ) : (
                  !_action && (
                    <CloseButton />
                  )
                )
              }
            </>
          }
          TransitionComponent={SlideUp}
          onClose={onSnackbarClose}
        />
      </Portal>
    </SnackbarContext.Provider>
  )
}