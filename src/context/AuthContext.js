import React, {createContext, useEffect, useState} from 'react';
import {userService} from "../api/services/userService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        isAuthenticated: !!localStorage.getItem("accessToken"),
        isLoading: true
    });

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        setAuth({
            isAuthenticated: !!token,
            isLoading: false
        });
    }, []);

    const login = () => {
        setAuth({
            ...auth,
            isAuthenticated: true
        });
    };

    const logout = async () => {
        try {
            await userService.logout();
            localStorage.removeItem('accessToken');
            setAuth({
                ...auth,
                isAuthenticated: false
            });
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <AuthContext.Provider value={{...auth, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return React.useContext(AuthContext);
};

export default AuthContext; 