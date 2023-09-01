import { Box } from '@mui/material'

export default function DashboardLayout({ children, modal }) {

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