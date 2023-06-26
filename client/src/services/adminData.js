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



export async function getUserCount() {
    try{
        const userCount = await fetch(`${baseUrl}/admin/userCount`);
        console.log('Client UserCount',userCount);
        return userCount.json();
    }catch(error){
        console.log(error);
    }

    }


    export async function getProductCount() {
        try{
            const productCount = await fetch(`${baseUrl}/admin/productCount`);
            console.log('Client ProductCount',productCount);
            return productCount.json();
        }catch(error){
            console.log(error);
        }
    
        }


        
    export async function getAdminProduct() {
        try{
            const adminProducts = await fetch(`${baseUrl}/admin/adminProduct`);
            console.log('Client ProductCount',adminProducts);
            return adminProducts.json();
        }catch(error){
            console.log(error);
        }
    
        }
        

        export async function deleteProduct(productId) {
            try {
              console.log('값 넘기냐', productId);
              await fetch(`${baseUrl}/admin/deleteProduct/${productId}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                },
              });
            } catch (error) {
              console.log(error);
            }
          }
        
    

          export async function getAllProducts() {
            try {
              console.log('값 넘기냐');
              const adminProduct = await fetch(`${baseUrl}/admin/adminProduct`)
              console.log('dashboard getAdmin ' ,adminProduct);
              }
               catch (error) {
              console.log(error);
            }
        }


        

         