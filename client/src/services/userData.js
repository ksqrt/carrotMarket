import url from "../url.js";
const baseUrl = url;


export async function snsUser(user) {
    const response = await fetch(`${baseUrl}/auth/snsLogin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(user),
    });
  
    return response.json();
  }
  

export async function registerUser(userData) { //Register.js에서 userData 받음
    return (await fetch(`${baseUrl}/auth/register`, { //App.js에 등록된 엔드포인트 URL
        method: 'POST', //POST 요청에는 header와 body(본문)가 포함
        headers: {
            'Content-Type': 'application/json', //JSON 형식의 데이터를 전송한다고 지정
        },
        credentials: 'include', //요청에 쿠키를 포함하도록 설정
        body: JSON.stringify(userData) //userData 객체를 JSON 문자열로 변환하여 요청 본문에 포함
    })).json(); //서버의 응답을 JSON형식으로 파싱하여 반환. /await - 비동기 작업의 완료를 기다림
}

export async function loginUser(userData) {
    return (await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData)
    })).json();
}

export async function getUser() {
    return await (await fetch(baseUrl + '/auth/getUser', {credentials: 'include'})).json()
}

export async function getUserActiveSells(id) {
    return (await fetch(`${baseUrl}/products/sells/active/${id}`, {credentials: 'include'})).json();
}
// 보관함 불러오기
// export async function getUserArchivedSells(user_id) {
//     return (await fetch(`${baseUrl}/products/sells/archived`, {credentials: 'include'})).json();
// }
export async function getUserArchivedSells(user_id) {
    return (
        await fetch(`${baseUrl}/products/sells/archived`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ user_id: user_id }),
        })
      ).json();
    }
    

export async function getUserSoldoutSells(id) {
    return (await fetch(`${baseUrl}/products/sells/soldout/${id}`, {credentials: 'include'})).json();
}
// 유저 찜목록
// export async function getUserWishlist(user_id) {
//     return (await fetch(`${baseUrl}/products/wishlist/getWishlist`, {credentials: 'include'})).json();
// }
export async function getUserWishlist(user_id) {
    return (
        await fetch(`${baseUrl}/products/wishlist/getWishlis`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ user_id: user_id }),
        })
      ).json();
    }
    


export async function insertConversation(){
    
}

export async function editUserProfile(id, data) {
    return (await fetch(`/user/edit-profile/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data)
    })).json();
}

export async function getUserById(id) {
    return await (await fetch(baseUrl + `/user/getUserById/${id}`, {credentials: 'include'})).json()
}





export async function updateMannerTemperature(id, mannerTemperature) {
    console.log('ggg');
    console.log(mannerTemperature);
    console.log(id, '아이디용');
      const response = await fetch(`${baseUrl}/user/updatemanner/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(mannerTemperature), // Convert the object to JSON format
      });
      console.log(mannerTemperature, '수정후');
    }
  
  
