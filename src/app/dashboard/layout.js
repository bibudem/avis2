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
        <h1>Admin page</h1>
      </Box>
      {children}
      {modal}
    </>
  )
}