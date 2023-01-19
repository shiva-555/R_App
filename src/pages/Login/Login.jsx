import React, {useContext} from 'react';
import './Login.css';
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { loginRequest } from "../../authConfig";
import { Navigate } from 'react-router-dom';
import { UserContext } from '../../components/Routes/Routes';

const Login = () => {
    const value = useContext(UserContext);
    const { instance } = useMsal();
    const isAuthenticated = useIsAuthenticated();

    if(isAuthenticated) {
        // if (value.data.role) {
        //     return <Navigate to='/candidates' /> 
        // } else {
            return <Navigate to='/' />
        // }
    }

    function handleLogin(instance) {
        instance.loginPopup(loginRequest)
        .then((response) => {
            console.log(response);
        }).catch((error) => {
            console.log(error);
        });
    };

    return (
    <div className='login-container'>
        <p className='login-container__content'>Proceed with login</p>
        <button className='login-block__button' onClick={() => handleLogin(instance)}>
            Login
        </button>
    </div>
    )
}

export default Login;