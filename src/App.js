import './App.css';
import './index.css'; // Tailwind CSS 파일
import { BrowserRouter } from "react-router-dom";
import HiddenUtils from "./HiddenUtils";
import Router from "./router/Router";
import Header from "./components/Header";
import { setCredentials, logout } from "slices/authSlice";
import {useDispatch} from "react-redux";
import {useEffect} from "react";
import axios from "axios";

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/token/refresh`,
                    { withCredentials: true }
                );
                const newAccessToken = response.data.accessToken;
                dispatch(setCredentials({ accessToken: newAccessToken }));
            } catch (error) {
                // 재발급 실패 시 로그아웃 처리
                dispatch(logout());
            }
        };

        initializeAuth();
    }, [dispatch]);

    return (
        <BrowserRouter>
            <div className="app">
                <HiddenUtils whitelist={['/login', '/signup', '/keyword', '/not-found']}>
                    <div className='header'>
                        <Header/>
                    </div>
                </HiddenUtils>
                <div className='content'>
                    <Router />
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
