import React, { useContext, useEffect, useState } from 'react';
import './Modal.css';
import { Context } from '../../ContextStore'; // 컨텍스트 관련 컴포넌트
import { loginUser } from '../../services/userData';
import { snsUser } from '../../services/userData';
import { useHistory } from 'react-router-dom';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import SimpleSider from '../Siders/SimpleSider';
import GoogleLogin from './GoogleLogin';
import NaverLogin from './NaverLogin';
import KakaoLogin from './KakaoLogin';

const LoginModal = ({ onClose}) => {
    const [loading, setLoading] = useState(false);
    const [alertShow, setAlertShow] = useState(false);
    const [error, setError] = useState(null);
    const { setUserData } = useContext(Context)
    const history = useHistory();
    const [user, setUser] = useState({
        email: "",
        password: ""
    });


    const handleChanges = (e) => {
        e.preventDefault();
        setUser({ ...user, [e.target.name]: e.target.value });
    }

    const handleSubmitLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        console.log(user)
        loginUser(user)
            .then(res => {
                if (!res.error) {
                    setUserData(res.user)
                    // 로컬 스토리지에 토큰 값을 저장
                    localStorage.setItem('user', JSON.stringify(res.user))
                    history.push('/')
                } else {
                    setLoading(false);
                    setError(res.error.message);
                    setAlertShow(true);
                }
            }).catch(err => console.error('error from login: ', err))
    }


    return (
        <>
            {/* <SimpleSider />
            <div className="container auth-form">
                <h1 className="auth-heading">Sign In</h1>
                <Form className="col-lg-6" onSubmit={handleSubmitLogin}>
                    {alertShow &&
                        <Alert variant="danger" onClose={() => setAlertShow(false)} dismissible>
                            <p>
                                {error}
                            </p>
                        </Alert>
                    }
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" name="email" placeholder="Enter email" onChange={handleChanges} required />
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" name="password" placeholder="Password" onChange={handleChanges} required />
                    </Form.Group>
                    {loading ?
                        <Button className="col-lg-12 btnAuth" variant="dark" disabled >
                            Please wait... <Spinner animation="border" />
                        </Button>
                        :
                        <Button variant="dark" className="col-lg-12 btnAuth" type="submit">당근마켓 아이디로 로그인</Button>
                    }
                    <p className="bottom-msg-paragraph">Don't have an account? <Link to="/auth/register">Sign Up</Link>!</p>
                </Form>
            </div> */}

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
                        {/* <div className='localLogin'>
                            <input type="email" name="email" placeholder="이메일" onChange={handleChanges} required/>
                            <input type="password" name="password" placeholder="비밀번호" onChange={handleChanges} required/>
                            <Button className="loginBtn" type="submit">당근마켓 아이디로 로그인</Button>
                        </div> */}
                        {/* <a href="#" onClick={kakaoLogin}>
                            <div className='modal-path'>
                                <img src='https://m.bunjang.co.kr/pc-static/resource/7bf83f72cf54461af573.png' width="30" alt="카카오"/>
                                &nbsp;&nbsp;카카오로 이용하기
                            </div>
                        </a>      */}
                        <KakaoLogin/>
                        <GoogleLogin/>
                        {/* <NaverLogin/> */}
                        
                    </div>
                    }
                </div>
            </div>
        </>
    );
};

export default LoginModal;
