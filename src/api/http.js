import axios from 'axios'

// axios 實例
const instance = axios.create({
    baseURL: process.env.VUE_APP_ROOT_API + "/api"
})

//request 攔截器
instance.interceptors.request.use((config) => {
    return config;
}, (error) => {
    return Promise.reject(error);
})

//response攔截器
instance.interceptors.response.use((config) => {
    return config;
}, (error) => {
    const { response } = error;
    if (response) {
        // 成功發出請求但有error產生
        console.log("request Success has error");
    } else {
        if (!window.navigator.onLine) {
            // 網路斷線
            console.log("disconnect");
        } else {
            // 可能是跨域或是程式問題
            console.log("other error");
        }
    }
    return Promise.reject(error);
})

export default function (method, url, data = null) {
    method = method.toLowerCase();
    switch (method) {
        case "post":
            return instance.post(url, data);
        case "get":
            return instance.get(url, { params: data });
        case "delete":
            return instance.delete(url, { params: data });
        case "put":
            return instance.put(url, data);
        default:
            console.error("unknow method:" + method);
            return false;
    }
}