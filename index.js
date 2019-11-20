const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const webPush = require('web-push');
const utils = require('./utils');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));  

app.use('/', express.static(__dirname));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials','true');
  next();
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './index.html'))
});

// 接受subscription，保存
app.post('/subscription', async (req, res) => {
  try {
    await utils.saveRecord(req.body);
    res.send({
      code: 200,
      message: '保存成功'
    });
    // res.end();
  } catch(err) {
    console.log(err);
    res.sendStatus(401).send({
      code: 401,
      message: '数据不对'
    });
  }
});

// push消息
app.post('/push', async (req, res) => {
  const { id, payload } = req.body;
  let list = id ? await utils.find({id}) : await utils.findAll();
  for (let i = 0; i < list.length; i++) {
    let subscription = list[i].subscription;
    pushMessage(subscription, JSON.stringify(payload));
  }
  res.send({
    code: 200,
    message: '成功'
  });
})
const vapidKeys = {
  publicKey: 'BAiHgmL2d2i1oomi3R4M6ETs9UgUQgDfQIOEaVPbALXxU7y_OFgC_k6C-wvMAOtbdVRVB7bCOY7dBhjNdN3sX_0',
  privateKey: 'RfwsWarHCqWrKa0GvHPITGAWPRzkIFjSTFFiuAav8Aw',
};

webPush.setGCMAPIKey('AAAA-TNpNUg:APA91bGrkgKK8ZMBteemzGIv9qw8cbXZCyVHZ3xDSS4jkVNt3tHuS7TFarExWt8FWe-kwkFaKWNICFjIScbkAfQoglYLWMJZgiPIdsyyZhXxtq4kvrAS4VQYBmv_3r_B8DvBFAOEjsMm');

webPush.setVapidDetails(
  'mailto:xiaocheng.freedom@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey,
);

function pushMessage(subscription, payload) {
  webPush.sendNotification(subscription, payload)
    .then(data => console.log('push service的数据:', JSON.stringify(data)))
    .catch(err => {
      console.log('发送数据失败', err);
    })
}

app.listen(3001, () => console.log('listening on port 3001'));
