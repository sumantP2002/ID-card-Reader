// ImageForm.js
import React, { useState } from 'react';
import axios from 'axios';

const ImageForm = ({ onExtractionComplete }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    console.log('hii');
    setFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    //console.log('onExtractionComplete:', onExtractionComplete);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('http://localhost:3001/extract-information', formData);
      onExtractionComplete(response.data);
    } catch (error) {
      console.error('Error extracting information:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default ImageForm;
