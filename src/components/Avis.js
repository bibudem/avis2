'use client';

import { useState, useEffect } from 'react';
import { Card, CardActions, CardContent, FormControlLabel, IconButton, Switch, useTheme } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import DeleteRounded from '@mui/icons-material/Delete';
import EditAvis from '@/components/EditAvis';
import { useSnackbar } from '@/components/Snackbar/useSnackbar';
import noop from '@/utils/noop';
import { useSmall } from '@/hooks/useSmall';
import { del, toggleActive } from '@/actions';

export default function Avis({ avis = { message: '', active: false }, variant, onDelete = noop, onSetActive = noop }) {
  const [checked, setChecked] = useState(avis.active);
  const [changed, setChanged] = useState(false);
  const [styles, setStyles] = useState({});
  const [out, setOut] = useState(true);
  const isSmall = useSmall();
  const [openSnackbar] = useSnackbar();
  const theme = useTheme();

  const baseChangedStyles = {
    borderRadius: 1,
    outlineStyle: 'dashed',
    outlineWidth: '1px',
    outlineColor: 'transparent',
    '& > .ck.ck-editor__editable.ck-focused:not(.ck-editor__nested-editable)': {
      transition: `all ${theme.transitions.duration.shortest}ms cubic-bezier(0.3, 0, 1, 1)`
    }
  };

  const changedStylesOff = {
    ...baseChangedStyles,
    outlineColor: 'var(--md-palette-warning-light)',
    borderColor: 'transparent',
    backgroundColor: 'rgb(237 108 2 / 3%)',
    transition: `all ${theme.transitions.duration.short}ms cubic-bezier(0, 0, 0, 1)`,
    ':hover': {
      outlineColor: 'var(--md-palette-warning-dark)'
    },
    '& > .ck-editor__editable:not(.ck-focused):hover': {
      borderColor: 'transparent'
    }
  };

  const changedStylesOn = {
    ...baseChangedStyles,
    transition: `all ${theme.transitions.duration.shortest}ms cubic-bezier(0.3, 0, 1, 1)`
  };

  async function onSetActiveBtnClick() {
    try {
      const active = !checked;
      setChecked(active);
      const result = await toggleActive(avis.id, active);

      if (!result.success) {
        setChecked(checked);
        openSnackbar(result.message, { severity: 'error' });
        return;
      }

      openSnackbar(active ? 'Avis publié.' : 'Avis retiré.', { severity: 'success' });
      onSetActive();
    } catch (error) {
      console.log('catch error: %o', error);
    }
  }

  async function onDeleteBtnClick() {
    try {
      const result = await del(avis.id);

      if (result.success) {
        onDelete();
        openSnackbar('Message supprimé');
      } else {
        openSnackbar(result.message, { severity: 'error' });
      }
    } catch (error) {
      console.error('Error deleting: %o', error);
    }
  }

  function onStateChange(state) {
    setChanged(state === 'changed');
  }

  function onEditAvisFocus() {
    setOut(false);
  }

  function onEditAvisBlur() {
    setOut(true);
  }

  useEffect(() => {
    setChecked(avis.active);
  }, [avis.active]);

  useEffect(() => {
    setStyles(changed && out ? changedStylesOff : changedStylesOn);
  }, [changed, out]);

  return (
      <Card
          variant={variant}
          sx={{ width: '100%' }}
      >
        <Grid
            container
            direction={isSmall ? 'column-reverse' : 'row'}
            wrap='nowrap'
            alignItems={isSmall ? 'stretch' : 'center'}
            component={CardContent}
        >
          <Grid xs
                border={isSmall ? 1 : null}
                borderColor='divider'
                sx={styles}
          >
            <EditAvis
                avis={avis}
                onStateChange={onStateChange}
                onBlur={onEditAvisBlur}
                onFocus={onEditAvisFocus}
            />
          </Grid>
          <Grid
              alignSelf={isSmall && 'flex-end'}
              alignItems={isSmall ? 'center' : 'flex-start'}
              component={CardActions}
          >
            <FormControlLabel
                control={<Switch
                    checked={checked}
                    onChange={onSetActiveBtnClick}
                />}
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
                sx={{
                  opacity: .4,
                  transitionProperty: 'all',
                  ':hover': {
                    opacity: 1
                  }
                }}
                onClick={onDeleteBtnClick}
            >
              <DeleteRounded fontSize='inherit' />
            </IconButton>
          </Grid>
        </Grid>
        <span />
      </Card>
  );
}
