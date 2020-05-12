# Github Action

Github Action: Github 저장소 기반 소프트웨어 개발 Workflow 자동화 도구
Workflow: 저장소에서 발생하는 build, test, package, release, deploy 등 다양한 이벤트 기반

설정: .github/workflows 폴더를 만들어서 .yml 형식 파일 만든 뒤 정의

1. Workflow 핵심 구성
어떤 이벤트 발생 시 실행됨.
최소 1개 이상의 Job 정의
Job 안에는 여러 Step 정의
Step 안에는 단순한 커맨드 실행이나 Action 지정
Action 은 저장소에 직접 작성한 것 사용하거나 Github 마켓 플레이스에서 공유된 Action 사용

Example)
```yaml
name: Greet Everyone
# 이 Workflow는 저장소에 Push가 되면 실행 되도록 한다
on: [push]

jobs:
  # Job ID: 문자와 -(대시), _(언더바)로 구성된 Job 고유 식별자
  build:
    # Job 이름
    name: Greeting
    # 이 Job은 리눅스에서 실행된다
    runs-on: ubuntu-latest
    steps:
      # 이 Step은 Github이 제공하는 `hello-world-javascript-action` Action을 사용한다
      - name: Hello world
        uses: actions/hello-world-javascript-action@v1
        with:
          who-to-greet: 'Mona the Octocat'
        id: hello
      # 이 Step은 이전 Step에서 나온 출력을 사용한다
      - name: Echo the greeting's time
        run: echo 'The time was ${{ steps.hello.outputs.time }}.'
```

2. Git 브랜치나 태그로 이벤트 지정
```yaml
on:
  push:
    branches:
      - master
    tags:
      - v1
    # push 변경 사항 중 test 폴더 밑에 파일이 포함된 경우에 Workflow 실행
    paths:
      - 'test/*'
```

3. Workflow 실행할 Runner 지정
```runs-on``` 항목으로 지정

4. Action
Action은 도커 컨테이너와 Javascript 로 만든다.
도커 컨테이너 - 일관된 동작 보장, Github이 호스팅하는 리눅스 환경에서만 실행 가능
Javascript - 간단하며, 도커 컨테이너보다 더 빨리 실행된다.
```action.yaml``` 이나 ```aciton.yml```을 반드시 작성해야 한다.

Example)
```yaml
name: 'Hello World'
description: 'Greet someone and record the time'
branding:
  color: 'yellow'
  icon: 'code'
inputs:
  who-to-greet:
    description: 'Who to greet'
    required: true
    default: 'World'
outputs:
  time:
    description: 'The time we greeted you'
runs:
  using: 'node12'
  main: 'index.js'
```

```javascript
const core = require('@actions/core');
const github = require('@actions/github');

try {
  const nameToGreet = core.getInput('who-to-greet');
  console.log(`Hello ${nameToGreet}!`);

  const time = (new Date()).toTimeString();
  core.setOutput("time", time);

  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
```

```yaml
# 윗부분 생략
jobs:
  greeting_job:
    name: Greeting
    runs-on: ubuntu-latest
    steps:
      - name: Hello world
        uses: jonnung/github-action-practice@master
        with:
          who-to-greet: 'Jonnung'
        id: hello
      - name: Echo the greeting's time
        run: echo 'The time was ${{ steps.hello.outputs.time }}.'
```
Action 저장소가 다른 저장소의 Workflow 에서 사용되려면 반드시 Public 저장소로 설정되어야 한다.
Action 공유 목적 아니라면 ```action.yaml``` 어디다 두던 상관 없지만,
```.github/actions/action1``` 이런 구성이 좋다.

Action을 독립된 Git 저장소로 구성하기 위해서는 꼭 Public 저장소 타입!

5. Github Action 개념
* 워크플로우: 코드가 레포지토리에 올라갔을 때 빌드, 테스트 및 배포를 실행하기 위한 자동화된 프로세스 구성
* 이벤트: 워크플로우를 실행시키기 위한 전제 조건, ex) push or pull request
* 러너: 워크플로우를 실행시키기 위한 운영체제 환경, 깃헙에 제공하는 러너 또는 직접 만들 수 있음.
* 액션: 워크플로우안에 정의된 개별 작업을 의미, 이를 통해 빌드, 테스트 및 배포 뿐 아니라 다양한 작업을 실행시킴.
* 잡: 러너와 액션의 논리적인 묶음, 워크 플로우 안에서 여러 개의 잡을 정의하고 동시 실행 또는 연속 실행 가능

6. 배포 시나리오
- 시나리오 1: 빌드/테스트 - 개발 환경 배포 / 테스트 환경 배포 / 라이브 환경 배포 (의존성 가짐)
- 시나리오 2: 빌드/테스트 - 개발 환경 배포, 테스트 환경 배포, 라이브 환경 배포 동 (의존성 갖지 않음)

