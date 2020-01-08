const router = require('koa-router')({
    prefix: '/file',
});

const db = require('../db/index')

const multer = require('koa-multer');
const fs = require('fs');
const path = require("path");

let localPath = '../public/uploads/',
    relativePath = `${getDay()}/`,
    realPath = localPath + relativePath
setPath(localPath)

function getDay() {
    let date = new Date()
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
}

function existFolder(fpath) {
    return new Promise(function(resolve, reject){
        let folderPath = path.join(__dirname, fpath)
        fs.access(folderPath, fs.constants.F_OK, (err) => {
            // console.log(`文件/文件夹 ${err ? '不存在' : '存在'}`);
            if(err) {
                fs.mkdir(folderPath, (error) => {
                    if(error){
                        // console.log('创建目录失败', error);
                        reject(error)
                        return false;
                    }
                    resolve('创建目录成功')
                    // console.log('创建目录成功');
                })
            } else {
                resolve(folderPath + ' -- 文件夹存在')
            }
        });
    })
}

function setPath(local) {
    let uploadFolder = `${local}`
    let dayFolder = `${local}${relativePath}`
    existFolder(uploadFolder).then(res => {
        console.log(res)
        existFolder(dayFolder)
    }).catch(err => {
        console.log('创建目录失败', err)
    })
}

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // cb(null, `${realPath.replace('../', '')}`)
        cb(null, path.join(__dirname, realPath))
    },
    filename: function(req, file, cb) {
        var fileFormat = (file.originalname).split(".")
        cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1])
    }
})
var upload = multer({ storage: storage })

router.post('/upload', upload.single('file'), async (ctx, next) => {
    // console.log(ctx, ctx.request.req, ctx.request.req.file)
    const file = ctx.request.req.file;
    console.log(file)
    // const reader = fs.createReadStream(file.path);
    // let filePath = path.join(__dirname, realPath) + `${file.filename}`;
    // console.log(filePath)
    // const upStream = fs.createWriteStream(filePath);
    // reader.pipe(upStream);

    const info = ctx.request.req.body; // formData 附带信息
    console.log(info)
    // 添加文件信息
    await db.file.create({
        title: info.title,
        filename: file.originalname,
        type: info.type,
        path: `${realPath}${file.filename}`
    }).then(res => {
        ctx.body = {
            code: 200,
            description: '成功',
            results: res
        }
    }).catch(err => {
        ctx.body = err
    });
});

// 添加文件信息（test interface）
router.get('/add', async (ctx, next) => {
    await db.file.create({title:'title',filename:"filename",type:"pdf",path:"public/uploads/filename"}).then(res => {
        ctx.body = res
    }).catch(err => {
        ctx.body = err
    });
})

// 查询文件列表（目前全部）
router.get('/find', async (ctx, next) => {
    // console.log(ctx.request.query)
    await db.file.find({})
        .sort({ updated: -1 })
        // .skip(page * 5)
        // .limit(5)
        .then(res => {
            ctx.body = {
                code: 200,
                description: '成功',
                results: res
            }
        })
        .catch(err => {
            ctx.body = err
        });
})

// 添加文件及文件信息
router.get('/delete', async (ctx, next) => {
    // console.log(ctx.request.query)
    let { _id, _path } = ctx.request.query
    // 删除数据库数据
    await db.file.deleteOne({ _id }).then(res => {
        // 删除服务器文件
        fs.unlink(path.join(__dirname, _path), (error) => {
            if(error) {
                console.log('文件删除报错：', error);
                return false;
            }
            console.log('删除文件成功');
        })
        ctx.body = {
            code: 200,
            description: '成功',
            results: res
        }
    }).catch(err => {
        ctx.body = {
            code: 400,
            description: err
        }
    });
})

module.exports = router