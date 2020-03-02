const express = require('express');
const app = express();
const port = 3000;

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

app.listen(port, () => console.log('Example app listening on port ${port}!'));