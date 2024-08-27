'use client';

import { useEffect, useState, useCallback } from 'react';
import { AppBar as MuiAppBar,  Toolbar, Box, IconButton, Menu, MenuItem, Typography, ListItemIcon } from '@mui/material';
import Link from "next/link";
import Image from 'next/image';
import logoImage from '@/images/biblio-logo-sans.png';
import Logout from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';

export default function AppBar() {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [nameUser, setNameUser] = useState(null);

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
      const { givenName, familyName } = JSON.parse(storedSession);
      setNameUser(`${givenName} ${familyName}`);
    } else {
      // Rediriger vers la page de connexion si aucune session n'est trouvée
      window.location.href = '/api/auth/login';
    }
  }, []);

  return (
      <MuiAppBar position="static" style={{ background: '#0b113a'}}>
        <Toolbar>
          <Link href="/admin" passHref>
            <Image
                src={logoImage}
                alt="Logo"
                style={{ cursor: 'pointer', width: '100%', height:'45px' }}
            />
          </Link>
          <Typography variant="h6" noWrap component="div" style={{ marginLeft:'10px' }}>
            Avis
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box>
            {nameUser ? (
                <>
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <PersonIcon sx={{ bgcolor: 'white', color: 'secondary' }} />
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
