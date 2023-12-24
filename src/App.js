// src/App.js
import React, { useState } from 'react';
import ImageForm from './components/ImageForm';

const App = () => {
  const [result, setResult] = useState(null);

  const handleResult = (data) => {
    setResult(data);
  };

  return (
    <div>
      <h1>Text Detection App</h1>
      <ImageForm onResult={handleResult} />
      {result && (
        <div>
          <h2>Text Detection Result:</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default App;

