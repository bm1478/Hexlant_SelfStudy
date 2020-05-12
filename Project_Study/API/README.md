# API
0. API(Application Programming Interface): 데이터와 기능의 집합을 제공해 컴퓨터 프로그램간 상호작용을 촉진, 서로 정보를 교환가능하도록 하는 것

1. RESTful API
- REST (Representational State Transfer): 분산 시스템 설계를 위한 아키텍처 스타일 (제약 조건의 집합)
    - 자원을 이름으로 구분하여 해당 정보의 상태를 주고 바는 모든 것 의미
    - 거대한 애플리케이션을 모듈, 기능별로 분리하기 쉬워짐.
    - Web 브라우저 외 클라이언트를 위해서. RESTful API를 사용하면 여러 클라이언트가 자유롭고 부담없이 데이터를 이용.
    - 제약조건: 
        - Client/Server, 자원을 요청하는 쪽이 Client, 자원이 있는 쪽이 Server, REST Server: API를 제공하고 비즈니스 로직 처리 및 저장을 책임짐/Client: 사용자 인증인 context(세션, 로그인 정보) 등을 관리하고 책임짐.
        - Stateless(각 요청에 클라이언트의 context가 서버에 저장되어서는 안됨.), Client 의 요청만을 단순 처리, 이전 요청이 다음 요청 처리와 연관이 없다. DB 수정은 허용.
        - Cacheable: 클라이언트는 응답을 캐싱할 수 있어야함. 대량의 요청 효율적 처리 위해
        - Layerd System: 클라이언트는 서버에 직접 연결되었는지 미들웨어에 연결되었는지 알 필요가 없어야 함.
        - Code on demand(option): 서버에서 코드를 클라이언트에게 보내서 실행하게 할 수 있어야 함.
        - uniform interface: 자원(HTTP URI)은 유일하게 식별 가능, HTTP Method로 표현을 담고, 메시지는 스스로를 설명해야하고, 하이퍼링크를 통해 상태가 전이(HATEOAS) 되어야함.
    - 장점: 메시지를 단순하게 표현할 수 있고 확장에 유연, 기존 HTTP 인프라 이용 가능, Server/Client를 완전히 독립적으로 구현
    - 단점: 표준, 스키마가 없다, 행위에 대한 메소드가 제한적.(GET, POST, PUT, DELETE, HEAD)

- RESTful: 제약 조건 집합 (아키텍처 스타일, 아키텍처 원칙)을 모두 만족하는 것
- URI (Uniform Resource Identifier), URL (Uniform Resource Locator), URI 가 파일 뿐 아니라 여러 자원들까지 포함하는 개념.
- CRUD Operation
    - Create : 생성(POST)
    - Read : 조회(GET)
    - Update : 수정(PUT)
    - Delete : 삭제(DELETE)
    - HEAD: header 정보 조회(HEAD)

- REST API: REST 기반으로 서비스 API 구현, 시스템을 분산해 확장성과 재사용성을 높여 유지보수 및 운용을 편리하게 할 수 있다.
    - URI는 정보의 자원을 표현
        - resource는 동사보다는 명사, 대문자보다는 소문자
        - 도큐먼트(객체 인스턴스나 데이터베이스 레코드와 유사한 개념) 이름으로는 단수명사
        - 컬렉션(서버에서 관리하는 디렉터리라는 리소스) 이름으로는 복수명사
        - 스토어(클라이언트에서 관리하는 리소스 저장소) 이름으로는 복수 명사 
    - 자원에 대한 행위는 HTTP Method로 표현
        - URI에 HTTP Method가 들어가면 안됨.
        - URI에 행위에 대한 동사 표현이 들어가면 안됨.
        - 경로 부분 중 변하는 부분은 유일 값으로 대체
     - 설계 규칙: / 는 계층 관계, 마지막 문자로 / 사용 X, 하이픈은 URI 가독성 위해, 밑줄은 사용 X, URI 경로에는 소문자 적합, 파일확장자는 포함 X, 리소스 간 연관관계-/리소스명/리소스ID/관계 있는 리소스 
    

2. WebSocket API
- HTTP/WebSocket
    - HTTP 프로토콜은 서버와 클라이언트 사이의 연결이 유지되지 않아 실시간 통신 구현하는데 어려움이 많음.
        - Polling: 클라이언트에서 일정 주기마다 요청 보내고 서버는 현재 상태 바로 응답. 서버에서 변화 없더라도 매 요청마다 응답을 내리기 때문에 불필요 트래픽 발생
        - Long Polling: 클라이언트에서 요청 보내고 서버에서는 이벤트 발생했을 때 응답을 내려주고 클라이언트가 응답을 받았을 때 다시 다음 응답 기다림. 이벤트가 잦다면 순가적으로 과부하
        - Streaming: 이벤트 발생했을 때 응답을 내려주는데 응답을 완료 안하고 계속 연결 유지
        - AJAX: 비동기 Javascript 및 XMS의 축약된 양식, XMLHttpRequest 객체를 사용해 전체 웹페이지를 다시 로드 하지 않고 Javascript 실행, 웹 페이지 일부만 송수신, 서버가 요청없는 클라이언트에게 먼저 통신 불가.
    - WebSocket 은 연결을 유지해 양방향 통신이 가능하게 함.
    - WebSocket HTTP 프록시 지원 위해 HTTP 포트 80, 443 에서 동작
- Socket.io/WebSocket 차이
    - Socket.io 는 이벤트 이름을 지정하여 메시지를 보내거나 내보낼 수 있게 함.
    - Socket.io의 경우 서버의 메시지는 모든 클라이언트에 도달하지만 웹 소켓의 경우에는 모든 클라이언트에 메시지를 보내기 위해 모든 연결과 루프를 유지해야한다.
    - WebSocket 사용을 단순화하고, 브라우저나 서버에서 지원을 용이하게 함.
    - Socket.io WebSocket, FlashSocket, AJAX Long Polling, Ajax Multi part Streaming, IFrame, JSONP Polling 을 하나로 추상화함.
    
