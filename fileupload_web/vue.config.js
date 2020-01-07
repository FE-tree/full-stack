const path = require('path')
function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    devServer: {
        port: 8282,
        open: true,
        proxy: {
            "/api": {
                target: "http://localhost:4040",
                changeOrigin: true,
                pathRewrite: {
                    "^/api": "/"
                }
            }
        }
    },
    configureWebpack: {
        resolve: {
            alias: {
                '@': resolve('src'),
                // '@views': resolve('src/views'),
                // '@c': resolve('src/components'),
                // '@api': resolve('src/api'),
                // '@utils': resolve('src/utils'), 
                // '@assets': resolve('src/assets'),
            }
        }
    },
}