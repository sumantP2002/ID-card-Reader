// image-text-detection-backend/index.js
const express = require('express');
const multer = require('multer');
const { ImageAnnotatorClient } = require('@google-cloud/vision');
const cors = require('cors');

// Load the service account key from a file
const serviceAccountKey = {
    "type": "service_account",
    "project_id": "principal-rhino-409017",
    "private_key_id": "90ed82041797280408c91f0f38f1abdab00f8ae7",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCsqQyG+z28lUv8\nOQYF+EgVi0mfIoUto77ALUlGZihG/VlGosnlGn3tMRLM4bvnj8n8OxQCRs/CFFKg\ni0fsRvIZtg6Z1ot7s4KBj0NIFDU0i0NysnapB1Z5/tgg7Pg5opOeBItZbtNvctXw\nagMAcrnep6UhOfsHPCwQw2YQbXvL/dTVjVhea/+TsK1rHkE44qhg2ZRFQ9aWjgOy\nDOus75eaE6NFJGlmXVJLITinikuXNGZRnEiGo4tNmKPL7uk+rAQNj4LHqrLTg7QS\nfb9ZyBEatVbJUQdhnYWyT+1ZRxU0EpVzsnOSlqsAs2BitvD6dx1RGqpc4z4/UTYH\n7sCeVKQLAgMBAAECggEAEBoz8OK9fzjtPTiUNzpQfrHey9iMUxVSVNnkW4xrdTNr\ngAruiU9PLy/EcRccTxw52iwoUY4JEjCTBCX5Ly/upDc2ZWJ836x+H1cdDzvTOnNC\ndw/twRXOGtKJlYiEHdvrqHEEDfMoBNzQ1vsMDJ6mdv1riQ2/O42BDo8qlZ2gTgXW\n5vyDdCR3tQjsUslop7HAA+3jMBBunroDmi6q8yRh7q7oYQx+0aRI9MFi1606Q9rf\nUSdhry71FRLkzY0Jx8XhODWpHd3eo2a3yc9H1P/as3P5KPDMfenoh9jLuueXE0jX\nMSraqBRzFKznoFIvEgguuk+Vx5Ql3cXupEtJFf95AQKBgQDgfqctWPrYT4Lzg57c\n+Ov7wsfqO+7ec/yf1VLJuyTHy7+w0Hl6FqdU6a5aXMBbQDgsr2qYIXQAo2Q632ju\n82C5cMvv7ebWye58TXm0FKPE9D39yLujiKz8uzENUv4OPS7VJlmpOQqr884ZkjT5\n1J4+z9IMBV/2NlsEknTzGQ6hhQKBgQDE5Ci/GTcGB9aMg2d09SPsC2R3MLg1J5FK\n5AD0TEqZZRP8goluuCAZ0ZoW4DsdMelT76bY//cR3iSVIrqc8NZOtpymIzCSRFUV\nkcmr7bMNr+dn3/+3q8VgAyC8WepzvpmYV/vQQiD5TpJVAQSr6eY9kBkImMW75Edu\nr10YhkFcTwKBgQDVUUQF4SEq3hLu1cjk7FtAdYuFVcHa+5e3QPtT2VJPz5msp8xm\naJREKXCVSME3dERsoZrGSDN0T83z60pIlFb6nuYKbKMGwgatcukMZvhfND6bolw6\nPqsx06X+pTfny9dujuxv0lYDor3aqoVQR+q+gLd02L6gtHG0XH5oaQzwCQKBgQCz\nN5M3TzZckOnkAQA8356RD1WlgH1MNPX1m1CbDo6gzfbBU/jRBVyC491EkVp9mp7u\nPig7QdKdOv1FmtUOYdJQ17wDJejiWryv44IUs0rWXJVgYe6cOwhv+qjjiVz1ejrJ\nBt05ldf51mEwarrb2Q4wX2fKAXWLL6EtyQYOerYn1QKBgA7QBwK6eb9KnRzuy1k3\nZOOovioGd0UdWDGdyjUkbH4aHiz9iQXmmB6OTKFDocP5A0uIg9V6EaLY7X/DfJX+\n7Lt+PUTrXZ7bftn0W1J6QqYJMH32YeDqoWLJibLCEbeqQHZ04i73DcZ9vQLYsVxe\nYAT5qcB6qy/yZk03VJ5V4Q96\n-----END PRIVATE KEY-----\n",
    "client_email": "aditya-raj@principal-rhino-409017.iam.gserviceaccount.com",
    "client_id": "114459150443715012901",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/aditya-raj%40principal-rhino-409017.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  };




 

const app = express();
const port = 3001;
app.use(cors());

const client = new ImageAnnotatorClient({ credentials: serviceAccountKey });
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/detect-text', upload.single('image'), async (req, res) => {
  try {
    const [result] = await client.textDetection(req.file.buffer);
    const texts = result.textAnnotations;

    const resultJson = {
      text_detected: texts.map((text) => ({
        description: text.description,
        bounding_box: text.boundingPoly.vertices.map((vertex) => ({
          x: vertex.x,
          y: vertex.y,
        })),
      })),
    };

    res.json(resultJson);
  } catch (error) {
    console.error('Error detecting text:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
