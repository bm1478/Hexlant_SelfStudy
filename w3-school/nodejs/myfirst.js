var http = require('http');
var dt = require('./myfirstmodule');

http.createServer(function( req, res ) {
    res.writeHead(200, {'Content-Type': 'text/html'});  //200 means that all is OK, 두번째 인자는 response header에 포함된 object
    res.write(req.url + "\n"); // req argument represents the request from the client. 
    // http://localhost:8080/summer
    res.write("The date and time are currently: " + dt.myDateTime());
    res.end();  // end the response
}).listen(8080);

console.log('This example is different!');
console.log('The result is displayed in the Command Line Interface');

