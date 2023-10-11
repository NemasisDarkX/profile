const express = require('express');
const app = express();
const fs = require('fs');
const axios = require('axios');
const path = require('path');
const data = require('./data.json');

app.get('/image', async (req, res) => {
  const randomIndex = Math.floor(Math.random() * data.length);
  const randomImageUrls = data[randomIndex];

  if (!randomImageUrls) {
    return res.status(404).send('Image not found');
  }

  const randomImageIndex = Math.floor(Math.random() * Object.keys(randomImageUrls).length);
  const imageUrl = randomImageUrls[randomImageIndex];

  try {
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
    });

    
    const extension = path.extname(imageUrl);
    const filename = `random-image-${randomIndex}-${randomImageIndex}${extension}`;
    const filePath = path.join(__dirname, 'images', filename);

  
    await fs.promises.writeFile(filePath, response.data);

    
    res.redirect(filePath);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error serving the image');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
