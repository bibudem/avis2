//list.js
'use client'

import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Alert, AlertTitle, Fade, IconButton, Skeleton, useTheme } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import Close from '@mui/icons-material/Close'
import { withSnackbar } from '@/hooks/withSnackbar'
import { useDataLastUpdated } from '@/hooks/useDataLastUpdated'
import { AvisListItem } from './AvisListItem'

export default withSnackbar(function List({ showSnackbar, children }) {

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
        //console.error('An error occured while fetching `/api/avis`: %o', error)
        setError(error)
        setAlertOpen(true)
      } finally {
        setAvisListLoading(false)
      }
    }

    fetchAvisList()
  }, [dataLastUpdated])

  useEffect(() => {
    //console.log('dataLastUpdated: %o', dataLastUpdated)
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
        {
          avisList.map(avis => (
              <AvisListItem key={avis.id} avis={avis} onDelete={() => onDeleteBtnClick(avis.id)} />
          ))
        }
      </List>
  )
})
