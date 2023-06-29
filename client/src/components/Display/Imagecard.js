import React, { useEffect, useState } from 'react';
import CloseButton from 'react-bootstrap/CloseButton';

const Imagecard = ({deleteimg, item, index, imgboxbtn}) => {
    const [hideImage, setHideImage] = useState(false);
    useEffect(()=>{
        setHideImage(false);
    },[item])

    const hide = (index) => {
        deleteimg(index)
        setHideImage(true);

    }

    const zoomin = (index) => {
        imgboxbtn(index);
    }

    return (
        <div className={`imgwrapper ${hideImage ? 'hidden' : ''}`} key={index}>
                <button className='imgbtn' onClick={() => zoomin(index)} value={index}>
                    <img src={item} className="imge" alt="이미지" />
                </button>
                <CloseButton className='closebtn' onClick={() => hide(index)} />
        </div>
    );
};

export default Imagecard;