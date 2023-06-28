import React from 'react';
import '../CreateSell/addproduct.css';
import Imagecard from './Imagecard';


    // const imgboxbtn = (e) => {
    //     const value  = e.currentTarget.value;
    // }
const Display = ({image, deleteimg, imgboxbtn}) => {
    
    return (
        <>
        {
            image.map((item,index) => 
                <Imagecard imgboxbtn={imgboxbtn} deleteimg={deleteimg} item={item} index={index}/>                
                
                // {if(index === 0){
                //     return(
                //         <Imagecard imgboxbtn={imgboxbtn} deleteimg={deleteimg} item={item} index={index}/>
                //     );
                // }else{
                //     return (
                //         <Imagecard imgboxbtn={imgboxbtn} deleteimg={deleteimg} item={item} index={index}/>
                //     );
                // }}
            )
        }   
        </>
    );
};
export default Display;
    