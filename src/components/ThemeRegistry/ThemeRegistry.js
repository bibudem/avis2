'use client'

import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import NextAppDirEmotionCacheProvider from './EmotionCache'
import theme from './theme'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'

export default function ThemeRegistry({ children }) {
  return (
    <NextAppDirEmotionCacheProvider options={{ key: 'mui', prepend: true }}>
      <CssVarsProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <style
          dangerouslySetInnerHTML={{
            __html: `:root {
              font-size: 18px;
            }
            ${theme.breakpoints.up('md')} {
              :root {
                font-size: 16px;
              }
            }`
          }}
        />
        {children}
      </CssVarsProvider>
    </NextAppDirEmotionCacheProvider>
  )
}
