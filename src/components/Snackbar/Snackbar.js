import { createContext, useEffect, useState } from 'react'
import { Alert, IconButton, Snackbar as MUISnackbar, Portal } from '@mui/material'
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
  const [_severity, setSeverity] = useState(undefined) /** success | error | warning | info */
  const [autoHideDuration, setAutoHideDuration] = useState(null)

  // 

  function openSnackbar({ autoHide = true, message, action = null, showCloseButton = false, severity = undefined }) {

    setMessage(message)
    setShowCloseButton(showCloseButton)
    setAction(action)
    setAutoHide(severity ? false : autoHide)
    setOpen(true)
    setSeverity(severity)
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
          message={!_severity && _message}
          open={open}
          ContentProps={{ sx: { alignItems: 'flex-start' } }}
          sx={{
            fontWeight: 500,
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
        >
          {
            _severity && (
              <Alert
                severity={_severity}
                variant='filled'
                elevation={6}
                action={<CloseButton />}
              >
                {_message}
              </Alert>
            )
          }
        </MUISnackbar>
      </Portal>
    </SnackbarContext.Provider>
  )
}