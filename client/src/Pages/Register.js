import React from "react";
import { useState } from "react";
import { Form, Button, Col, Spinner, Alert, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { registerUser } from "../services/userData";
import SimpleSider from "../components/Siders/SimpleSider";
import "../components/Register/Register.css";

function Register({ history, registerClose, loginModalOpen }) {
  //React의 useState 훅을 사용하여 상태 변수들 초기화
  const [loading, setLoading] = useState(false); //로딩 상태를 나타내는 변수
  const [alertShow, setAlertShow] = useState(false); //경고창 표시 여부를 나타내는 변수
  const [error, setError] = useState(null); //오류 메시지를 나타내는 변수
  const [userData, setUserData] = useState({
    //사용자 데이터를 저장하는 객체
    name: null,
    gender: 'm',
    phoneNumber: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const handleChanges = (e) => {
    e.preventDefault();
    setUserData({ ...userData, [e.target.name]: e.target.value });
  }; //폼 입력값이 변경될 때 사용자 정보를 업데이트하는 함수

  const handleSubmitReg = (e) => {
    e.preventDefault(); //이벤트의 기본 동작 취소 - 폼 제출 이벤트에서 페이지 새로고침 방지
    setLoading(true); //로딩 상태를 true로 설정
    registerUser(userData) //registerUser 함수를 호출하여 userData 값 전달 ('../services/userData')
      .then((res) => {
        //호출 성공
        if (!res.error) {
          //오류 없으면,
        //   history.push("/auth/login"); //로그인 페이지로 이동
            window.location.replace('/');
        } else {
          //오류 있으면,
          setLoading(false); //로딩 상태를 false로 설정
          setError(res.error); //오류 메시지 설정
          setAlertShow(true); //경고창 표시
        }
      })
      .catch((err) => console.error("error from register: ", err)); //호출 실패 - 에러 메시지 출력
  };

  return (
    <>
      <div className="register-bg"></div>
      <div className="register-popup">
        <button className="register-close" onClick={registerClose}>
          <img
            src="https://m.bunjang.co.kr/pc-static/resource/ee442d3dd827628bc5fe.png"
            width="24"
            height="24"
            alt="닫기"
          />
        </button>
        <div>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/ae/DaangnMarket_logo.png"
            height="40"
            className="carrot-logo"
            alt="웹 로고"
          />
          <h2 className="auth-heading">회원가입</h2>
          <div className="container auth-form">
            <Form className="col-lg-8" onSubmit={handleSubmitReg}>
              {/* form 작성 후 submit 버튼을 눌었을 때 handleSubmitReg 함수 실행 */}
              {alertShow && ( //alertShow 변수가 true인 경우,
                <Alert
                  variant="danger"
                  onClose={() => setAlertShow(false)}
                  dismissible
                >
                  {/* 경고 메시지를 강조하는 빨간색 배경, 닫기 버튼 클릭할 때 setAlertShow(false) 호출해서 경고창 닫을 수 있게 함,
                        Bootstrap의 Alert 컴포넌트 dismissible 옵션 - 닫기 버튼 표시 */}
                  {
                    error.map(function(err,i){
                        return(
                            <p>{err[i]}</p>
                        )
                    })
                    }
                
                </Alert>
              )}
              <Form.Row>
                <Form.Group controlId="forName" className="col-lg-8">
                  <Form.Label>이름 *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="김 덕배"
                    onChange={handleChanges}
                    required
                  />
                  <Form.Text muted>
                    {/* 부가설명을 회색으로 표시 */}
                    {/* The name can be your real one or a username. */}
                  </Form.Text>
                </Form.Group>
                {/* <Form.Group controlId="forLastName" className="col-lg-4">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="text" name="lastName" placeholder="Ivanov" onChange={handleChanges} />
                        </Form.Group> */}
                <Form.Group
                  as={Col}
                  controlId="formGridGender"
                  className="col-lg-4"
                >
                  <Form.Label>성별</Form.Label>
                  <Form.Control
                    as="select"
                    defaultValue="not specified"
                    name="gender"
                    onChange={handleChanges}
                  >
                    <option value='m'>남성</option>
                    <option value='w'>여성</option>
                    <option value='n'>중성</option>
                  </Form.Control>
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group className="col-lg-12">
                  <Form.Label>핸드폰 *</Form.Label>
                  <Form.Control
                    type="text"
                    name="phoneNumber"
                    placeholder="010-0000-0000"
                    onChange={handleChanges}
                    required
                  />
                  <Form.Text muted>
                    {/* Phone Number should be a valid BG number. */}
                  </Form.Text>
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group controlId="formBasicEmail" className="col-lg-12">
                  <Form.Label>이메일 *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="bitmarket@naver.com"
                    onChange={handleChanges}
                    required
                  />
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group controlId="formBasicPassword" className="col-lg-12">
                  <Form.Label>비밀번호 *</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChanges}
                    required
                  />
                  <Form.Text muted>
                    비밀번호는 8-20자로 작성해주셔야 합니다.
                  </Form.Text>
                </Form.Group>
                <Form.Group className="col-lg-12">
                  <Form.Label>비밀번호 확인 *</Form.Label>
                  <Form.Control
                    type="password"
                    name="repeatPassword"
                    placeholder="Repeat password"
                    onChange={handleChanges}
                    required
                  />
                </Form.Group>
              </Form.Row>
              {loading ? ( //loading 변수가 true일 경우 어두운 배경, 버튼 비활성화, 'react-bootstrap'의 Spinner 컴포넌트 렌더링
                <Button className="col-lg-12 btnAuth" variant="dark" disabled>
                  회원가입중입니다.. <Spinner animation="border" />
                </Button>
              ) : (
                //loading 변수가 false일 경우 어두운 배경, type을 submit으로 하여 form 제출이 가능하도록
                <Button
                  variant="dark"
                  className="col-lg-12 btnAuth"
                  type="submit"
                >
                  회원 가입
                </Button>
              )}

              <p className="bottom-msg-paragraph">
                이미 계정을 갖고 계신가요? <button className="loginbtn" onClick={loginModalOpen}>로그인!</button>
              </p>
              {/* 아이디가 있을 경우 로그인 페이지로 이동 */}
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
