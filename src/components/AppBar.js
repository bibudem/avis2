'use client'

import { useEffect, useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { AppBar as MuiAppBar, Avatar, Toolbar, Box, IconButton, Menu, MenuItem, Typography, ListItemIcon } from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import Logout from '@mui/icons-material/Logout'

const settings = ['Profile', 'Account', 'Dashboard', 'Logout']

export default function AppBar({ children }) {

  const { data: session, status } = useSession()
  const [anchorElNav, setAnchorElNav] = useState(null)
  const [anchorElUser, setAnchorElUser] = useState(null)
  const [nameFirstLetter, setNameFirstLetter] = useState()

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  function closeUserMenu() {
    setAnchorElUser(null)
  }

  function onLogoutBtnClick() {
    signOut({ callbackUrl: '/' })
    closeUserMenu()
  }

  useEffect(() => {
    if (status === 'authenticated') {
      setNameFirstLetter(session.user.name[0])
      console.log(session)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  return (
    <>
      <MuiAppBar>
        <Toolbar>
          <DashboardIcon
            sx={{ mr: 1, transform: 'translateY(-2px)' }}
          />
          <Typography variant="h6" noWrap component="div">
            Avis
          </Typography>
          <Box
            sx={{ flexGrow: 1 }}
          />
          <Box sx={{ flexGrow: 0 }}>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar sx={{
                bgcolor: 'background.paper',
                color: 'grey.600'
              }}
              >
                {nameFirstLetter}
              </Avatar>
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
                <ListItemIcon><Logout /> </ListItemIcon>
                <Typography textAlign="center">Déconnexion</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </MuiAppBar>
      <Toolbar />
    </>
  )
}
