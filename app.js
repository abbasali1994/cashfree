var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var path = require('path');
var CryptoJS = require('crypto-js')
var Base64 = require('crypto-js/enc-base64')
var constants = require('./constants')

app.set('view engine', 'ejs');
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});
app.post('/generateToken', function (req, res) {
  var data = req.body
  var tokenData = "appId=" + constants.APP_KEY + "&orderId=" + data.orderId + "&orderAmount=" + data.orderAmount + "&customerEmail=" + data.customerEmail + "&customerPhone=" + data.customerPhone + "&orderCurrency=" + data.orderCurrency;
  signature = CryptoJS.HmacSHA256(tokenData, constants.SECRET_KEY)
  signatureValue = Base64.stringify(signature)
  res.send({ token: signatureValue });
})
app.post('/finish', function (req, res) {
  var postData = req.body
  var signatureData = postData["orderId"] + postData["orderAmount"] + postData["referenceId"] + postData["txStatus"] + postData["paymentMode"] + postData["txMsg"] + postData["txTime"]
  signature = CryptoJS.HmacSHA256(signatureData, constants.SECRET_KEY)
  signatureValue = Base64.stringify(signature)
  res.render('finish', { ...req.body, success: signatureValue === postData["signature"] });
})

var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening", host, port)
})
