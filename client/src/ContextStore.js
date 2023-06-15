import React, { useState, useEffect, useMemo } from 'react';

export const Context = React.createContext();

export const ContextStore = ({ children }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const access_token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰 값을 가져옴

    if (access_token) {
      // 토큰이 존재하면 서버에 토큰을 전달하여 사용자 정보를 가져옴
      fetch('/auth/getUser', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
        .then(res => res.json())
        .then(res => {
          if (res.user) {
            // 사용자 정보가 존재하면 userData 상태를 설정
            setUserData(res.user);
          } else {
            // 사용자 정보가 없으면 토큰을 제거하고 로그인 페이지로 이동
            localStorage.removeItem('token');
            // history.push('/login');
          }
        })
        .catch(error => {
          console.error('Error while fetching user data:', error);
          // 오류가 발생하면 토큰을 제거하고 로그인 페이지로 이동
          localStorage.removeItem('token');
          // history.push('/login');
        });
    }
  }, []);

  const login = (access_token, user) => {
    // 로그인 시 호출되는 함수로 토큰과 사용자 정보를 받아서 설정
    localStorage.setItem('token', access_token);
    setUserData(user);
    // history.push('/');
  };

  const logout = () => {
    // 로그아웃 시 호출되는 함수로 토큰을 제거하고 userData 상태를 초기화
    localStorage.removeItem('token');
    setUserData(null);
    // history.push('/login');
  };

  const providerValue = useMemo(() => ({ userData, login, logout }), [
    userData,
  ]);

  return (
    <Context.Provider value={providerValue}>
        {children}
    </Context.Provider>
  );
};




// import React, { useState, useEffect, useMemo } from 'react';
// // import { useCookies } from 'react-cookie'
// export const Context = React.createContext();

// export const ContextStore = ({ children }) => {
//     let initialValue = null;
//     // const [cookies, setCookie, removeCookie] = useCookies(['USER_SESSION']);
//     const [userData, setUserData] = useState(initialValue)
    
//     useEffect(() => {
//         //if (cookies.USER_SESSION) {
//             fetch(`/auth/getUser`).then(res => res.json())
//                 .then(res => {
//                     return setUserData(res.user)
//                 })
//         //}
//     }, [])

//     // console.log(userData)
//     const providerValue = useMemo(() => ({ userData, setUserData }), [userData, setUserData])

//     return (
//         <Context.Provider value={providerValue}>
//             {children}
//         </Context.Provider>
//     )
// }