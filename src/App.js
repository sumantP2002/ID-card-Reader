// App.js
import React, { useState } from 'react';
import ImageForm from './components/ImageForm';

const App = () => {
  const [extractedData, setExtractedData] = useState(null);

  const handleExtractionComplete = (data) => {
    setExtractedData(data);
  };

  return (
    <div>
      <h1>ID Card Information Extractor</h1>
      <ImageForm onExtractionComplete={handleExtractionComplete} />

      {extractedData && (
        <div>
          <h2>Extracted Information:</h2>
          <p>Name: {extractedData.name}</p>
          <p>Last Name: {extractedData.lastName}</p>
          <p>ID No: {extractedData.idNumber}</p>
          <p>DOB: {extractedData.dob}</p>
          <p>IssueDate: {extractedData.issueDate}</p>
          <p>ExpiryDate: {extractedData.expiryDate}</p>
        </div>
      )}
    </div>
  );
};

export default App;