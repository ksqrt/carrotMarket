import React, { useEffect, useState } from 'react';
import '../CreateSell/addproduct.css';
import { ReactDOM } from 'react-dom';

import Imagecard from './Imagecard';

const Display = ({image, deleteimg, imgboxbtn}) => {
    
    return (
        <>
        {
            image.map((item,index) => 
                <Imagecard imgboxbtn={imgboxbtn} deleteimg={deleteimg} item={item} index={index}/>
            )
        }   
        </>
    );
};
export default Display;
