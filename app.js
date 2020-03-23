const express = require('express');
const fs = require('fs');
const qiniu = require('qiniu');

const app = express();

app.get('/uptoken', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/json;charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    var config = fs.readFileSync('./qiuin_key.json');
    config = JSON.parse(config);
    let { accessKey, secretKey } = config;
    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    var options = {
        scope: '163wangyimusic',
    };
    var putPolicy = new qiniu.rs.PutPolicy(options);
    var uploadToken = putPolicy.uploadToken(mac);
    res.write(`{
        "uptoken":"${uploadToken}"
    }`);
    res.end();
})

app.listen(3000);
console.log('服务器启动成功');