# SonarQube 를 활용한 CI/CD

- SonarQube
정적 분석, 커버리지 측정
    - Complexity
    - Duplications
    - Coding Rules
    - Potential Bugs
    - Test Cases
    - Coverage

소스코드의 분석/빌드/테스트 결과를 수집해서 리포팅 해주는 물건 - SonarQube

Github 연동 가능하고 적절한 구성 시 코드 수정하는 동시에 자동 분석, 리포팅 가능.

```shell script
docker pull sonarqube
docker run -d --name sonarqube -p 9000:9000 sonarqube
```
- Docker Host Requirement
```shell script
sysctl -w vm.max_map_count=262144
sysctl -w fs.file-max=65536
ulimit -n 65536
ulimit -u 4096
```

- Jenkins 홈페이지 설정
    - Jenkins > 플러그인 관리 > Sonarqube Scanner for jenkins Plugin 설치
    - Jenkins > 시스템 설정 > SonarQube servers
    - ```
          sonar.login = 토큰
          sonar.projectKey = 프로젝트키
          sonar.projectName= 프로젝트명
          sonar.host.url = http://소나큐브 서버 주소
          sonar.report.export.path = sonar-report.json
          sonar.projectVersion=1.0
          sonar.sourceEncoding=UTF-8
          ``` 
        - 이런식으로 Jenkins 프로젝트 Build > Execute Sonarqube Scanner
        - Nodejs 플러그인 설치 후 v.12.15.0 자동 설치.
- SonarQube 설정
    - 초기 아이디 비밀번호: admin/admin
    - 로그인 토큰 설정: Administration > Security > Users > Create User > Tokens > 토큰 이름 기입 > Generate
        - ```property "sonar.login", "login-token"```
    - 프로젝트 설정: Administaration > Projects > Project Management > Create Project > Name, Key 임의로 가입 > Create 버튼
        - ```property "sonqr.projectKey", "sonar:PUBGLog" (Key)```
        - ```property "sonqr.projectName", "PUBGLOG (Name)```

