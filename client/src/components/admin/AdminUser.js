import React from 'react';
import { useState } from 'react';
import { Card } from 'react-bootstrap';
import './AdminUser.css';
import {deleteadminUser} from './../../services/adminData';


const AdminUser = (props) => {

    const deletehandler = (e) =>{
        const name = e.target.value;
        console.log('delete',name);
        deleteadminUser(name);

        window.location.reload();

    }



    console.log('User',props)

   
    const avatars = props.params.map(item => item.name);


    console.log(avatars);
    


    // console.log(name);

    return (
        <div>
            <h1>어드민 유저 </h1>
            <br></br>
        <div>
        {avatars.map((name, index) => (
                    <div id="Username" key={index}>{name}<br/>
                     <button onClick={deletehandler} value={name} className='button'>회원탈퇴</button>
                    <hr/>
                      <br/>
                    </div>
                ))}
                
        </div>   
        </div>
    );
};

export default AdminUser;