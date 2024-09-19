'use client';

import { useEffect, useState, useCallback } from 'react';
import { AppBar as MuiAppBar, Toolbar, Box, IconButton, Menu, MenuItem, Typography, ListItemIcon } from '@mui/material';
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
      // Si les données de session sont présentes dans localStorage, on les utilise
      const { givenName, familyName } = JSON.parse(storedSession);
      setNameUser(`${givenName} ${familyName}`);
    } else {
      const currentUrl = window.location.pathname;
      if (currentUrl !== '/signin') {
      // Sinon, on effectue un fetch pour les récupérer
        const fetchSessionData = async () => {
          try {
            const response = await fetch('/api/auth/user');
            if (!response.ok) {
              // Si la réponse n'est pas ok, rediriger vers /signin
              console.error('Erreur lors de la récupération des données de session, redirection vers /signin');
              window.location.href = '/signin'; // Redirection vers /signin
              return;
            }

            const data = await response.json();
            const { givenName, familyName } = data;
            setNameUser(`${givenName} ${familyName}`);

            // Stocker les données dans localStorage pour les prochaines fois
            localStorage.setItem('session', JSON.stringify(data));
          } catch (error) {
            console.error(error);
          }
        };
      fetchSessionData();
      }
    }
  }, []);

  return (
      <MuiAppBar position="static" style={{ background: '#0b113a' }}>
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
                <IconButton onClick={() => window.location.href = '/api/auth/login'} sx={{ p: 0 }} />
            )}
          </Box>
        </Toolbar>
      </MuiAppBar>
  );
}
