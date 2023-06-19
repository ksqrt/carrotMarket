import React, { useContext, useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import { Context } from '../../ContextStore'; 
import { Spinner } from 'react-bootstrap';
import { snsUser } from '../../services/userData';
import { useHistory } from 'react-router-dom';

const GoogleLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setUserData } = useContext(Context);
  const history = useHistory();


  function handleCredentialResponse(response) {
    // console.log("Encoded JWT ID token: " + response.credential);
    var userObject = jwt_decode(response.credential); //토큰 디코딩
   
    const user = ({
      email: userObject.email,
      name: userObject.name,
      provider: 'google',
    });

    console.log(user); //계정정보
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
  };

  useEffect(() => {
    window.google.accounts.id.initialize({
      // client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      client_id: '329639666474-vo5t9aio3u6mjivnceifr7dnppkqa2he.apps.googleusercontent.com',
      callback: handleCredentialResponse
    });

    window.google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { theme: "outline", size: "large" }
    );
  }, []);

  return (
    <div>
      {/* <a href="#">
          <div className='modal-path'>
              <img src='https://m.bunjang.co.kr/pc-static/resource/7bf83f72cf54461af573.png' width="30" alt="카카오"/>
              &nbsp;&nbsp;구글로 이용하기
          </div>
      </a>   */}
      {loading ?
      <div>Please wait... <Spinner animation="border" /></div>
      :
      <div id='buttonDiv' ></div>
      }
    </div>
  );
};

export default GoogleLogin;



