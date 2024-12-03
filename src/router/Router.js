import {Navigate, Route, Routes} from "react-router-dom";
import Home from "pages/home/Home";
import NotFound from "pages/error/NotFound";
import Keyword from "pages/keyword/Keyword";
import Signup from "pages/account/SignUp";
import Login from "pages/account/Login";
import ReservationList from "pages/reservation/ReservationList";
// import SearchCampList from "/pages/camp/SearchCampList";


function Router() {
    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/keyword" element={<Keyword/>}/>
            <Route path="/signup" element={<Signup/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/reservations" element={<ReservationList/>} />
            {/*<Route path="/searchCamps" element={<SearchCampList/>} />*/}

            <Route path="*" element={<Navigate to="/not-found" replace/>}/>
            <Route path="/not-found" element={<NotFound/>}/>
        </Routes>
    );
}

export default Router;
