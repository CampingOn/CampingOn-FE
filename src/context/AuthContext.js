import React, {createContext, useEffect, useState} from 'react';
import {userService} from "../api/services/userService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        console.log('Access Token:', token);
        setIsAuthenticated(!!token);
    }, []);

    // TODO : 무언갈 더 추가해야할 것 같음. 동작이 어색함
    const login = () => {
        setIsAuthenticated(true);
    };

    const logout = async () => {
        try {
            await userService.logout();
            localStorage.removeItem('accessToken');
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <AuthContext.Provider value={{isAuthenticated, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return React.useContext(AuthContext);
};

export default AuthContext; 