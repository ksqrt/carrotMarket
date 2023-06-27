import React, { useEffect } from 'react';
import '../CreateSell/addproduct.css';
import CloseButton from 'react-bootstrap/CloseButton';

// function imgboxbtn(e){
//     const value  = e.currentTarget.value;
//     console.log(value);
//   }

// function deletebtn(e){
//     const value_del = e.currentTarget.value;
//     console.log(value_del)
    
// }

const Display = ({image}) => {
    console.log(image)
    let image_map = image;
    const deletebtn = (e) => {
        const value_del = e.currentTarget.value;
        console.log(value_del);
        console.log('del zone');
        deleteimg(value_del);
    }

    const imgboxbtn = (e) => {
        const value  = e.currentTarget.value;
        console.log(value);
    }
 
    const deleteimg = (value_del) => {
        image_map.splice(value_del,1);
        window.location.reload();
    }

    return (
        <>
        {
            image_map.map((item,index) => 
            <div className='imgwrapper' key={index}>
                <button className='imgbtn' onClick={imgboxbtn} value={index}>
                    <img src={item} className="imge" alt="이미지" />
                </button>
                <button className='closebtn' onClick={deletebtn} value={index}>
                    <CloseButton />
                </button>
            </div>
            )
        } 
        </>
    );
};

export default Display;
