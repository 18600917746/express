//TODO: mongodb 数据库封装

const MongoClient = require('mongodb').MongoClient;
const MongoUrl = 'mongodb://127.0.0.1:27017';

function __connectDb(callback) {
    MongoClient.connect(MongoUrl , function (err , client) {
        if ( err ) {
            console.log('数据库连接失败');
        } else {
            callback(client);
        }
    });
}

//TODO：查询 方法
/**
 *
 * @param {数据库名}urlName
 * @param {表名}fromName
 * @param {查询条件}json
 * @param {回调函数}callback
 */
exports.find = function (urlName , fromName , json , callback) {
    __connectDb(function (client) {
        let findData = client.db(urlName).collection(fromName).find(json);

        findData.toArray(function (error , docs) {
            if ( error ) {
                console.log(error);
            } else {
                callback(docs);
            }
            client.close();
        });

    });

};

//TODO：增加 方法
/**
 *
 * @param {数据库名}urlName
 * @param {表名}fromName
 * @param {插入数据}json
 * @param {回调函数}callback
 */
exports.insert = function (urlName , fromName , json , callback) {
    __connectDb(function (client) {
        let findData = client.db(urlName).collection(fromName).insertOne(json , function (error , data) {
            if ( error ) {
                console.log(error);
            } else {
                callback(data);
            }
            client.close();
        });
    });
};

//TODO：更新 方法
/**
 *
 * @param {数据库名}urlName
 * @param {表名}fromName
 * @param {条件}json1
 * @param {更新数据}json2
 * @param {回调函数}callback
 */
exports.update = function (urlName , fromName , json1,json2 , callback) {
    __connectDb(function (client) {
        let findData = client.db(urlName).collection(fromName).updateOne(json1,{$set:json2} , function (error , data) {
            if ( error ) {
                console.log(error);
            } else {
                callback(data);
            }
            client.close();
        });
    });
};

//TODO：删除 方法
/**
 *
 * @param {数据库名}urlName
 * @param {表名}fromName
 * @param {条件}json
 * @param {回调函数}callback
 */
exports.deleteOne = function (urlName , fromName , json , callback) {
    __connectDb(function (client) {
        let findData = client.db(urlName).collection(fromName).deleteOne(json , function (error , data) {
            if ( error ) {
                console.log(error);
            } else {
                callback(data);
            }
            client.close();
        });
    });
};