import React, { useContext, useEffect, useState } from 'react';
import './Modal.css';
import { JAVASCRIPT } from '../../config/config';
import { Context } from '../../ContextStore'; // 컨텍스트 관련 컴포넌트
import { Spinner } from 'react-bootstrap';
import { loginUser } from '../../services/userData';
import { kakaoUser } from '../../services/userData';
import { useHistory } from 'react-router-dom';

const LoginModal = ({ onClose}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState({
        email: "",
        name: "",
        provider: ""
    });
    const { setUserData } = useContext(Context)
    const history = useHistory();

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            //src/config/config.js 에 있음
            window.Kakao.init(JAVASCRIPT);
        };

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const kakaoLogin = () => {
        window.Kakao.Auth.login({
            scope: 'profile_nickname, account_email, gender',
            success: function(authObj) {
                //console.log(authObj); //토큰             
                const {access_token} = authObj
                //console.log(access_token);
                window.Kakao.API.request({
                    url: '/v2/user/me',
                    success: res => {
                        const kakao_account = res.kakao_account;                  
                        setUser({
                            email: kakao_account.email,
                            name: kakao_account.profile.nickname,
                            provider: 'kakao',
                        });
                        console.log(user); //계정정보
                        setLoading(true);
                        kakaoUser(user)
                            .then(res => {
                                if (!res.error) {               
                                    setUserData(res.user)
                                    history.push('/') 
                                    } else {
                                    setLoading(false);
                                    setError(res.error.message);
                                }
                            }).catch(err => console.error('error from login: ', err))
                        
                    } 
                });
            }
        });
    };

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
                    {loading ?
                    <div>Please wait... <Spinner animation="border" /></div>
                    :
                    <div className="modal-paths"> 
                        <a href="#" onClick={kakaoLogin}>
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
                    }
                </div>
            </div>
        </>
    );
};

export default LoginModal;
