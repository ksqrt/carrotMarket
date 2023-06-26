import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../ContextStore'; // 컨텍스트 관련 컴포넌트
import { Spinner } from 'react-bootstrap';
import { snsUser } from '../../services/userData';
import { useHistory } from 'react-router-dom';

const KakaoLogin = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { setUserData } = useContext(Context)
    const history = useHistory();

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            window.Kakao.init(process.env.REACT_APP_KAKAO_API);

        };

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const kakaoLogin = () => {
        window.Kakao.Auth.login({
            scope: 'profile_nickname, account_email',
            success: function(authObj) {
                //console.log(authObj); //토큰             
                window.Kakao.API.request({
                    url: '/v2/user/me',
                    success: res => {
                        const kakao_account = res.kakao_account;                  
                        const user = ({
                            email: kakao_account.email,
                            name: kakao_account.profile.nickname,
                            password: 'kakao',
                            provider: 'kakao',
                        });
                        // console.log(user); //계정정보
                        setLoading(true);
                        snsUser(user)
                            .then(res => {
                                if (!res.error) {        
                                    setUserData(res.user)
                                    // 로컬 스토리지에 토큰 값을 저장
                                    localStorage.setItem('user', JSON.stringify(res.user))
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
        <div>
            {loading ?
            <div>Please wait... <Spinner animation="border" /></div>
            :
            <a href="#" onClick={kakaoLogin}>
                <div className='modal-path'>
                    <img src='https://m.bunjang.co.kr/pc-static/resource/7bf83f72cf54461af573.png' width="30" alt="카카오"/>
                    &nbsp;&nbsp;Kakao 계정으로 로그인
                </div>
            </a>
            }
        </div>
    );
};


export default KakaoLogin;