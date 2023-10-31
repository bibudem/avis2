'use client'

import { Card, CardContent, Typography } from '@mui/material'
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
          <Typography
            fontStyle='italic'
            component='p'
            sx={{
              marginTop: 'var(--ck-spacing-large)',
              marginBottom: 'var(--ck-spacing-large)'
            }}
          >
            {children}
          </Typography>
        </Grid>
      </Grid>
      <span />
    </Card>
  )
}