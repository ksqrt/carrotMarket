import React from 'react';
import '../CreateSell/addproduct.css';

const Display = ({image}) => {
    console.log('durl');
    return (
        <>
        {
            image.map((item,index) => 
            <img src={item} className="imge"></img>)
          } 
        </>
    );
};

export default Display;
