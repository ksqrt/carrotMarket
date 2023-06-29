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
            <div className="byun-modal-overlay">
                <div className="byun-modal">
                    <span className="byun-close" onClick={closeModal}>&times;</span>
                    <div className='byun-modalimagesize'>
                        <img src={imagesrc} className="byun-modal-image" />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Imagemodal;