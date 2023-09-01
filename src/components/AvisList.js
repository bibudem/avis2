'use client'

import { useState, useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { TransitionGroup } from 'react-transition-group'
import { Alert, AlertTitle, Card, CardActions, CardContent, Collapse, Fade, FormControlLabel, IconButton, List, ListItem, Skeleton, Switch, useTheme } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import Close from '@mui/icons-material/Close'
import DeleteRounded from '@mui/icons-material/Delete'
import EditAvis from '@/components/EditAvis'
import { useSnackbar } from '@/components/Snackbar/useSnackbar'
import { withSnackbar } from '@/hooks/withSnackbar'
import { useDataLastUpdated } from '@/hooks/useDataLastUpdated'
import { useSmall } from '@/hooks/useSmall'
import { setActive } from '@/actions'

export default withSnackbar(function AvisList({ showSnackbar, children }) {

  const [dataLastUpdated, updateDataLastUpdated] = useDataLastUpdated()
  const [avisList, setAvisList] = useState([])
  const [avisListLoading, setAvisListLoading] = useState(true)
  const [error, setError] = useState(null)
  const [alertOpen, setAlertOpen] = useState(false)
  const dispatch = useDispatch()
  const theme = useTheme()

  // console.log('theme: %o', theme)

  async function onDeleteBtnClick(id) {
    try {
      await fetch(`/api/avis/${id}`, { method: 'delete' }).then(response => {
        if (!response.ok) {
          return Promise.reject('not ok')
        }
        // return response.json()
        showSnackbar('Message supprimé')
      })

      dispatch(updateDataLastUpdated())

    } catch (error) {
      alert(error)
    }
  }

  useEffect(() => {
    async function fetchAvisList() {
      try {
        const response = await fetch('/api/avis', {
          headers: {
            'Accept': 'application/json'
          }
        })
        const result = await response.json()

        if (result.success) {
          setAvisList(result.data)
        } else {
          throw result.data
        }
      } catch (error) {
        console.error('An error occured while fetching `/api/avis`: %o', error)
        setError(error)
        setAlertOpen(true)
      } finally {
        setAvisListLoading(false)
      }
    }

    fetchAvisList()
  }, [dataLastUpdated])

  if (avisListLoading) {
    return (

      <Grid
        container
        direction='column'
        flexWrap='nowrap'
        gap={2}
      >
        {
          (new Array(13)).fill(0).map((_, i) =>
            <Skeleton
              key={i}
              variant='rectangular'
              component='div'
              height={91.25}
            />
          )
        }
      </Grid>
    )
  }

  if (error) {
    return (
      <Fade in={alertOpen}>
        <Alert
          severity='error'
          action={
            <IconButton
              aria-label='fermer'
              color='inherit'
              size='small'
              onClick={() => setAlertOpen(false)}
            >
              <Close fontSize='inherit' />
            </IconButton>
          }
        >
          <AlertTitle>Erreur</AlertTitle>
          {error.message}
        </Alert>
      </Fade>
    )
  }

  return (
    <List>
      <TransitionGroup>
        {
          avisList.map(avis => (
            <Collapse key={avis._id}>
              <AvisListItem avis={avis} onDelete={() => onDeleteBtnClick(avis._id)} />
            </Collapse>
          ))
        }
      </TransitionGroup>
    </List>
  )
})

export function AvisListItem({ avis, onDelete = () => { } }) {
  const [checked, setChecked] = useState(avis.active)
  const isSmall = useSmall()
  const [openSnackbar, closeSnackbar] = useSnackbar()

  async function onAvisItemChange() {
    setChecked(!checked)
    const result = await setActive(avis._id)

    console.log('result: %o', result)

    if (!result.success) {
      setChecked(checked)
      openSnackbar(result.message, { autoHide: false })
    }
  }

  useMemo(() => {
    setChecked(avis.active)
  }, [avis.active])

  return (
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
            component={CardActions}
          >
            <FormControlLabel
              control={<Switch
                checked={checked}
                onChange={() => onAvisItemChange(avis)}
              />}
              label={checked ? 'Actif' : '\u00a0'}
              labelPlacement='bottom'
              componentsProps={{
                typography: {
                  variant: 'caption',
                  color: 'text.secondary'
                }
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
              onClick={() => onDelete()}
            >
              <DeleteRounded fontSize='inherit' />
            </IconButton>
          </Grid>
        </Grid>
        <span />
      </Card>
    </ListItem>
  )
}