'use client'

import SnackbarProvider from '@/components/Snackbar/Snackbar'
import ThemeRegistry from '@/components/ThemeRegistry/ThemeRegistry'
import { StoreProvider } from '@/redux/store'
import { SessionProvider } from 'next-auth/react'

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