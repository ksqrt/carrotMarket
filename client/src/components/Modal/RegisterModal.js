import React, { useContext, useEffect, useState } from 'react';
import './Modal.css';
import { useHistory } from 'react-router-dom';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import { registerUser } from '../../services/userData';
import GoogleLogin from './GoogleLogin';
import NaverLogin from './NaverLogin';
import KakaoLogin from './KakaoLogin';
import axios from 'axios';

const RegisterModal = ({ onCloseRegister}) => {
    const [loading, setLoading] = useState(false);
    const [alertShow, setAlertShow] = useState(false);
    const [error, setError] = useState(null);
    const history = useHistory();
    const [userData, setUserData] = useState({
        email: "",
        name: null,
        password: "",
        repeatPassword: "",
        provider: 'local',
    });


    const handleChanges = (e) => {
        e.preventDefault();
        setUserData({ ...userData, [e.target.name]: e.target.value });
    }


    const handleSubmitReg = (e) => {
        e.preventDefault();
        // 이메일 인증
        if (window.confirm('입력하신 이메일로 인증하시겠습니까?')) {
            const createdAuthCode = Math.floor(Math.random()*(999999-111111+1)) + 111111;

            const dataToSubmit = {
                email: userData.email,
                auth: createdAuthCode
            };

            // console.log('authCode = ' + createdAuthCode);
            axios.post(`http://localhost:5000/auth/sendEmail`, dataToSubmit)
                .then(response => {
                    var input = window.prompt('인증코드가 발송되었습니다.', '인증코드를 입력하세요');
                   
                    if (createdAuthCode == input) {
                        setLoading(true);
                        // console.log(userData);
                        registerUser(userData)
                            .then(res => {
                                if (!res.error) {
                                    window.location.href = '/';
                                    window.alert(` 
                        당근마켓에 회원가입 되었습니다!
                        로그인 후 이용해주세요 `);
                                } else {
                                    setLoading(false);
                                    setError(res.error);
                                    setAlertShow(true);
                                }
                            })
                            .catch(err => console.error('error from register: ', err));
                    } else {
                        window.alert("인증 코드가 일치하지 않습니다");
                        window.location.href = '/';

                    }
                });
        }
    };
   
    return (
        <>
            <div className='modal-bg'></div>
            <div className='modal-popup'>
                <button className="modal-close" onClick={onCloseRegister}>
                    <img src="https://m.bunjang.co.kr/pc-static/resource/ee442d3dd827628bc5fe.png" width="24" height="24" alt="닫기"/>
                </button>
                <div className="modal-div">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/a/ae/DaangnMarket_logo.png" height="40" className="carrot-logo" alt='웹 로고'/>
                    <div className="modal-title">당근마켓으로 중고거래 시작하기</div>
                    <div className="modal-subtitle">간편하게 가입하고 상품을 확인하세요</div>
                        {alertShow &&
                            <Alert variant="dark" onClose={() => setAlertShow(false)} dismissible className='authAlert'>
                                <p>
                                    {error}
                                </p>
                            </Alert>
                        }
                    <div className="container auth-form" style={{paddingRight: 160}}>
                        <Form className="col-lg-6" onSubmit={handleSubmitReg}>

                        <div className='forms' style={{paddingLeft: 20}}>
                            <input className='emailForm' type="email" name="email" placeholder="이메일" onChange={handleChanges} required/>

                            <input className='nameForm' type="text" name="name" placeholder="이름" onChange={handleChanges} required/>
                            <input className='pwdForm' type="password" name="password" placeholder="비밀번호" onChange={handleChanges} required/>
                            <input className='pwdForm' type="password" name="repeatPassword" placeholder="비밀번호 확인" onChange={handleChanges} required/>
                        </div>
                        {loading ?
                            <Button className="loginBtn btnAuth" variant="dark" disabled >
                                Please wait... <Spinner animation="border" />
                            </Button>
                            :
                            <Button variant="dark" className="loginBtn btnAuth" type="submit">당근마켓 계정으로 회원가입</Button>                       
                        }
                        </Form>
                    </div> 

                    <div className="modal-paths" style={{paddingLeft: 75}}> 
                        <KakaoLogin/>
                        <GoogleLogin/>
                        {/* <NaverLogin/> */}
                        
                    </div>

                    {/* <div> */}
                        {/* <p className="bottom-msg-paragraph"><Link to="/auth/login">회원가입</Link>!</p>  */}
                        {/* <div className='toLogin'><LoginModal/>로그인</div> */}
                    {/* </div> */}
                    
                </div>
            </div>
            
        </>
    );
};

export default RegisterModal;
