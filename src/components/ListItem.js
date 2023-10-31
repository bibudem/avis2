'use client'

import { useEffect, useState } from 'react'
import { Collapse, ListItem as MUIListItem } from '@mui/material'
import Avis from './Avis'

export default function ListItem({ avis }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <Collapse
      in={!collapsed}
      appear={true}
      addEndListener={(node, done) => {
        // console.log('node: %o', node)
        done()
      }}
    >
      <MUIListItem
        sx={{ px: 0 }}
      >
        <Avis avis={avis} variant='outlined' onDelete={() => setCollapsed(true)} onSetActive={() => setCollapsed(true)} />
      </MUIListItem>
    </Collapse >
  )
}