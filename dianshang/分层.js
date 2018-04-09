const express = require('express');
const app = new express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


//控制层
app.use('/' , require('control'));

//数据返回 + 数据库操作 层
app.use('/' , require('data'));
//逻辑层
app.use('/' , require('loginc'));

app.listen(3000 , function () {

});