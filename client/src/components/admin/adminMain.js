import React, { useState } from 'react';
import "./adminMain.css";
import { Button } from 'react-bootstrap';
import AdminProduct from './AdminProduct';
import AdminUser from './AdminUser';
import { getadminUser,getUserCount,getProductCount,getAdminProduct , getAllProducts} from '../../services/adminData';
import AdminDashboard from './AdminDashboard';

const AdminMain = () => {
  const [adminUser, setAdminUser] = useState(true);
  const [adminProduct, setAdminProduct] = useState(false);
  const [adminDashboard,setAdminDashboard] = useState(false);
  const [users , setUsers] = useState([]);
  const [Products , setProducts] = useState([]);


  const [userCount,setUserCount] = useState('');
  const [productCount,setProductCount,] = useState('');
  
  const[AllProducts , setAllProducts] = useState('');
  

  const handleAdminUser = () => {
    setAdminUser(true);
    setAdminProduct(false);
    setAdminDashboard(false);

    getadminUser().then(data =>{
      console.log('유저목록',data);
      setUsers(data);
    }).catch(error =>{
      console.log(error);
    })

    // console.log(getadminUser());
    // setUsers(getadminUser());
  };

  const handleAdminProduct = () => {
    setAdminUser(false);
    setAdminDashboard(false);
    setAdminProduct(true);

    getAdminProduct().then(data=>{
      setProducts(data);
    }).catch(error=>{
      console.log(error);
    })

  };

  const handleAdminDashboard = () =>{
    setAdminUser(false);
    setAdminProduct(false);
    setAdminDashboard(true);

    getAdminProduct().then(data=>{
      setProducts(data);
    }).catch(error=>{
      console.log(error);
    })
  

    getUserCount().then(data =>{
      setUserCount(data.length);
    }).catch(error =>{
      console.log(error);
    })


    getProductCount().then(data =>{
      setProductCount(data.length);
    }).catch(error =>{
      console.log(error);
    })

    console.log('유저수'+userCount);
    console.log('제품수'+ productCount);
    console.log('제품' + Products);



    getUserCount();

    console.log(getUserCount());

  }

   return (
   <div>
  <div class="AdminMainHeader">
    <h1>당근마켓 어드민 페이지</h1>
  </div>


   <div className="categori">
      
      <button className='button'
                onClick={handleAdminUser}  
              >유저관리
             
      </button>

      <button  className='button'
                onClick={handleAdminProduct}
                >제품관리
      </button>

      <button className='button' onClick={handleAdminDashboard}>
                어드민 대시보드 

      </button>
    </div>  
           <div id ="AdminContent">
              {adminUser && <AdminUser params={users}/>}

              {adminProduct && <AdminProduct params = {Products}/>}

              {adminDashboard && <AdminDashboard params={[userCount,productCount,Products]}/>}

            </div>

      </div>
    );
}
export default AdminMain;