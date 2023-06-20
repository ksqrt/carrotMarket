import React, { useContext, useEffect, useState } from 'react';
import './Modal.css';
import { Context } from '../../ContextStore'; // 컨텍스트 관련 컴포넌트
import { SimpleSider } from '../../services/userData';
import { useHistory } from 'react-router-dom';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { registerUser } from '../../services/userData';
import GoogleLogin from './GoogleLogin';
import NaverLogin from './NaverLogin';
import KakaoLogin from './KakaoLogin';
import LoginModal from './LoginModal';

const RegisterModal = ({ onClose}) => {
    const [loading, setLoading] = useState(false);
    const [alertShow, setAlertShow] = useState(false);
    const [error, setError] = useState(null);
    // const { setUserData } = useContext(Context)
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

    const handleSubmitLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        console.log(userData)
        registerUser(userData) //registerUser 함수를 호출하여 userData 값 전달 ('../services/userData')
            .then(res => { //호출 성공
                if (!res.error) { //오류 없으면,
                    history.push('/') 
                } else { //오류 있으면,
                    setLoading(false); //로딩 상태를 false로 설정
                    setError(res.error); //오류 메시지 설정
                    setAlertShow(true); //경고창 표시
                }
            }).catch(err => console.error('error from register: ', err))
    }


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
                    
                    <div className="container auth-form" style={{paddingRight: 160}}>
                        <Form className="col-lg-6" onSubmit={handleSubmitLogin}>
                            {alertShow &&
                                <Alert variant="danger" onClose={() => setAlertShow(false)} dismissible>
                                    <p>
                                        {error}
                                    </p>
                                </Alert>
                            }

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
                            <Button variant="dark" className="loginBtn btnAuth" type="submit" >당근마켓 계정으로 회원가입</Button>

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
