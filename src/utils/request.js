// import axios from 'axios';
//
// const service = axios.create({
//     // process.env.NODE_ENV === 'development' 来判断是否开发环境
//     baseURL: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
//     timeout: 5000
// })
//
// service.interceptors.request.use( config => {
//     return config;
// }, error => {
//     console.log(error);
//     return Promise.reject();
// })
//
// service.interceptors.response.use(response => {
//     if(response.status === 200){
//         return response.data;
//     }else{
//         Promise.reject();
//     }
// }, error => {
//     console.log(error);
//     return Promise.reject();
// })
//
// export default service;

import axios from 'axios'
import qs from 'qs'


axios.defaults.timeout = 5000;                        //响应时间
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';        //配置请求头
// axios.defaults.headers.post['Content-Type'] = 'multipart/form-data'

axios.defaults.baseURL = 'http://192.168.0.99:8081';   //配置接口地址
const  url = 'http://192.168.0.99:8081'; //基地址
//POST传参序列化(添加请求拦截器)
axios.interceptors.request.use((config) => {

    return config;
},(error) =>{
    console.log('错误的传参')
    return Promise.reject(error);
});

//返回状态判断(添加响应拦截器)
axios.interceptors.response.use((res) =>{
    //对响应数据做些事
 if (res.status === 200) {
            return Promise.resolve(res);


 } else {
            return Promise.reject(res);

        }
}, (error) => {


    return Promise.reject(error);
});

//返回一个Promise(发送post请求)
export function fetchPost(url, params) {
    return new Promise((resolve, reject) => {

        axios.post(url, params)
            .then(response => {
               // alert(response.data);
                resolve(response);

            }, err => {

                 alert('err')
                reject(err);

            })
            .catch((error) => {

                alert('error')
                alert(error)


            })
    })
}
////返回一个Promise(发送get请求)
export function fetchGet(url, param) {
    return new Promise((resolve, reject) => {
        axios.get(url, {params: param})
            .then(response => {
                resolve(response)
            }, err => {
                reject(err)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

// post 图片

export  function  fetImgPost(url,param) {
    return new Promise((resolve, reject) => {
        axios.post(url, param, {'headers':{'Content-Type': 'multipart/form-data'}})
            .then(response => {

                resolve(response)
            }, err => {
                reject(err)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

export default {
    fetchPost,
    fetchGet,
    fetImgPost,
    url,
}
