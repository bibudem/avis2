'use client';

import { useEffect, useState, useCallback } from 'react';
import { AppBar as MuiAppBar, Avatar, Toolbar, Box, IconButton, Menu, MenuItem, Typography, ListItemIcon } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Logout from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';

export default function AppBar() {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [nameUser, setNameUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleOpenUserMenu = useCallback((event) => {
    setAnchorElUser(event.currentTarget);
  }, []);

  const closeUserMenu = useCallback(() => {
    setAnchorElUser(null);
  }, []);

  const onLogoutBtnClick = useCallback(() => {
    localStorage.removeItem('session');
    window.location.href = '/api/auth/logout';
    closeUserMenu();
  }, [closeUserMenu]);

  useEffect(() => {
    const storedSession = localStorage.getItem('session');
    if (storedSession) {
      const data = JSON.parse(storedSession);
      setNameUser(`${data.givenName} ${data.familyName}`);
    } else {
      // Si aucune session n'est trouvée, rediriger vers la page de connexion
      window.location.href = '/api/auth/login';
    }
    setIsLoading(false);
  }, []);

  if (isLoading) return <div>...</div>;

  return (
      <MuiAppBar position="static">
        <Toolbar>
          <DashboardIcon sx={{ mr: 1, transform: 'translateY(-2px)' }} />
          <Typography variant="h6" noWrap component="div">
            Avis
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box>
            {nameUser ? (
                <>
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <PersonIcon sx={{ bgcolor: 'white', color: 'black' }} />
                    <Typography variant="body1" sx={{ ml: 1, color: 'white' }}>
                      {nameUser}
                    </Typography>
                  </IconButton>
                  <Menu
                      sx={{ mt: '45px' }}
                      id="menu-appbar"
                      anchorEl={anchorElUser}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      open={Boolean(anchorElUser)}
                      onClose={closeUserMenu}
                  >
                    <MenuItem onClick={onLogoutBtnClick}>
                      <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
                      <Typography variant="body2">Déconnexion</Typography>
                    </MenuItem>
                  </Menu>
                </>
            ) : (
                <IconButton onClick={() => window.location.href = '/api/auth/login'} sx={{ p: 0 }}>
                </IconButton>
            )}
          </Box>
        </Toolbar>
      </MuiAppBar>
  );
}
