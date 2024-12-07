// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});



app.get("/api/:date?", (req, res) => {
  let inputDate = req.params.date
  let isValid = Date.parse(inputDate)
  let isValidUnix = /^[0-9]+$/.test(inputDate)
  let isEmpty = inputDate == "" || inputDate == null

  let unixOuput = 0
  let UtcOutput = ""

  if(isValid){
    unixOuput = new Date(inputDate)
    UtcOutput = unixOuput.toUTCString();
    return res.json({
      unix : unixOuput.valueOf(),
      utc : UtcOutput
    })
  } else if (isNaN(isValid) && isValidUnix){
    unixOuput = new Date(parseInt(inputDate))
    UtcOutput = unixOuput.toUTCString()

    return res.json({
      unix : unixOuput.valueOf(),
      utc : UtcOutput
    })
  } else if (isEmpty){
    unixOuput = new Date()
    UtcOutput = unixOuput.toUTCString()

    return res.json({
      unix : unixOuput.valueOf(),
      utc : UtcOutput
    })
  } else {
    res.json({
      error : "Invalid Date"
    })
  }
    
  })



// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on:");
  console.log(`http://localhost:${process.env.PORT || 3000}`);
});
