import React from 'react';
import './Modal.css';


const LoginModal = ({onClose}) => {

    // const Rest_api_key= process.env.REACT_APP_KAKAO_API;
    // const redirect_uri = 'http://localhost:3000/auth' //Redirect URI
    // // oauth 요청 URL
    // const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`
    // const handleLogin = ()=>{
    //     window.location.href = kakaoURL
    // }
    // return(
    // <>
    // <button onClick={handleLogin}>카카오 로그인</button>
    // </>
    // )
   

    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_API}&redirect_uri=${process.env.KAKAO_REDIRECT}&response_type=code`;
    const handleLogin = () => {
        window.location.href = kakaoURL
    };
    //const code = new URL(window.location.href).searchParams.get("code");

    return (
        <>
            <div className='modal-bg'></div>
            <div className='modal-popup'>
                <button className="modal-close" onClick={onClose}>
                    <img src="https://m.bunjang.co.kr/pc-static/resource/ee442d3dd827628bc5fe.png" width="24" height="24" alt="닫기"/>
                </button>
                <div className="modal-div">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/a/ae/DaangnMarket_logo.png" height="40" className="carrot-logo" alt='웹 로고'/>
                    <div className="modal-title">당근마켓으로 중고거래 시작하기</div>
                    <div className="modal-subtitle">간편하게 가입하고 상품을 확인하세요</div>
                    <div className="modal-paths"> 
                        <button onClick={handleLogin}>
                            <img src='https://developers.kakao.com/tool/resource/static/img/button/login/full/ko/kakao_login_medium_narrow.png' height="30" alt='카카오'/>
                        </button> 
                        <a id='kakao' href="#" onClick={handleLogin}>
                            <div className='modal-path'>
                                <img src='https://m.bunjang.co.kr/pc-static/resource/7bf83f72cf54461af573.png' width="30" alt="카카오"/>
                                &nbsp;&nbsp;카카오로 이용하기
                            </div>
                        </a>     
                        <a id='kakao' href="/auth/kakao">
                            <div className='modal-path'>
                                <img src='https://m.bunjang.co.kr/pc-static/resource/7bf83f72cf54461af573.png' width="30" alt="카카오"/>
                                &nbsp;&nbsp;카카오로 이용하기
                            </div>
                        </a>    
                        <a id='kakao' href="/auth/google">
                            <div className='modal-path'>
                                <img src='https://littledeep.com/wp-content/uploads/2019/03/google_logo_download_thumbnail.png' width="50" alt="구글"/>
                                구글로 이용하기
                            </div>
                        </a>                                   
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginModal;