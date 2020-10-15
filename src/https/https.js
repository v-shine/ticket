// 封装 axios
import axios from 'axios';
import QS from 'qs';

import { Message } from 'element-ui'

axios.defaults.timeout = 10000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// 请求拦截器
axios.interceptors.request.use(
config => {
  // 是否有token
  let userInfo = sessionStorage.getItem('userInfo');
  if(userInfo){
    let {token} = JSON.parse(userInfo);
    if(token){
      config.headers['X-User-Token'] = token;
    }
  }
  return config;
},
error => {
  return Promise.error(error);
});

axios.interceptors.response.use(
  response => {
    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
    // 否则的话抛出错误
    if (response.status === 200) {
      return Promise.resolve(response.data);
    } else {
      return Promise.reject(response);
    }
  },
  error => {
    if (error) {
      Message.error(error.response.data.message);
      return Promise.reject(error);
    }else{
      return Promise.reject(error);
    }
    
});

 // * get方法，对应get请求
 // * @param {String} url [请求的url地址]
 // * @param {Object} params [请求时携带的参数]
export function get(url, params){
  return new Promise((resolve, reject) =>{
    axios.get(url, {
      params
    }).then(res => {
      resolve(res);
    }).catch(err =>{
      reject(err)
    })
  });
}

// * post方法，对应post请求
// * @param {String} url [请求的url地址]
// * @param {Object} params [请求时携带的参数]
export function post(url, params, headers) {
  return new Promise((resolve, reject) => {
    axios.post(url, QS.stringify(params), headers)
      .then(res => {
        resolve(res);
      })
      .catch(err =>{
        reject(err)
      })
  });
}

