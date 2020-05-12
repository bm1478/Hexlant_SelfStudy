# Telegram Bot Manual
Telegram 특징 - 프라이버시, End to End (E2E) 암호화

구축 환경: Node.js (Node version: 10.19.0, NPM version: 6.13.4)
라이브러리: node-telegram-bot-api (version: Latest)

`사용 방법`

1. BotFather 에게 채팅 후 새로운 Bot 생성 요청
```
/newbot
```
2. Bot 이름 입력, 반드시 bot 또는 Bot 으로 끝나야 함. ex) simple_telegram_bot_test

3. "Done! Congratulations on your new bot." 이라는 메시지 도착하면 성공

4. 제공된 Token 복사.

`API 콜`
```
https://api.telegram.org/bot{token}/getMe
```
또는 라이브러리 사용**
예제 코드
```javascript
const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = 'YOUR_TELEGRAM_BOT_TOKEN';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Received your message');
});
```

`현재 Bot Setting 코드화 가능부분`
WhiteList 제작: 봇을 시작하거나 메시지를 보낼 때, 올바른 반응을 하는 User Id 나 Chat Id를 지정할 수 있음.
스케줄러 끝나면 텔레그램 알림.
Bot을 그룹에 초대한 경우 (처음이던, 나중이던), Bot 과 대화를 시작한 경우 채팅방 정보 업데이트.

`코드화 불가능 부분`
그룹 검색 활성화, 비활성화 (Bot Father Allow Group)
-> Enable: 봇은 그룹에 추가될 수 있다.
-> Disable: 봇은 그룹에 추가될 수 없다.

Privacy Mode (내 봇과 1:1 대화가 아닌 다른 사람의 1:1 대화 또는 그룹 대화 기록 X) 활성화 비활성화 (Bot Father Group Privacy)
-> Enable: 봇은 '/' 기호로 시작하거나 사용자 이름으로 봇을 언급하는 메시지만 받는다.
-> Disable: 봇은 사람들이 그룹에 보내는 모든 메시지를 받을 것이다.

텔레그램 상 Command 등록 (Bot Father 이용)
-> /setcommands