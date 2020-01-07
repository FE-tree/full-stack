const mongoose = require("mongoose");
const Promise = require("bluebird");
mongoose.connect("mongodb://127.0.0.1:27017/file", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const mongo = mongoose.connection;
mongo.once("error", function (error) {
    if(error) console.log("数据库连接失败：" + error);
});
mongo.once("open", function () {
    console.log("------数据库连接成功！------");
});

//断开数据库连接
//mongo.disconnect();

const Schema = mongoose.Schema;
const fileSchema = new Schema({
    title: String,
    filename: String,
    type: String,
    remarks: String,
    path: { type: String, required: true }
}, { 
    collection: 'file_table',
    timestamps: { createdAt: 'created', updatedAt: 'updated' },
    versionKey: false
});

let db = {
    file: mongo.model("file", fileSchema)
};

// promise化类及其方法
for(var key in db){
    // console.log(key + " " + db[key]);
    Promise.promisifyAll(db[key]);
    Promise.promisifyAll(db[key].prototype);
}

module.exports = db;