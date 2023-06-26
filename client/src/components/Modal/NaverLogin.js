import React, { useContext, useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import { Context } from '../../ContextStore'; 
import { Spinner } from 'react-bootstrap';
import { snsUser } from '../../services/userData';
import { useHistory } from 'react-router-dom';

const NaverLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setUserData } = useContext(Context);
  const history = useHistory();

  // useEffect(() => {
  //   const script = document.createElement('script');
  //   script.src = 'https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js';
  //   // script.charset = 'utf-8';
  //   document.body.appendChild(script);

  //   script.onload = () => {
  //       window.Kakao.init(process.env.REACT_APP_KAKAO_API);

  //   };

  //   return () => {
  //       document.body.removeChild(script);
  //   };
  // }, []);

  const naverLogin = new window.naver.LoginWithNaverId(
    {
        // clientId: process.env.REACT_APP_NAVER_CLIENT_ID,
        // callbackUrl: process.env.REACT_APP_NAVER_CALLBACK_URL,
        clientId: 'a9oKP47JDXAvbgaf2Mg1',
        callbackUrl: 'http://localhost:3000/naver/callback',
        loginButton: {color: "green", type: 2, height: 40}
    }
  );
  naverLogin.init(); // 로그인 설정

  return (
    <div>
      <div id="naverIdLogin"></div>
    </div>
  );
};

export default NaverLogin;

// var express = require('express');
// var app = express();
// var client_id = process.env.REACT_APP_NAVER_CLIENT_ID;
// var client_secret = 'YOUR_CLIENT_SECRET';
// var state = "RANDOM_STATE";
// var redirectURI = encodeURI(process.env.REACT_APP_NAVER_CLIENT_SECRET);
// var api_url = "";
// app.get('/naverlogin', function (req, res) {
//   api_url = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' + client_id + '&redirect_uri=' + redirectURI + '&state=' + state;
//    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
//    res.end("<a href='"+ api_url + "'><img height='50' src='http://static.nid.naver.com/oauth/small_g_in.PNG'/></a>");
//  });
//  app.get('/callback', function (req, res) {
//     code = req.query.code;
//     state = req.query.state;
//     api_url = 'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id='
//      + client_id + '&client_secret=' + client_secret + '&redirect_uri=' + redirectURI + '&code=' + code + '&state=' + state;
//     var request = require('request');
//     var options = {
//         url: api_url,
//         headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
//      };
//     request.get(options, function (error, response, body) {
//       if (!error && response.statusCode == 200) {
//         res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
//         res.end(body);
//       } else {
//         res.status(response.statusCode).end();
//         console.log('error = ' + response.statusCode);
//       }
//     });
//   });
//  app.listen(3000, function () {
//    console.log('http://127.0.0.1:3000/naverlogin app listening on port 3000!');
//  });

// import React, { useEffect } from 'react';

// const NaverLogin = () => {
//   useEffect(() => {
//     const naver_id_login = new window.naver_id_login(process.env.REACT_APP_NAVER_CLIENT_ID, "http://localhost:3000/naver/callback");
//     const state = naver_id_login.getUniqState();
//     naver_id_login.setButton("white", 2, 40);
//     naver_id_login.setDomain("http://localhost:3000");
//     naver_id_login.setState(state);
//     naver_id_login.setPopup();
//     naver_id_login.init_naver_id_login();
//   }, []);

//   const naverSignInCallback = () => {
//     const naver_id_login = new window.naver_id_login(process.env.REACT_APP_NAVER_CLIENT_ID, "http://localhost:3000/naver/callback");
//     alert(naver_id_login.getProfileData('email'));
//     alert(naver_id_login.getProfileData('nickname'));
//     // alert(naver_id_login.getProfileData('age'));
//   };

//   useEffect(() => {
//     const naver_id_login = new window.naver_id_login(process.env.REACT_APP_NAVER_CLIENT_ID, "http://localhost:3000");
//     alert(naver_id_login.oauthParams.access_token);
//     naver_id_login.get_naver_userprofile(naverSignInCallback);
//   }, []);

//   return <div id="naver_id_login"></div>;
// };

// export default NaverLogin;


// import React, { useEffect } from 'react';

