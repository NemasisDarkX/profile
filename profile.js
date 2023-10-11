const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

const imageDir = path.join(__dirname, 'images');

app.get('/image', (req, res) => {
  fs.readdir(imageDir, (err, files) => {
    if (err) {
      return res.status(500).send('Error reading image directory');
    }

    const randomImage = files[Math.floor(Math.random() * files.length)];
    const imagePath = path.join(imageDir, randomImage);
    
    
    const fileExtension = path.extname(randomImage).toLowerCase();

    const imageStream = fs.createReadStream(imagePath);
    imageStream.on('open', () => {
      
      if (fileExtension === '.png') {
        res.set('Content-Type', 'image/png');
      } else if (fileExtension === '.jpg' || fileExtension === '.jpeg') {
        res.set('Content-Type', 'image/jpeg');
      } else {
        return res.status(500).send('Unsupported image format');
      }
      
      imageStream.pipe(res);
    });

    imageStream.on('error', () => {
      res.status(500).send('Error serving the image');
    });
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
