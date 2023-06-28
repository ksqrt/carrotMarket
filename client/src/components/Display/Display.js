import React, { useEffect, useState } from 'react';
import '../CreateSell/addproduct.css';
import { ReactDOM } from 'react-dom';
import Imagecard from './Imagecard';

const Display = ({image, deleteimg}) => {
    const imgboxbtn = (e) => {
        const value  = e.currentTarget.value;
    }
    return (
        <>
        {
            image.map((item,index) => 
                <Imagecard deleteimg={deleteimg} item={item} index={index}/>
            )
        }   
        </>
    );
};
export default Display;
