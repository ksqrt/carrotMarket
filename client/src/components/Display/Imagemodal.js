import React, { useEffect, useState } from 'react';
import './modal.css'

const Imagemodal = ({image,closeModal,checkimgindex}) => {
    
    const [imagesrc,setImagesrc] = useState('');
    useEffect(()=> {
        setImagesrc(image[checkimgindex]);

    },[])
    console.log(image);
    console.log(checkimgindex);
    console.log(image[checkimgindex]);
    

    return (
        <>
            <div className="modal-overlay">
                <div className="modal">
                    <span className="close" onClick={closeModal}>&times;</span>
                    <div className='modalimagesize'>
                        <img src={imagesrc} className="modal-image" />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Imagemodal;