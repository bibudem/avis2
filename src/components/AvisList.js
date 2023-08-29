'use client'

import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Link from 'next/link'
import { Alert, AlertTitle, Box, Fade, IconButton, ListItem, ListItemButton, ListItemText, Skeleton } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import Close from '@mui/icons-material/Close'
import DeleteRounded from '@mui/icons-material/Delete'
import { withSnackbar } from 'hooks/withSnackbar'
import { useDataLastUpdated } from 'hooks/useDataLastUpdated'

export default withSnackbar(function AvisList({ showSnackbar, children }) {

  const [dataLastUpdated, updateDataLastUpdated] = useDataLastUpdated()
  const [avisList, setAvisList] = useState([])
  const [avisListLoading, setAvisListLoading] = useState(true)
  const [error, setError] = useState(null)
  const [alertOpen, setAlertOpen] = useState(false)
  const dispatch = useDispatch()

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
              height={50}
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
    <Grid
      container
      direction='column'
      flexWrap='nowrap'
      gap={2}
    >
      {
        avisList.map(avis => (
          <Grid
            key={avis._id}
            container
            wrap='norwap'
            alignItems='center'
            border={1}
            borderColor='divider'
          >
            <Grid xs>
              <ListItem
                component='div'
                key={avis._id}
                disablePadding
                disableGutters
                sx={{
                }}
              >
                <ListItemButton
                  role={undefined}
                  component={Link}
                  href={`/dashboard/avis/${avis._id}/edit`}
                  sx={{
                    // p: 0,
                  }}

                >
                  <ListItemText primary={<div dangerouslySetInnerHTML={{ __html: avis.message }}></div>}></ListItemText>
                </ListItemButton>
              </ListItem>
            </Grid>
            <Grid>
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
                onClick={() => onDeleteBtnClick(avis._id)}
              >
                <DeleteRounded fontSize='inherit' />
              </IconButton>
            </Grid>
          </Grid>
        ))
      }
    </Grid>
  )
})