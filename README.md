# node-talknote-client

Node.js用のTalknote APIクライアントライブラリです。

## 必要条件

- Node.js v18.0.0以上

## インストール

```bash
npm install node-talknote-client
```

または

```bash
yarn add node-talknote-client
```

## 使い方

```javascript
const TalknoteClient = require('node-talknote-client');

// アクセストークンを使用してクライアントを初期化
const client = new TalknoteClient('YOUR_ACCESS_TOKEN', {
  // オプション設定
  logLevel: 'info' // 'error', 'warn', 'info', 'debug'
});

// DMを取得
async function getDMs() {
  const result = await client.dm();
  console.log(result);
}

// DMを送信
async function sendDM(userId, message) {
  const result = await client.dm_post(userId, message);
  console.log(result);
}

// グループを取得
async function getGroups() {
  const result = await client.group();
  console.log(result);
}

// グループにメッセージを投稿
async function postToGroup(groupId, message) {
  const result = await client.group_post(groupId, message);
  console.log(result);
}
```

## 特徴

- シンプルなAPI
- Promiseベース
- ログ機能組み込み
- Node.js v18のネイティブFetch APIを使用

## ライセンス

MIT

## 作者

occmee <occmee@gmail.com>