// const naverSignInCallback = (naver_id_login) => {
//     const email = naver_id_login.getProfileData('email');
//     const nickname = naver_id_login.getProfileData('nickname');
//     const age = naver_id_login.getProfileData('age');

//     alert('Email: ' + email);
//     alert('Nickname: ' + nickname);
    
//     if (age) {
//         alert('Age: ' + age);
//     } else {
//         alert('Age information not available.');
//     }
// };

// const NaverLogin = () => {
//     useEffect(() => {
//         const naver_id_login = new window.naver_id_login(process.env.REACT_APP_NAVER_CLIENT_ID, "http://localhost:3000");
//         const state = naver_id_login.getUniqState();
//         naver_id_login.setButton("white", 3, 38);
//         naver_id_login.setDomain("http://localhost:3000");
//         naver_id_login.setState(state);
//         naver_id_login.setPopup();
//         naver_id_login.init_naver_id_login();

//         // Get Naver user profile and trigger the callback
//         naver_id_login.get_naver_userprofile(() => naverSignInCallback(naver_id_login));
//     }, []);

//     return (
//         <div>
//             <div id="naver_id_login"></div>
//         </div>
//     );
// };

// export default NaverLogin;


// import React, { useEffect  from 'react';

// const NaverLogin = () => {
//     useEffect(() => {
//         const naver_id_login = new window.naver_id_login(process.env.REACT_APP_NAVER_CLIENT_ID, "http://localhost:3000/naver/callback");
//         const state = naver_id_login.getUniqState();
//         naver_id_login.setButton("white", 3, 38);
//         naver_id_login.setDomain("http://localhost:3000");
//         naver_id_login.setState(state);
//         naver_id_login.setPopup();
//         naver_id_login.init_naver_id_login();

//     }, []);

//     var naver_id_login = new naver_id_login(process.env.REACT_APP_NAVER_CLIENT_ID, "http://localhost:3000/naver/callback");
//     // 접근 토큰 값 출력
//     alert(naver_id_login.oauthParams.access_token);
//     // 네이버 사용자 프로필 조회
//     naver_id_login.get_naver_userprofile(naverSignInCallback());
//     // 네이버 사용자 프로필 조회 이후 프로필 정보를 처리할 callback function

//     function naverSignInCallback() {
//         alert(naver_id_login.getProfileData('email'));
//         alert(naver_id_login.getProfileData('nickname'));
//         alert(naver_id_login.getProfileData('name'));
//     }
    
    
    
//         return (
//             <div>
//                 <div id="naver_id_login"></div>
//             </div>
//         );

// };

// export default NaverLogin;

// import React, { useEffect } from 'react';

// const NaverLogin = () => {
//     useEffect(() => {
//         const naver_id_login = new window.naver_id_login(process.env.REACT_APP_NAVER_CLIENT_ID, "http://localhost:3000/naver/callback");
//         const state = naver_id_login.getUniqState();
//         naver_id_login.setButton("white", 2, 40);
//         naver_id_login.setDomain("http://localhost:3000");
//         naver_id_login.setState(state);
//         naver_id_login.setPopup();
//         naver_id_login.init_naver_id_login();

//         // Callback function to handle Naver login
//         function naverSignInCallback() {
//             if (naver_id_login.oauthParams.access_token) {
//                 const accessToken = naver_id_login.oauthParams.access_token;
//                 fetchNaverUserProfile(accessToken);
//             } else {
//                 alert('Failed to retrieve access token.');
//             }
//         }

//         // Fetch Naver user profile using the access token
//         const fetchNaverUserProfile = (accessToken) => {
//             fetch('https://openapi.naver.com/v1/nid/me', {
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`,
//                 },
//             })
//             .then(response => response.json())
//             .then(data => {
//                 const email = data.response.email;
//                 const nickname = data.response.nickname;

//                 alert('Email: ' + email);
//                 alert('Nickname: ' + nickname);

//                 // Perform further actions with the user's email and nickname
//                 // ...
//             })
//             .catch(error => {
//                 console.error('Failed to fetch Naver user profile:', error);
//             });
//         };

//         // Get Naver user profile and trigger the callback
//         naver_id_login.get_naver_userprofile(naverSignInCallback);
//     }, []);

//     return (
//         <div>
//             <div id="naver_id_login"></div>
//         </div>
//     );
// };

// export default NaverLogin;


