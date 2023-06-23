import React, { useState } from 'react';
import "./adminMain.css";
import { Button } from 'react-bootstrap';
import AdminProduct from './AdminProduct';
import AdminUser from './AdminUser';
import { getadminUser } from '../../services/adminData';

const AdminMain = () => {
  const [adminUser, setAdminUser] = useState(true);
  const [adminProduct, setAdminProduct] = useState(false);
  const [users , setUsers] = useState([]);

  const handleAdminUser = () => {
    setAdminUser(true);
    setAdminProduct(false);

    getadminUser().then(data =>{
      //console.log(data);
      setUsers(data);
    }).catch(error =>{
      console.log(error);
    })

    // console.log(getadminUser());
    // setUsers(getadminUser());

   

  };

  const handleAdminProduct = () => {
    setAdminUser(false);
    setAdminProduct(true);
  
  };

   return (
   <div>
  <header>
    <h1>당근마켓 어드민 페이지</h1>
  </header>

   <div id ="categori">
      
      <button className='button'
                onClick={handleAdminUser}  
              >유저관리
             
      </button>

      <button  className='button'
                onClick={handleAdminProduct}
                >제품관리
      </button>
    </div>  
           <div id ="AdminContent">
              {adminUser && <AdminUser params={users}/>}

              {adminProduct && <AdminProduct/>}

            </div>

      </div>
    );
}
export default AdminMain;