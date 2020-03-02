var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var fs = require('fs');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

var server = app.listen(3000, function() {
    console.log("Express server has started on port 3000");
});

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(session({
    secret: '@#@$MYSIGN#@$#$',  // 쿠키를 임의로 변조하는 것을 방지하기 위한 sign 값
    resave: false,  // 세션을 언제나 저장할 지 정하는 값
    saveUninitialized: true // 새로 생겼지면 변경되지 않은 세션을 의미
}));

// 이 코드가 bodyParser 설정 아래부분에 있다면 제대로 작동 X
var router = require('./router/main')(app, fs);