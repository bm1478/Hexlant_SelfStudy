// 라우터 레벨 미들웨어
const express = require('express');
var app = express();
var router = express.Router();

app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// a middleware function with no mount path. This code is executed for every request to the router
router.use(function(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

// a middleware sub-stack shows request info for any type of HTTP request to the /user/:id path
router.use('/user/:id', function (req, res, next) {
    console.log('Request URL: ', req.originalUrl);
    next();
}, function(req, res, next) {
    console.log('Request Type: ', req.method);
    next();
});

// a middleWare sub-stack that handles GET requests to the /user/:id path
router.get('/user/:id', function(req, res, next) {
    // if the userID is 0, skip to the next router
    if(req.params.id == 0) next('route');
    // otherwise pass control to the next middleware function in this stack
    else next();
}, function(req, res, next) {
    // render a regular page
    res.render('regular'); 
});

// handler for the /user/:id path, which renders a special page
router.get('/user/:id', function(req, res, next) {
    console.log(req.params.id);
    res.render('special');
});

// mount the router on the app
app.use('/', router);
// 오류 처리 미들웨어
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(3000);