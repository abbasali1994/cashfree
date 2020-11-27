var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var path = require('path');
var CryptoJS = require('crypto-js')
var Base64 = require('crypto-js/enc-base64')

const SECRET_KEY = "9ebdf33c5aabc748a3750b0879ec9efe53254e95";


app.set('view engine', 'ejs');
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});
app.post('/finish', function (req, res) {
  var postData = req.body
  var signatureData = postData["orderId"] + postData["orderAmount"] + postData["referenceId"] + postData["txStatus"] + postData["paymentMode"] + postData["txMsg"] + postData["txTime"]
  signature = CryptoJS.HmacSHA256(signatureData, SECRET_KEY)
  signatureValue = Base64.stringify(signature)
  res.render('finish', { ...req.body, success: signatureValue === postData["signature"] });
})

var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening", host, port)
})

var http = require('http');

//create a server object:
http.createServer(function (req, res) {
  res.write('Hello World!'); //write a response to the client
  res.end(); //end the response
}).listen(8080); //the server object listens on port 8080 