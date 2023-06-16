import React, { useEffect } from 'react';
import { GOOGLE_CLIENT_ID } from '../../config/config';
import { GOOGLE_REDIRECT_URL } from '../../config/config';
import axios from 'axios';
import { response } from 'express';

const GoogleLogin = () => {

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        script.onload = () => {
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleCredentialResponse
            });
            window.google.accounts.id.renderButton(
                document.getElementById('buttonDiv'),
                { theme: 'outline', size: 'large' }
            );
            window.google.accounts.id.prompt();
        };

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleCredentialResponse = (response) => {
            console.log("Encoded JWT ID token: " + response.credential);
    }

    return (
        <>
            <div id="buttonDiv"></div> 
        </>
    );
};

    // const script = () => {
    // document.createElement('script');
    // script.src = 'https://accounts.google.com/gsi/client';
    // script.async = true;
    // script.defer = true;
    // document.body.appendChild(script);
    // };
        

    // const handleCredentialResponse = (response) => {
    //     console.log("Encoded JWT ID token: " + response.credential);
    // }

    // useEffect(() => {
    //     google.accounts.id.initialize({
    //         client_id: GOOGLE_CLIENT_ID,
    //         callback: handleCredentialResponse
    //     });
    //     google.accounts.id.renderButton(
    //         document.getElementById('buttonDiv'),
    //         { theme: 'outline', size: 'large' }
    //     );
    //     google.accounts.id.prompt();
    //     }, []);

    
      

export default GoogleLogin;

    // useEffect(() => {
        // const script = document.createElement('script');
        // script.src = 'https://https://accounts.google.com/gsi/client';
        // script.async = true;
        // script.defer = true;
        // document.body.appendChild(script);

        // script.onload = () => {
        //     google.accounts.id.initialize({
        //         client_id: GOOGLE_CLIENT_ID,
        //         callback: handleCredentialResponse
        //       });
        //     google.accounts.id.renderButton(
        //     document.getElementById("buttonDiv"),
        //     { theme: "outline", size: "large" }  // customization attributes
        //     );
        //     google.accounts.id.prompt(); 
        // };

        // return () => {
        //     document.body.removeChild(script);
        // };
    // }, []);

    // const kakaoLogin = () => {
    //     window.Kakao.Auth.login({
    //         scope: 'profile_nickname, account_email, gender',
    //         success: function(authObj) {
    //             //console.log(authObj); //토큰             
    //             const {access_token} = authObj
    //             //console.log(access_token);
    //             window.Kakao.API.request({
    //                 url: '/v2/user/me',
    //                 success: res => {
    //                     const kakao_account = res.kakao_account;                  
    //                     setUser({
    //                         email: kakao_account.email,
    //                         name: kakao_account.profile.nickname,
    //                         provider: 'kakao',
    //                     });
    //                     console.log(user); //계정정보
    //                     setLoading(true);
    //                     kakaoUser(user)
    //                         .then(res => {
    //                             if (!res.error) {        
    //                                 setUserData(res.user)
    //                                 history.push('/') 
    //                                 } else {
    //                                 setLoading(false);
    //                                 setError(res.error.message);
    //                             }
    //                         }).catch(err => console.error('error from login: ', err))
                        
    //                 } 
    //             });
    //         }
    //     });
    // };
