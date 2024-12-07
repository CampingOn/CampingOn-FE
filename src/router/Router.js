import {Navigate, Route, Routes} from "react-router-dom";
import { Login, MyPage, Signup, OAuthSuccess } from 'pages';
import { NotFound, Home, Keyword} from 'pages';
import { MyReservation, Reservation } from 'pages';
import { Search, CampDetail } from 'pages';
import MyBookmark from "../pages/account/MyBookmark";
// import CampList from "pages/camp/CampList";
// import CreateReview from "pages/review/CreateReview";
// import CampSiteList from 'pages/camp/CampSiteList';



function Router() {
    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/keyword" element={<Keyword/>}/>
            <Route path="/signup" element={<Signup/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/my-reservation" element={<MyReservation/>} />
            <Route path="/my-bookmark" element={<MyBookmark/>} />
            <Route path="/camps/:campId" element={<CampDetail />} /> {/* 상세 페이지 경로 */}
            <Route path="/my-page" element={<MyPage />} />
            <Route path="*" element={<Navigate to="/not-found" replace/>}/>
            <Route path="/not-found" element={<NotFound/>}/>
            <Route path="/search" element={<Search/>} />
            <Route path="/camps/:campId/sites/:siteId" element={<Reservation/>}/>
            <Route path="/oauth/success" element={<OAuthSuccess />} />
        </Routes>
    );
}

export default Router;
