## Router Explain - 라우팅

1. 정의

라우팅: 애플리케이션 엔드 포인트(URI)의 정의, 그리고 URI가 클라이언트 요청에 응답하는 방식.

라우트 메소드: HTTP 메소드 중 하나로부터 파생, express 클래스의 인스턴스에 연결.
- get, post, put, head, delte 등 제공

2. 라우트 경로

요청 메소드와의 조합을 통해, 요청이 이루어질 수 있는 엔드포인트 정의.

3. 라우트 핸들러

여러 콜백 함수를 제공하여 요청을 처리할 수 있음. 차이점은 next('route')를 호출하여 나머지 라우트 콜백을 우회할 수도 있다는 점. 이렇게 하면 라우트에 대한 사전 조건 지정 후, 현재의 라우트를 계속할 이유가 없는 경우 제어를 후속 라우트에 전달.

```javascript
// 2개 이상의 콜백 함수는 하나의 라우트를 처리(next 오브젝트 지정해야함.)
app.get('/example/b', function(req, res, next) {
    console.log('the response will be sent by the next function ...');
    next();
}, function(req, res) {
    res.send('Hello from B!');
});
```

4. app.route()

app.route()를 이용하면 라우트 경로에 대해 체인 가능한 라우트 핸들러를 작성할 수 있음. 경로는 한 곳에 지정되어 있으므로, 모듈식 라우트를 작성하면 중복성과 오타가 감소하여 도움이 됨.

```javascript
app.route('book')
.get(function(req, res) {
    res.send('Get a random book');
})
.post(function(req, res) {
    res.send('Add a book');
})
.put(function(req, res) {
    res.send('Update the book');
});
```

5. express.Router

express.Router 클래스를 사용하면 모듈식 마운팅 가능한 핸들러를 작성할 수 있음

Router 인스턴스는 완전한 미들웨어이자 라우팅 시스템, 미니앱이라 불리는 경우가 많다.
- "birds.js"
```javascript
var express = require('express');
var router = express.Router();

// middleware that is specific to this router
router.use(function timelog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});
// define the home page route
router.get('/', function(req, res) {
    res.send('Birds home page');
});
// define the about route
router.get('/about', function(req, res) {
    res.send('About birds');
});

module.exports = router;
```

```javascript
var birds = require('./birds');
app.use('/birds', birds);
```