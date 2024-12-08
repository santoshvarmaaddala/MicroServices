require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();


const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static(`${process.cwd()}/public`));

let urlDatabase = {};
let urlCounter = 1;


app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});


app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url

  const urlRegex = /^(http|https):\/\/[^ "]+$/;
  if (!urlRegex.test(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

 
  for (const shortUrl in urlDatabase) {
    if (urlDatabase[shortUrl] === originalUrl) {
      return res.json({ original_url: originalUrl, short_url: shortUrl });
    }
  }

  const shortUrl = urlCounter++;
  urlDatabase[shortUrl] = originalUrl;

  res.json({ original_url: originalUrl, short_url: shortUrl });
});

app.get('/api/shorturl/:shorturl', (req, res) => {
  const shortUrl = req.params.shorturl;

  if (urlDatabase[shortUrl]) {
    res.redirect(urlDatabase[shortUrl]);
  } else {
    res.status(404).json({ error: 'No short URL found' });
  }
});


app.listen(port, () => {
  console.log(`Listening on port http://localhost:${port}`);
});
