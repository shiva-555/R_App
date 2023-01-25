
import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';


// //**********************************************Drawer**************************************************************************

import { useState } from 'react';

import { NavLink } from 'react-router-dom';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import Person3Icon from '@mui/icons-material/Person3';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import { Collapse } from "@mui/material";
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';




const drawerWidth = 250;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',


    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function MiniDrawer() {

  const role = window.localStorage.getItem('role');

  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const handleClose = () => {
    setDrawerOpen(false)
  }

  const handleClickOpen = () => {
    setDrawerOpen(true)
  }

  const handleClickAdmin = () => {
    setOpen(!open);
  }
  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  }));
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(true);

  const handleClick = () => {
    setOpen1(!open1);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <Drawer variant="permanent" open={open} sx={{ width: '20px' }} onMouseOver={handleDrawerOpen} onMouseOut={handleDrawerClose}>
        <DrawerHeader>
          {open ?
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>

            :
            <IconButton
              color="inherit"
              aria-label="open drawer"

              onClick={handleDrawerOpen}
              edge="start"

            > <MenuIcon /></IconButton>
          }
        </DrawerHeader>
        <Divider />

        {open &&
          <>
            <img src="/logos/logo-high.png" style={{ width: 'auto', background: 'white', height: 'auto' }} />
          </>
        }

        {!open &&
          <>
            <img src="/favicon.png" style={{ width: '30px', background: 'white', height: 'auto', marginLeft: '25px', marginTop: '10px', marginBottom: '100px' }} />
          </>

        }

        <List>

          <ListItem divider >
            <ListItemButton>
              <NavLink to={'/'} style={{ 'textDecoration': 'none', display: 'flex', alignItems: 'center', color: 'black' }}>
                <ListItemIcon>
                  <HomeOutlinedIcon />
                </ListItemIcon>
                <h3 style={{ p: '70px' }}>Home</h3>
              </NavLink>
            </ListItemButton>
          </ListItem>
          {(window.localStorage.getItem('role') === 'HR' || window.localStorage.getItem('role') === 'Recruiter' || window.localStorage.getItem('role') === 'TA Manager' || window.localStorage.getItem('role') === 'Admin' || window.localStorage.getItem('role') === 'HR Manager') &&
            <>
              <ListItem divider>
                <ListItemButton>
                  <NavLink to={'/candidates'} style={{ 'textDecoration': 'none', display: 'flex', alignItems: 'center', color: 'black' }}>
                    <ListItemIcon>
                      <Person3Icon />
                    </ListItemIcon>
                    <h3>candidates</h3>
                  </NavLink>
                </ListItemButton>
              </ListItem>
              <ListItem divider>
                <ListItemButton>
                  <NavLink to={'/jobRequisition'} style={{ 'textDecoration': 'none', display: 'flex', alignItems: 'center', color: 'black' }}>
                    <ListItemIcon>
                      <ArticleOutlinedIcon />
                    </ListItemIcon>
                    <h3>jobRequisition</h3>
                  </NavLink>
                </ListItemButton>
              </ListItem>
              {window.localStorage.getItem('role') !== 'HR' &&
                <>
                  <ListItem divider>
                    <ListItemButton>
                      <NavLink to={'/dashboard'} style={{ 'textDecoration': 'none', display: 'flex', alignItems: 'center', color: 'black' }}>
                        <ListItemIcon>
                          <DashboardIcon />
                        </ListItemIcon>
                        <h3>Dashboard</h3>
                      </NavLink>
                    </ListItemButton>
                  </ListItem>
                </>
              }

            </>
          }

          <ListItem divider>
            <ListItemButton>
              <NavLink to={'/referral'} style={{ 'textDecoration': 'none', display: 'flex', alignItems: 'center', color: 'black' }}>
                <ListItemIcon>
                  <Diversity3Icon />
                </ListItemIcon>
                <h3>referral</h3>
              </NavLink>
            </ListItemButton>
          </ListItem>



          {/* {(window.localStorage.getItem('role') === 'TA Manager' || window.localStorage.getItem('role') === 'Admin' || window.localStorage.getItem('role') === 'HR Manager') &&
            <> */}
              <ListItemButton onClick={handleClick} sx={{ pl: 4 }}>
                <ListItemIcon>
                  <AdminPanelSettingsIcon />
                </ListItemIcon>
                <h3>admin</h3>
                {open1 ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>

              <Collapse in={open1} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <NavLink to='/admin/users' style={{ 'textDecoration': 'none', display: 'flex', alignItems: 'center', color: 'black' }}>
                    <ListItemButton sx={{ pl: 4 }}>
                      <ListItemIcon>
                        <PersonOutlineOutlinedIcon />
                      </ListItemIcon>
                      <h3>Users</h3>
                    </ListItemButton>
                  </NavLink>


                  <NavLink to={'/admin/remainder'} style={{ 'textDecoration': 'none', display: 'flex', alignItems: 'center', color: 'black' }}>
                    <ListItemButton sx={{ pl: 4 }}>
                      <ListItemIcon>
                        <CircleNotificationsIcon />
                      </ListItemIcon>
                      <h3>Reminder</h3>
                    </ListItemButton>
                  </NavLink>

                  <NavLink to={'/admin/templates'} style={{ 'textDecoration': 'none', display: 'flex', alignItems: 'center', color: 'black' }}>
                    <ListItemButton sx={{ pl: 4 }}>
                      <ListItemIcon>
                        <ContentPasteIcon />
                      </ListItemIcon>
                      <h4 height={8} >RealTime Templates</h4>
                    </ListItemButton>
                  </NavLink>

                </List>
              </Collapse>

            {/* </>
          } */}
        </List>

      </Drawer>

    </Box >
  );
}




