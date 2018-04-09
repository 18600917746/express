const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const MondoStore = require('connect-mongo')(expressSession);
const app = new express();
//设置 服务端渲染的 模板语言 express 内置有ejs 所以不用显示的引入
app.set('view engine' , 'ejs');

//
/*
中间件  表示匹配任何的路由路径

应用级中间件 - 每次路由请求都会触发 - 可以做 登录权限判断
   1. app.use(function (req,res,next) {
        console.log(new Date());
        next();
    });
    也可以指定路由进行 应用级中间件匹配
   2. app.use('/status',function (req,res,next) {
        console.log(new Date());
        next();
    });
路由级中间件 - 对匹配的路由不进行 send()  -
    app.get('/list' , function (req , res) {
        console.log()
    });
    app.get('/list' , function (req , res) {
        res.send()
    });
错误处理中间件
    app.use('/status',function (req,res) {
       res.status(404).send('这是404表示么路由没有匹配到')
    });
内置中间件
    app.use(express.static('public'));
第三方中间件
    例： body-parser  获取 post 传参



中间件会执行以后挂起服务，若想继续向下执行，就要适用 next()
* */

//TODO： 修改默认 模板的位置
// app.set('view' , __dirname + '/static');
//TODO： 应用级中间件
app.use(function (req , res , next) {
    console.log(new Date());
    next();
});
//TODO:设置中间件

//使用 body-parser 获取 post 参数
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//TODO： 使用 cookie-parser 操作 cookie
// 设置 cookie   res.cookie('name','zhangsan',{maxAge:900000,httpOnly:false});  httpOnly= false 默认 false 不允许 客户端脚本访问
// 获取 cookie   req.cookies.name
app.use(cookieParser());

//TODO： 使用 express-session 操作 session
//TODO： 使用 MondoStore 将 session 存储在mongodb 数据库里面，实现 负载均衡
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
    store: new MondoStore({
        url: 'mongodb://127.0.0.1:27017' ,  // 存储的数据库地址
        touchAfter: 24 * 3600
    })
}));


// 指定静态文件资源
app.use(express.static('public'));
// 配置虚拟目录的静态服务  设置虚拟目录以后 可以使用  http://localhost:3000/images/1.jpg 也可以 http://localhost:3000/static/images/1.jpg
app.use('/static' , express.static('public'));


//TODO： 配置路由
app.get('/' , function (req , res) {
    res.send('hello world');
});
//TODO： 动态路由 /news/123
app.get('/news/:id' , function (req , res) {
    console.log(req.params);
    res.send();
});
//TODO： get 传值  /list?abc=123
app.get('/list' , function (req , res) {
    console.log(req.query);
    res.send();
});


//TODO： cookie
app.get('/from.html' , function (req , res) {

    res.cookie('name' , 'zhangsan' , {maxAge: 900000 , httpOnly: true});
    res.cookie('age' , 12 , {maxAge: 900000 , httpOnly: false});
    res.render('from' , {
        'list': [1 , 2 , 3 , 4 , 5 , 6]
    });
});

app.post('/submit' , function (req , res) {
    console.log(req.cookies.name);
    console.log(req.cookies.age);
    res.send(req.body);
});

app.get('/index.html' , function (req , res) {
    //TODO： 使用 ejs 时 模板必须放在 views 文件夹下,路径会指定添加上

    res.render('index' , {
        'list': [1 , 2 , 3 , 4 , 5 , 6]
    });

});
// post 传值
app.post('/from' , function (req , res) {
    console.log(req.body);
    res.send(req.body);
});
const server = app.listen(3000 , function () {
    const host = server.address().address;
    const port = server.address().port;
    console.log("应用实例，访问地址为 http://%s:%s" , 'localhost' , port);
});