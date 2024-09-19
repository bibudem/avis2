'use client'
import SnackbarProvider from '@/components/Snackbar/Snackbar'
import ThemeRegistry from '@/components/ThemeRegistry/ThemeRegistry'
import { StoreProvider } from '@/redux/store'

export function Providers({ children }) {
  return (
    <StoreProvider>
        <ThemeRegistry>
          <SnackbarProvider>
            {children}
          </SnackbarProvider>
        </ThemeRegistry>
    </StoreProvider>
  )
}
