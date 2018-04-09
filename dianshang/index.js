const express = require('express');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const MongoStore = require('connect-mongo')(expressSession);
const DB = require('./modules/public');


//TODO：如果只有 post 传参 可以使用 body-parser 如果有 文件 上传，使用 multiparty
// const bodyParser = require('body-parser');
const multiparty = require('multiparty');
const http = require('http');
const util = require('util');

//引入 MD5 加密
const md5 = require('md5-node');

//初始化 express
const app = new express();

//设置 ejs 来进行 服务端渲染
app.set('view engine' , 'ejs');


// 指定静态文件资源
app.use(express.static('public'));
app.use('/uploads',express.static('uploads'));

//设置 解析 post 传参
// app.use(bodyParser.urlencoded({extended: false}));
// app.use(bodyParser.json());

//设置 cookie 的 注入
app.use(cookieParser());

//设置 session - connect-mongo
app.use(expressSession({
    secret: '12312' ,
    resave: false ,
    name: 'keyName' ,
    saveUninitialized: true ,
    cookit: {
        secure: true ,
        maxAge: 1000
    } ,
    rolling: true ,
    store: new MongoStore({
        url: 'mongodb://127.0.0.1:27017/itying' ,  // 存储的数据库地址
        touchAfter: 24 * 3600
    })
}));


//TODO: 是否登录判断
// app.use(function (req , res , next) {
//     if ( req.url == '/' || req.url == '/dologin' ) {
//         next();
//     } else {
//         if ( req.session.userInfo && req.session.userInfo.username != '' ) {
//             app.locals['userinfo'] = req.session.userInfo;
//             next();
//         } else {
//             res.redirect('/');
//         }
//     }
// });

//TODO：页面 - 路由
// 首页
app.get('/' , function (req , res) {
    res.render('index');
});

// 登录页面
app.get('/upload' , function (req , res) {
    res.render('upload');
});
//商品列表页面
app.get('/list' , function (req , res) {
    res.send('list');
});

//TODO： 接口 - 路由

// 登录接口
app.post('/dologin' , function (req , res) {
    console.log(req.body);
    req.body.username = req.body.username;
    req.body.userpassword = md5(req.body.userpassword);
    console.log(req.body);
    DB.find('itying' , 'admin' , req.body , function (data) {
        if ( data.length > 0 ) {
            res.redirect('list');
            //登录成功以后，将信息存放到 session 中
            req.session.userInfo = data[0];
        } else {
            res.send('<script>alert("验证不通过");location.href="/"</script>');
        }
    });
});

// 商品添加
app.get('/productAdd' , function (req , res) {
    res.send('productAdd');
});

// 商品修改
app.get('/productEdit' , function (req , res) {
    res.send('productEdit');
});

// 商品删除
app.get('/productDel' , function (req , res) {
    res.send('productDel');
});

//图片上传
app.post('/upload' , function (req , res) {
    const form = new multiparty.Form();
    form.uploadDir = 'uploads'; // 目录必须存在
    form.parse(req , function (err , fields , files) {
        console.log(fields); //获取表单数据
        console.log(files);  //上传图片成功返回的地址信息
        // res.end(util.inspect({fields: fields , files: files}));
        res.render('index',{files});
    });

});


// 错误页面
app.get('*' , function (req , res) {
    res.send('错误页面');
});

const server = app.listen(3000 , function () {
    let port = server.address().port;
    console.log("应用实例，访问地址为 http://%s:%s" , 'localhost' , port);
});