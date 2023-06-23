const baseUrl = "http://localhost:5000";
// // const baseUrl = "http://101.79.11.48:5000";

export async function getadminUser() {
  // 쿼리문이 공백이면 node js 가 돌아가고있는 http://localhost:5000 포트에서 데이터를 가지고옴
  // node 서버 예시 http://localhost:5000/products?page=2&search=BMW
    try{
        const response =  await fetch(`${baseUrl}/admin/user`);
        return response.json();
    }catch(error){
        console.log(error);
    }

    }

export async function deleteadminUser(deleteUser) {

    try {
        console.log(deleteUser);
        await fetch(`${baseUrl}/admin/deleteuser/${deleteUser}`, {
            method: 'DELETE',
            body: JSON.stringify({ deleteUser }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.log(error);
    }
}
        


//   if (query !== "" && query !== undefined) {
//     return (
//       await fetch(`${baseUrl}/products?page=${page}&search=${query}`, {
//         credentials: "include",
//       })
//     ).json();
//   } else if (category && category !== "all") {
//     return (
//       await fetch(`${baseUrl}/products/${category}?page=${page}`, {
//         credentials: "include",
//       })
//     ).json();
//   } else {
//     return (
//       await fetch(`${baseUrl}/products?page=${page}`, {
//         credentials: "include",
//       })
//     ).json();
// }
