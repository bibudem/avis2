import { Box } from '@mui/material'

export default function DashboardLayout({ Component, pageProps, children, modal }) {
  console.log('Component: %o, pageProps: %o', Component, pageProps)
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
      </Box>
      {children}
      {modal}
    </>
  )
}