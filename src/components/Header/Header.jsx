import React, { useEffect, useState } from 'react';
import './Header.css';
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { useLocation } from 'react-router-dom';

const Header = () => {
  const isAuthenticated = useIsAuthenticated();
  const { instance } = useMsal();
  const [headerText, setHeaderText] = useState('')
  const location = useLocation();

  useEffect(() => {
   if(location.pathname === '/') {
    setHeaderText("Home");
   } else if(location.pathname.startsWith('/candidate') && !location.pathname.endsWith('/interview')) {
    setHeaderText("Candidates");
   } else if(location.pathname.endsWith('/interview')) {
    setHeaderText("Interviews");
   } else if(location.pathname.startsWith('/jobRequisition')) {
    setHeaderText("Job Requisition");
   } else if(location.pathname.startsWith('/dashboard')) {
    setHeaderText("Dashboard");
   } else if(location.pathname.startsWith('/admin')) {
    setHeaderText("Admin");
   } 
 }, [location.pathname]);

  function handleLogout(instance) {
    instance.logoutRedirect().then(() => {
    }).catch(e => {
      console.error(e);
    });
    window.localStorage.removeItem('role');
    window.localStorage.removeItem('token');
  };

  return (
    <div className='header-container'>
      {
        isAuthenticated && 
        <>
            <p className='header-container__header'>{headerText}</p>
            <div className='header-container__logout'>
                <p className='header-container__content'>Logout</p>
                <PowerSettingsNewIcon className='header-container__icon' onClick={() => handleLogout(instance)} /> 
            </div>
        </>
      }
    </div>
  )
};

export default Header;