import axios from 'axios';

const _axios = axios.create({
  baseURL: 'http://127.0.0.1:7001',
  timeout: 5000,
});

_axios.interceptors.request.use(
  config => {
    const uid = window.localStorage.getItem('uid'); //绑定用户id
    const token = window.localStorage.getItem('token');
    config.headers.Authorization = `Bearer ${token}`;
    config.params = { ...config.params, uid }; //把uid绑定在接口上 eg: login?uid=1
    return config;
  },
  error => Promise.reject(error)
);

_axios.interceptors.response.use(
  config => {
    return config;
  },
  error => {
    // loadingInstance.close();
    // if (error && error.response.status) {
    //   switch (error.response.status) {
    //     case 401:
    //       error.message = '未获得授权';
    //       break;
    //     case 403:
    //       error.message = '禁止访问';
    //       break;
    //     case 404:
    //       error.message = '未找到请求资源';
    //       break;
    //     case 500:
    //       error.message = '服务器内部错误';
    //       break;
    //     default:
    //       break;
    //   }
    // }
    return error.response;
  }
);

export default _axios;
