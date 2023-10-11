const express = require('express');
const app = express();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const imageData = [
  { id: 1, url: 'https://ibb.co/Bry1LHf' },
  { id: 2, url: 'https://ibb.co/YL9wJgd' },
  { id: 3, url: 'https://ibb.co/99TfQhF' },
];


const imagesDirectory = path.join(__dirname, 'images');
if (!fs.existsSync(imagesDirectory)) {
  fs.mkdirSync(imagesDirectory);
}


app.get('/random-image', async (req, res) => {
  const randomIndex = Math.floor(Math.random() * imageData.length);
  const randomImage = imageData[randomIndex];
  const imageFileName = `image-${randomImage.id}.jpg`;
  const imagePath = path.join(imagesDirectory, imageFileName);

 
  if (!fs.existsSync(imagePath)) {
    const response = await axios({
      url: randomImage.url,
      method: 'GET',
      responseType: 'stream',
    });
    const writer = fs.createWriteStream(imagePath);
    response.data.pipe(writer);
    await new Promise((resolve) => writer.on('finish', resolve));
  }

  res.sendFile(imagePath);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
