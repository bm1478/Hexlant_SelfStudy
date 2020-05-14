# Jenkins, SonarQube 를 활용한 CI/CD

- Jenkins
CI 툴: 다수의 개발자들이 하나읲 프로그램을 개발할 때 버전 충돌을 방지하기 위해 각자 작업한 내용을 공유영역에 있는 저장소에 빈번히 업로드함으로써 지속적인 통합 가능하게 함.
CI 툴이 등장 전에는 일정시간마다 빌드 실행 방식이 일반적
젠킨스는 서브버전, git 같은 버전관리시스템과 연동해 커밋 감지 시 자동적으로 자동화 테스트가 포함된 빌드 작동되도록 설정.

- 이점
    - 프로젝트 표준 컴파일 환경애서의 컴퍼일 오류 검출
    - 자동화 테스트 수행
    - 정적 코드 분석에 의한 코딩 규약 준수여부 체크
    - 프로파일링 툴을 이용한 소스 변경에 따른 성능 변화 감시
    - 결합 테스트 환경에 대한 배포작업
    - 등 500여가지 넘는 플러그인

- Docker + Jenkins Workflow
    - 소스 Github 커밋
    - Jenkins로 Docker 이미지 빌드
    - 자동 빌드된 Docker 이미지로 테스트 서버에서 테스트 수행
    - 테스트 완료 시 해당 이미지 운영 서버에 배포.

- ngrok: Secure tunnels to localhost 방화벽 넘어서 외부에서 로컬에 접속 가능하게 하는 터널 프로그램 (로컬 테스트 용)
```shell script결
ngrok http 3000 -- 127.0.0.1:3000
```
```shell script
docker pull jenkins/jenkins:lts
docker run -d -p 8080:8080 -v /root/jenkins:/var/jenkins_home --name jenkins -u root jenkins/jenkins:lts (host 디렉토리:container 디렉토리 연결)
docker run -d -p 8080:8080 -v /home/deploy/jenkins:/var/jenkins_home --name jenkins -u root jenkins/jenkins:lts (host 디렉토리:container 디렉토리 연결)
stop 상태에서는 docker start jenkins
docker exec -it jenkins /bin/bash
``` 

- Jenkins 홈페이지 설정
Security Realm
Jenkins 'own user database 를 체크해주고 사용자의 가입허용을 체크
Authorization
Matrix-based security를 선택하여 유저와 그룹의 허가할 퍼미션을 선택합니다
CSRF Protection 설정 체크를 풀어줘야 합니다. 이렇게 해야 외부에서 Job에 대한 트리거링이 가능

Github plugin: Jenkins와 Github 통합
Global Slack Notifier Plugin: Slack 연동(Job 알림 설정)
Publish Over SSH: ssh로 빌드 파일 보내기
Embeddable Build Status Plugin: Github 레포지토리에 빌드 상태바 생성
Managed Scripts: Node.js 기반의 서버를 배포하기 위한 스크립트

Github Private Repository Setting: SSH Key 세팅 (Docker Jenkins Server에 접속해 ```ssh-keygen``` ```cat /.ssh/id_rsa.pub```)

소스 관리 탭에서 Github Credentials 등록
이 때 저장소 주소는 ssh 주소로 해주기.

빌드 유발 - Github hook trigger for GITScm polling 선택.

- Github 설정
Github Private Repository에서 Deploy keys에 등록, Webhook에서 Add Webhook 후 ```http://JENKIN'S SERVER/github-webhook/```
url로 지정 해주고 Active. 

GitHub plugin은 jenkins가 GitHub의 hook을 받을 수 있도록 수동 모드와 자동모드를 제공한다. 수동 모드는 사용자가 Git Repository setting로 가서 Hooks & services을 직접 등록해 사용하는 것이고, 자동 모드는 사용자의 GitHub OAuth 토큰을 이용해 Jenkins가 자동으로 Hooks & services를 등록한다. 우리는 자동 모드를 사용하겠다.

- Github 계정 토큰 설정
계정 Settings > Developer settings > Personal access tokens > Generate new token > repo, admin:repo_hook 체크 후 생성
토큰 복사 후 Jenkins 시스템 설정 Github 설정 탭에서 Manage hooks 체크 후 Credentials Add > Jenkins
Kind: Secret text, Secret: Personal access token, ID: Github ID

GitHub plugin은 jenkins가 GitHub의 hook을 받을 수 있도록 수동 모드와 자동모드를 제공. 
- 수동 모드: 사용자가 Git Repository setting로 가서 Hooks & services을 직접 등록해 사용하는 것이고
- 자동 모드: 사용자의 GitHub OAuth 토큰을 이용해 Jenkins가 자동으로 Hooks & services를 등록한다.

주기적으로 뭔가를 돌려주는 배치 시스템 - Jenkins

- Jenkins로 Node.js기반 프로젝트 배포 설정하기

배포를 위해 scp를 사용하여 Jenkins에 있는 프로젝트 코드를 NAVER Cloud 서버에 복사해야 한다.
1. NAVER Cloud 서버에도 ssh 키를 생성한다. ```ssh-keygen -t rsa```
2. Jenkins(Docker)에서는 NAVER Cloud 서버를 호스트로, NAVER Cloud 서버에서는 Jenkins 서버(Docker)의 공개 키를 허가받은 키로 등록
3. Jenkins 서버에서 NAVER Cloud 서버를 known_hosts로 등록 ```ssh-keyscan -H (NAVER CLOUD 서버)ip >> ~/.ssh/known_hosts```
4. Jenkins에서 생성한 키 중에 공개 키(id_rsa.pub)를 NAVER Cloud 서버에서 생성한 authorized_keys에 입력한다. ```vi ~/.ssh/authorized_keys```

- 전체적인 자동배포 시나리오
1. 누군가 hook branch에 변경사항을 푸시한다.
2. GitHub가 푸시 이벤트를 감지하고 Jenkins에 WebHook을 보낸다.
3. Jenkins의 Job이 신호를 받는다.
4. Job은 해당 branch의 최신 소스를 받고 빌드해 war를 만든다.
5. 이어서 SSH 통신으로 remote 서버에 war 파일을 전송한다.
6. 전송 후 명령 스크립트로 기존 war 파일을 방금 빌드한 war로 교체한다.
7. 서버 환경에 따라 적절히 마무리 작업을 하면 끝!

```shell script
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub  
chmod 644 ~/.ssh/authorized_keys
chmod 644 ~/.ssh/known_hosts
```
Jenkins 관리 > 시스템 설정 > Publish over SSH
1. Path to key : Jenkins 서버의 id_rsa 파일이 있는 위치.
2. Hostname : remote 서버의 IP
3. 배포할 서버의 기본 workspace라 보면 된다.(파일 전송 시 디렉토리를 정해주지 않는다면 여기로 감.)
Remote 서버의 authorized_keys에 Jenkins 서버의 id_rsa.pub의 공개키를 넣어두면 된다.
.ssh파일의 권한은 700 authorized_keys는 600 이 아니면 ssh 인증이 동작하지 않는다.

- Slack notification
Slack Plugin 설치 후 Slack App 에서 Jenkins 설치 후 토큰 Jenkins > 시스템 설정 > Slack 에서 토큰 등록

==========================================================================================================

- SonarQube
정적 분석, 커버리지 측정
    - Complexity
    - Duplications
    - Coding Rules
    - Potential Bugs
    - Test Cases
    - Coverage

소스코드의 분석/빌드/테스트 결과를 수집해서 리포팅 해주는 물건 - SonarQube