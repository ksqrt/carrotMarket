import React from 'react';
import { useState } from 'react';
import axios from 'axios';

const ImageTest = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = async () => {
    if (selectedImage) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedImage);
      reader.onloadend = async () => {
        const base64data = reader.result;

        try {
          await axios.post('http://localhost:5000/imageTest', { image: base64data });
          console.log('Image uploaded successfully!');
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      };
    }
  };

  const handleImageSelect = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  return (
    <div>
      <input type="file" onChange={handleImageSelect} />
      <button onClick={handleImageUpload}>Upload</button>
    </div>
  );
};


export default ImageTest;
