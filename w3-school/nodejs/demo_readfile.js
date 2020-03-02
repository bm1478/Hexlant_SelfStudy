var http = require('http');
var fs = require('fs'); //fs is File System Module - Read, Create, Upate, Delete, Rename Files.
http.createServer(function (req, res) {
    fs.readFile('demofile1.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    });
}).listen(8080);

// Create Files
fs.appendFile('mynewfile1.txt', 'Hello content', function(err) {
    if(err) throw err;
    console.log('Saved');
});

fs.open('mynewfile2.txt', 'w', function (err, file) {
    if(err) throw err;
    console.log('Saved');
});

fs.writeFile('mynewfile3.txt', 'Hello content!', function(err) {
    if(err) throw err;
    console.log('Saved');
});

// Update Files
fs.appendFile('mynewfile1.txt', ' This is my text.', function(err) {
    if(err) throw err;
    console.log('Updated!');
});

fs.writeFile('mynewfile3.txt', 'This is my text', function(err) {
    if(err) throw err;
    console.log('Replaced!');
});
ç
// Delete Files
fs.unlink('mynewfile2.txt', function(err) {
    if(err) throw err;
    console.log('File deleted!');
});

// Rename Files
fs.rename('mynewfile1.txt', 'myrenamedfile.txt', function(err) {
    if(err) throw err;
    console.log('File Renamed!');
});