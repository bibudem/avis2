'use client'

import { useState, useMemo } from 'react'
import { Card, CardActions, CardContent, Checkbox, Collapse, FormControlLabel, IconButton, ListItem, Switch } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import DeleteRounded from '@mui/icons-material/Delete'
import EditAvis from '@/components/EditAvis'
import { useSnackbar } from '@/components/Snackbar/useSnackbar'
import { useSmall } from '@/hooks/useSmall'
import { del, setActive } from '@/actions'

export default function AvisListItem({ avis }) {
  const [checked, setChecked] = useState(avis.active)
  const isSmall = useSmall()
  const [openSnackbar] = useSnackbar()
  const [collapsed, setCollapsed] = useState(false)

  async function onSetActive() {
    try {
      setChecked(!checked)
      const result = await setActive(avis.id)

      if (!result.success) {
        setChecked(checked)
        openSnackbar(result.message, { severity: 'error' })
      }
    } catch (error) {
      console.log('catch error: %o', error)
    }
  }

  async function onDelete() {
    try {
      const result = await del(avis.id)
      console.log('deleted: %o', result)

      if (result.success) {
        openSnackbar('Message supprimé')
      } else {
        setCollapsed(false)
        openSnackbar(result.message, { severity: 'error' })
      }
    } catch (error) {
      console.error('Error deleting: %o', error)
    }
  }

  useMemo(() => {
    setChecked(avis.active)
  }, [avis.active])

  return (
    <Collapse in={!collapsed} onExited={onDelete} appear={true}>
      <ListItem
        sx={{ px: 0 }}
      >
        <Card
          variant='outlined'
          sx={{ width: '100%' }}
        >
          <Grid
            container
            direction={isSmall ? 'column-reverse' : 'row'}
            wrap='norwap'
            alignItems={isSmall ? 'stretch' : 'center'}
            // border={isSmall ? null : 1}
            // borderColor='divider'
            component={CardContent}
          >
            <Grid xs
              border={isSmall ? 1 : null}
              borderColor='divider'
            >
              <EditAvis avis={avis} />
            </Grid>
            <Grid
              alignSelf={isSmall && 'flex-end'}
              alignItems={isSmall ? 'center' : 'flex-start'}
              component={CardActions}
            >
              <FormControlLabel
                control={<Switch
                  checked={checked}
                  onChange={onSetActive}
                />}
                // control={
                //   <Checkbox
                //     checked={checked}
                //     onChange={onSetActive}
                //   />
                // }
                label={isSmall ? null : checked ? 'Actif' : '\u00a0'}
                labelPlacement={isSmall ? 'start' : 'bottom'}
                componentsProps={{
                  typography: {
                    variant: 'caption',
                    color: 'text.secondary'
                  }
                }}
                sx={{
                  marginLeft: 0,
                  marginRight: 0
                }}
              />

              <IconButton
                aria-label='supprimer'
                // size='small'
                // edge='end'
                sx={{
                  opacity: .4,
                  transitionProperty: 'all',
                  ':hover': {
                    opacity: 1
                  }
                }}
                onClick={() => setCollapsed(true)}
              >
                <DeleteRounded fontSize='inherit' />
              </IconButton>
            </Grid>
          </Grid>
          <span />
        </Card>
      </ListItem>
    </Collapse >
  )
}