// import React, { useState, useContext } from 'react';
// import './Navbar.css';
// import { NavLink, Link, useLocation } from 'react-router-dom';
// import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
// import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
// import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
// import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
// import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
// import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
// import { UserContext } from '../Routes/Routes';

// const Navbar = () => {
//   const [isShown, setIsShown] = useState(false);
//   const value = useContext(UserContext);
//   const location = useLocation();

//   return (
//     <div className='navbar-container'>
//       <ul className='navbar-container__menu'>
//         <li className='navbar-container__item navbar-container__logo'>
//           <Link to={value.data.role? '/candidates' : '/'} className='navbar-container__links'>
//             <img className='navbar-container__img' src="/logos/logo-high.png" alt="" />
//           </Link>
//         </li>
//         {(value.data.assignedRoles.length <= 0) && <li className='navbar-container__item'>
//           <NavLink to='/' className='navbar-container__links'>
//             <HomeOutlinedIcon className='navbar-container__icons' />
//             <p className='navbar-container__content'>Home</p>
//           </NavLink>
//         </li>}

//         {
//           (value.data.assignedRoles.length > 0) &&
//           <>
//             <li className='navbar-container__item'>
//               <NavLink to='/candidates' className={`navbar-container__links ${location.pathname.endsWith('/interview') ? 'active' : ''}`}>
//                 <PeopleOutlineIcon className='navbar-container__icons' />
//                 <p className='navbar-container__content'>Candidates</p>
//               </NavLink>
//             </li>
//             <li className='navbar-container__item'>
//               <NavLink to='/jobRequisition' className='navbar-container__links'>
//                 <ArticleOutlinedIcon className='navbar-container__icons' />
//                 <p className='navbar-container__content'>Job Requisition</p>
//               </NavLink>
//             </li>

//             {!value.data.assignedRoles.some((assignedRole) => assignedRole.assignedRole.role === 'HR') &&
//               <>
//                 <li className='navbar-container__item'>
//                   <NavLink to='/dashboard' className='navbar-container__links'>
//                     <AnalyticsOutlinedIcon className='navbar-container__icons' />
//                     <p className='navbar-container__content'>Dashboard</p>
//                   </NavLink>
//                 </li>

//                 <li className='navbar-container__item'>
//                   <NavLink to='/referral' className='navbar-container__links'>
//                     <ConnectWithoutContactIcon className='navbar-container__icons' />
//                     <p className='navbar-container__content'>Referal</p>
//                   </NavLink>
//                 </li>

//               </>
//             }
//           </>
//         }
//         {value.data.assignedRoles.some((assignedRole) => assignedRole.assignedRole.role === 'Admin') &&
//           <>
//             <li className='navbar-container__item' onClick={(e) => { setIsShown(!isShown) }}>
//               <div className={`navbar-container__links ${(location.pathname.includes('/admin') && !isShown) ? 'active' : ''}`}>
//                 <PersonOutlineOutlinedIcon className='navbar-container__icons' />
//                 <p className='navbar-container__content'>Admin</p>
//               </div>
//               <ul className='navbar-container__secondaryMenu' style={{ display: isShown ? 'block' : 'none' }} >
//                 <li className='navbar-container__SubItem'>
//                   <NavLink to='/admin/users' className='navbar-container__links'>
//                     <p className='navbar-container__content'>Users</p>
//                   </NavLink>
//                 </li>
//                 <li className='navbar-container__SubItem'>
//                   <NavLink to='/admin/remainder' className='navbar-container__links'>
//                     <p className='navbar-container__content'>Reminder</p>
//                   </NavLink>
//                 </li>
//                 <li className='navbar-container__SubItem'>
//                   <NavLink to='/admin/templates' className='navbar-container__links'>
//                     <p className='navbar-container__content'>RealTime Templates</p>
//                   </NavLink>
//                 </li>
//               </ul>
//             </li>
//           </>
//         }
//       </ul>
//     </div>
//   );
// }

// export default Navbar;