# Express-tutorial

1.  모듈
- body-parser: POST 데이터 처리
- express-session: 세션 관리

2. EJS 템플릿 엔진
템플릿 엔진: 탬플릿을 읽어 엔진의 문법과 설정에 따라 파일을 HTML형식으로 변환시키는 모듈
<% %>를 사용하여 서버의 데이터를 사용하거나 코드를 실행시킬 수 있음.
- <%자바스크립트 코드%>
- <%출력 할 자바스크립트 객체%>

3. RESTful API
REST: Representational State Transfer, www와 같은 하이퍼미디어 시스템을 위한 소프트웨어 아키텍처 중 하나의 형식
REST 서버는 클라이언트로 하여금 HTTP 프로토콜을 사용해 서버의 정보에 접근 및 변경을 가능케 함. 정보는 text, xml, json 등, 주로 json.

HTTP Method
- GET: 조회
- PUT: 생성 및 업데이트, 리소스의 위치가 명확히 지정됐을 때.
- DELETE: 제거
- POST: 생성, 리소스의 위치를 지정하지 않았을 때

4. express-session
세션 관리에 사용.