import Vue from 'vue'
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 挂载请求拦截器
axios.interceptors.request.use(config => {
  if (config.url !== 'login') {
    config.headers.Authorization = window.sessionStorage.getItem('token')
  }
  return config
})

Vue.prototype.$axios = axios
