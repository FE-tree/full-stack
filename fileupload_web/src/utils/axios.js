import axios from "axios";

const service = axios.create({
    // baseURL: "/api/",
    baseURL: "http://localhost:4040/",
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
});

// 请求拦截器
service.interceptors.request.use(config => {
    return config
}, function(error) {
    return Promise.reject(error)
})
// 响应拦截器
service.interceptors.response.use(response => {
    return response
    // console.log(JSON.stringify(response))
    // const res = response.data;
    // if (res.code !== 200) {
    //     console.log(res);
    //     return Promise.reject("error");
    // } else {
    //     return response.data;
    // }
}, function(error) {
    return Promise.reject(error)
})

// 封装axios的get请求
export function fetch(url, params) {
    return new Promise((resolve, reject) => {
        service.get(url, { params })
            .then(response => {
                resolve(response.data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

// 封装axios的post请求
export function fetch2(url, params) {
    return new Promise((resolve, reject) => {
        service.post(url, params)
            .then(response => {
                resolve(response.data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

export default {
    service,
    get(url, params) {
        return fetch(url, params)
    },
    post(url, params) {
        return fetch2(url, params)
    }
}