'use client'

import { SessionProvider } from 'next-auth/react'
import SnackbarProvider from '@/components/Snackbar/Snackbar'
import ThemeRegistry from '@/components/ThemeRegistry/ThemeRegistry'
import { StoreProvider } from '@/redux/store'

export function Providers({ children }) {
  return (
    <StoreProvider>
      <SessionProvider>
        <ThemeRegistry>
          <SnackbarProvider>
            {children}
          </SnackbarProvider>
        </ThemeRegistry>
      </SessionProvider>
    </StoreProvider>
  )
}