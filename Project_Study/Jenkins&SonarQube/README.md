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
    - 테스트 완료 시 해당 이미지 운영 서버에 배

- ngrok: Secure tunnels to localhost 방화벽 넘어서 외부에서 로컬에 접속 가능하게 하는 터널 프로그램 (로컬 테스트 용)
```shell script결
ngrok http 3000 -- 127.0.0.1:3000
```

- Jenkins 홈페이지 설정
Security Realm
Jenkins 'own user database 를 체크해주고 사용자의 가입허용을 체크
Authorization
Matrix-based security를 선택하여 유저와 그룹의 허가할 퍼미션을 선택합니다
CSRF Protection 설정 체크를 풀어줘야 합니다. 이렇게 해야 외부에서 Job에 대한 트리거링이 가능

Github Private Repository Setting: SSH Key 세팅 (Docker Jenkins Server에 접속해 ```ssh-keygen``` ```cat /.ssh/id_rsa.pub```)

소스 관리 탭에서 Github Credentials 등록

빌드 유발 - Github hook trigger for GITScm polling 선택.

- Github 설정
Github Private Repository에서 Deploy keys에 등록, Webhook에서 Add Webhook 후 ```http://JENKIN'S SERVER/github-webhook/```
url로 지정 해주고 Active. 

- Github 계정 토큰 설정
계정 Settings > Developer settings > Personal access tokens > Generate new token > repo, admin:repo_hook 체크 후 생성
토큰 복사 후 Jenkins 시스템 설정 Github 설정 탭에서 Manage hooks 체크 후 Credentials Add > Jenkins
Kind: Secret text, Secret: Personal access token, ID: Github ID

주기적으로 뭔가를 돌려주는 배치 시스템 - Jenkins

```shell script
docker pull jenkins/jenkins:lts
docker run -d -p 8080:8080 -v root/jenkins:/var/jenkins_home --name jenkins -u root jenkins (host 디렉토리:container 디렉토리 연결)
stop 상태에서는 docker start jenkins
docker exec -it jenkins /bin/bash
``` 

- SonarQube
정적 분석, 커버리지 측정
    - Complexity
    - Duplications
    - Coding Rules
    - Potential Bugs
    - Test Cases
    - Coverage

소스코드의 분석/빌드/테스트 결과를 수집해서 리포팅 해주는 물건 - SonarQube