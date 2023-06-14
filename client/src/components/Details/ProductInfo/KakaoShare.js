import React, { useEffect } from 'react';


export default function KakaoShare({params}) {
  
  console.log(params);

  setTimeout(() =>{
    console.log(params.title);
  },8000);
 
 
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://developers.kakao.com/sdk/js/kakao.js";
    script.async = true;
    script.onload = () => {
      Kakao.init('8766bf986c048a5e20e2ae4278463a7b');
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  function sendLinkCustom() {
    
    if (window.Kakao) {
      window.Kakao.Link.sendCustom({
        templateId: 94886
      });
    }
  }


  function sendLinkDefault() {
    
    if (window.Kakao) {
      window.Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
          title:params && params.title ? params.title : '호랑이',
          description: '하이하이하이',
          imageUrl: 'http://k.kakaocdn.net/dn/Q2iNx/btqgeRgV54P/VLdBs9cvyn8BJXB3o7N8UK/kakaolink40_original.png',
          link: {
            mobileWebUrl: 'https://developers.kakao.com',
            webUrl: 'https://developers.kakao.com',
          },
        },
        social: {
          likeCount: 286,
          commentCount: 45,
          sharedCount: 845,
        },
        buttons: [
          {
            title: '웹으로 보기',
            link: {
              mobileWebUrl: 'https://developers.kakao.com',
              webUrl: 'https://developers.kakao.com',
            },
          },
          {
            title: '앱으로 보기',
            link: {
              mobileWebUrl: 'https://developers.kakao.com',
              webUrl: 'https://developers.kakao.com',
            },
          },
        ],
      });
    }
  }

  return (
    <div>
      <button onClick={sendLinkCustom}>Send Custom Link</button>
      <button onClick={sendLinkDefault}>Send Default Link</button>
    </div>
  );
}