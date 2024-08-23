// ListItem.js
'use client';

import { useState } from 'react';
import { Collapse, ListItem as MUIListItem } from '@mui/material';
import Avis from './Avis';

export default function ListItem({ avis, onDelete, onStateChange }) {
  const [collapsed, setCollapsed] = useState(false);

  const handleDelete = async () => {
    await onDelete();
    setCollapsed(true);
  };

  const handleStateChange = async () => {
    await onStateChange();
    setCollapsed(true);
  };

  return (
      <Collapse
          in={!collapsed}
          appear={true}
          addEndListener={(node, done) => {
            done();
          }}
      >
        <MUIListItem sx={{ px: 0 }}>
          <Avis avis={avis} variant='outlined' onDelete={handleDelete} onSetActive={handleStateChange} />
        </MUIListItem>
      </Collapse>
  );
}
