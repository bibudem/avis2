'use client'

import { Card, CardContent } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useSmall } from '@/hooks/useSmall'

export default function AvisEmpty({ children }) {
  const isSmall = useSmall()

  return (
    <Card
      sx={{ width: '100%' }}
    >
      <Grid
        container
        direction='column'
        wrap='norwap'
        alignItems='center'
        component={CardContent}
      >
        <Grid xs
        >
          {children}
        </Grid>
      </Grid>
      <span />
    </Card>
  )
}