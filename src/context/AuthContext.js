import React, {createContext, useEffect, useState} from 'react';
import {userService} from "../api/services/userService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("accessToken"));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuthentication = async () => {

            setIsLoading(true);
            const token = localStorage.getItem("accessToken");

            if (token) {
                console.log("Access Token 확인됨:", token);
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }

            setIsLoading(false);
        };
        checkAuthentication();
    }, []);

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
        <AuthContext.Provider value={{isAuthenticated, login, logout, isLoading}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return React.useContext(AuthContext);
};

export default AuthContext; 