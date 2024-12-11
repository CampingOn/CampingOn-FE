import './index.css'; // Tailwind CSS 파일
import { BrowserRouter } from "react-router-dom";
import HiddenUtils from "./utils/HiddenUtils";
import Router from "./router/Router";
import Header from "./pages/home/Header";
import store from 'store/index';
import {AuthProvider} from "./context/AuthContext";


function App() {
/*    const dispatch = useDispatch();
    const isRefreshing = useRef(false); // 요청 상태를 저장하는 useRef

    useEffect(() => {
        const initializeAuth = async () => {
            // 요청 중복 방지: isRefreshing이 true면 요청 차단
            if (isRefreshing.current) {
                return;
            }

            isRefreshing.current = true; // 요청 시작 시 플래그 설정

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
    }, [dispatch]);*/

    return (
        <BrowserRouter>
            <AuthProvider>
                <div className="app">
                    <HiddenUtils whitelist={['/login', '/signup', '/keyword', '/not-found']}>
                        <div className='header'>
                            <Header/>
                        </div>
                    </HiddenUtils>
                    <div className='content' style={{ margin: '0 16% 160px 16%'}}>
                        <Router />
                    </div>
                </div>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
