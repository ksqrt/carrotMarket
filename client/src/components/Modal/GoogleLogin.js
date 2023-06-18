import React, { useContext, useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import { Context } from '../../ContextStore'; 
import { snsUser } from '../../services/userData';
import { useHistory } from 'react-router-dom';

const GoogleLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({
    email: "",
    name: "",
    provider: ""
  });
  const { setUserData } = useContext(Context)
  const history = useHistory();
  
  function handleCredentialResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    var userObject = jwt_decode(response.credential);
    setUser({
      email: userObject.email,
      name: userObject.name,
      provider: 'google',
    });
    console.log(user);
    snsUser(user)
      .then(res => {
          if (!res.error) {        
              setUserData(res.user)
              history.push('/') 
              } else {
              setLoading(false);
              setError(res.error.message);
          }
      }).catch(err => console.error('error from login: ', err))
  };

  useEffect(() => {
    // const script = document.createElement('script');
    // script.src = 'https://accounts.google.com/gsi/client';
    // script.async = true;
    // script.defer = true;
    // document.body.appendChild(script);

    window.google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse
    });

    window.google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { theme: "outline", size: "large" }
    );
  }, []);

  return (
    <div>
      <div id='buttonDiv'></div>
    
    </div>
  );
};

export default GoogleLogin;



