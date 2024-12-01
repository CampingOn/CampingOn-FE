import React from 'react';
import { useSelector } from 'react-redux';

function Home() {
    // Redux 스토어에서 accessToken 가져오기
    const accessToken = useSelector((state) => state.auth.accessToken);

    return (
        <div>
            <h1>메인 페이지</h1>
            <p>Redux에 저장된 Access Token:</p>
            <pre>{accessToken ? accessToken : '로그인되지 않았습니다.'}</pre>
        </div>
    );
}

export default Home;
