import './App.css';
import { BrowserRouter } from "react-router-dom";
import HiddenUtils from "./HiddenUtils";
import Router from "./router/Router";
import Header from "./components/Header";

function App() {
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