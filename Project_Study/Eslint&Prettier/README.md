# Eslint & Prettier 설정

1. 기본 .eslintrc.js & .prettierrc 파일 
.eslintrc.js
```javascript
module.exports = {
  "env": {
    "browser": true,
    "es6": true
  },
  "extends": [
    "airbnb-base"
  ],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "rules": {
  }
};
```
.prettierrc
```
{
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 120
}
```