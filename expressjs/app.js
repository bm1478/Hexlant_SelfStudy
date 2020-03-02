const express = require('express');
const app = express();
const port = 3000;

/*
//app.use(express.static('public'));
app.use('/static', express.static(__dirname + '/public'));
app.use(express.static('files'));
// public, files 디렉토리에 포함된 이미지, css 파일 및 javascript 파일 제공가능

app.get('/', (req, res) => res.send('Hello World!'));
app.post('/', (req, res) => res.send('Got a POST request'));
app.put('/user', function(req, res) {
    res.send('Got a PUT request at /user');
});
app.delete('/user', function(req, res) {
    res.send('Got a DELETE request at /user');
});
*/


// 미들 웨어 작성
var myLogger = function(req, res, next) {
    console.log('LOGGED');
    next();
}

var requestTime = function(req, res, next) {
    req.requestTime = Date.now();
    next();
};

app.use(myLogger);
app.use(requestTime);

// 애플리케이션 레벨 미드웨어
app.use(function (req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

app.use('/user/:id', function(req, res, next) {
    console.log('Request URL: ', req.originalUrl);
    next();
}, function(req, res, next) {
    console.log('Request Type: ', req.method);
    next();
});

app.get('/', function(req, res ){
    var responseText = "Hello World!";
    responseText += 'Requested at: ' + req.requestTime + '';
    res.send(responseText);
});

app.get('/user/:id', function(req, res, next) {
    console.log('ID: ', req.params.id);
    next();
}, function(req, res, next) {
    res.send('User Info');
});

// handler for the /user/:id path, which renders a special page
app.get('/user/:id', function(req, res, next) {
    res.render('special');
});

app.listen(port, () => console.log('Example app listening on port ${port}!'));