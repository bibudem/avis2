import { useMediaQuery, useTheme } from '@mui/material'

export function useSmall() {
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down('md'))

  return isSmall
}