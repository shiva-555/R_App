import React from 'react';
import {Outlet, Navigate} from 'react-router-dom';

const ProtectedRoutes = ({isAuthenticated, children, isAuthorized, redirectPath}) => {

    if(!isAuthenticated) {
        return <Navigate to='/login' replace />;
    }



    return children ? children : <Outlet />;
}

export default ProtectedRoutes;