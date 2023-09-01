import { useContext } from 'react'
import { SnackbarContext } from './Snackbar'

export function useSnackbar(defaultOptions = {}) {
  const { openSnackbar, closeSnackbar } = useContext(SnackbarContext)

  function open(message, options) {

    openSnackbar({
      message,
      ...defaultOptions,
      ...options
    })
  }

  return [open, closeSnackbar]
}