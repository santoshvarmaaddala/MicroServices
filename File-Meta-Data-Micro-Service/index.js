var express = require('express');
var multer = require('multer');
var cors = require('cors');
require('dotenv').config()

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));
const upload = multer({
  dest: './public/data/uploads'
})

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/fileanalyse', upload.single('upfile'), function(req, res){
  try{
    res.json({
      "name" : req.file.originalname,
      "type" : req.file.mimetype,
      "size" : req.file.size
    })
  }catch(err){
      res.send(400);
      console.log('bad request: 400')
  }
})

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port')
  console.log(`http://localhost:${port}`);
  
});
