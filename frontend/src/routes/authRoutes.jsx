import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AuthLayout from '../pages/auth/auth-layout';
import Login from './../pages/auth/login';
import SignUp from './../pages/auth/sign-up';
import ForgotPassword from '../pages/auth/forgot-password';
import ResetPassword from './../pages/auth/reset-password';

const AuthRoutes = () => {
    return (
        <Routes>
            <Route element={<AuthLayout />}>
                <Route index element={<Login />} />
                <Route path='/signup' element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path='/reset-password/:token' element={<ResetPassword />} />
            </Route>
        </Routes>
    );
}

export default AuthRoutes;
