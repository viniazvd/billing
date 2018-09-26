import axios from 'axios'

// const token = localStorage.getItem('token')
// const baseURL = process.env.BASE_URL

const http = axios.create({
  // baseURL: 'https://staging.core.convenia.com.br/api/v1/',
  baseURL: 'http://41ed64f3.ngrok.io/api/v1/',
  headers: {
    'Content-Type': 'application/json'
    // 'Authorization': `Bearer ${token}`
  }
})

const install = Vue => {
  Object.defineProperties(Vue.prototype, {
    $http: {
      get () {
        return http
      }
    }
  })
}

export default { install }
