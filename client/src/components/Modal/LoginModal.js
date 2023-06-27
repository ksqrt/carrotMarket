import React, { useContext, useState } from "react";
import "./Modal.css";
import { Context } from "../../ContextStore"; // 컨텍스트 관련 컴포넌트
import { loginUser } from "../../services/userData";
import { useHistory } from "react-router-dom";
import { Form, Button, Spinner, Alert } from "react-bootstrap";
import GoogleLogin from "./GoogleLogin";
import NaverLogin from "./NaverLogin";
import KakaoLogin from "./KakaoLogin";

const LoginModal = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [alertShow, setAlertShow] = useState(false);
  const [error, setError] = useState(null);
  const { setUserData } = useContext(Context);
  const history = useHistory();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleChanges = (e) => {
    e.preventDefault();
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmitLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    // console.log(user);
    loginUser(user)
      .then((res) => {
        if (!res.error) {
          setUserData(res.user);
          // 로컬 스토리지에 토큰 값을 저장
          localStorage.setItem("user", JSON.stringify(res.user));
          history.push("/");
        } else {
          setLoading(false);
          setError(res.error.message);
          setAlertShow(true);
        }
      })
      .catch((err) => console.error("error from login: ", err));
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
                    <div className="modal-subtitle">간편하게 로그인하고 상품을 확인하세요</div>
                    
                            {alertShow &&
                                <Alert variant="dark" onClose={() => setAlertShow(false)} dismissible className='authAlert'>
                                    <p>
                                        {error}
                                    </p>
                                </Alert>
                            }
                    <div className="container auth-form" style={{paddingRight: 160}}>
                        <Form className="col-lg-6" onSubmit={handleSubmitLogin}>
              <div className="forms" style={{ paddingLeft: 20 }}>
                <input
                  className="emailForm"
                  type="email"
                  name="email"
                  placeholder="이메일"
                  onChange={handleChanges}
                  required
                />
                <input
                  className="pwdForm"
                  type="password"
                  name="password"
                  placeholder="비밀번호"
                  onChange={handleChanges}
                  required
                />
              </div>
              {loading ? (
                <Button className="loginBtn btnAuth" variant="dark" disabled>
                  Please wait... <Spinner animation="border" />
                </Button>
              ) : (
                <Button
                  variant="dark"
                  className="loginBtn btnAuth"
                  type="submit"
                >
                  당근마켓 계정으로 로그인
                </Button>
              )}
            </Form>
          </div>

          <div className="modal-paths" style={{ paddingLeft: 75 }}>
            <KakaoLogin />
            <GoogleLogin />
            {/* <NaverLogin/> */}
          </div>

          <div>
            {/* <p className="bottom-msg-paragraph"><Link to="/auth/login">회원가입</Link>!</p>  */}
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginModal;
