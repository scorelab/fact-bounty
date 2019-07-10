import axios from 'axios'
import { APIConstantsDev } from '../constants/ApiConstants'
import store from '../redux/store'
import { tokenRefresh } from '../redux/actions/authActions'

const API = axios.create({
  baseURL: APIConstantsDev.API_URL,
  timeout: 20000,
  headers: { 'Access-Control-Allow-Origin': '*' }
})

/**
 * API request interceptor
 */
API.interceptors.request.use(
  request => {
    request.headers.Authorization = localStorage.access_token
    return request
  },
  error => {
    return Promise.reject(error)
  }
)

/**
 * API response interceptor
 */
let fetchingAccessToken = false
let subscribers = []

const onAccessTokenFetched = access_token => {
  subscribers = subscribers.filter(callback => callback(access_token))
}

const addSubscriber = callback => {
  subscribers.push(callback)
}

API.interceptors.response.use(
  response => response,
  // handling errors
  error => {
    const { config: originalRequest, response } = error
    const status = response ? response.status : 500

    console.log(status)
    switch (status) {
      //handing 401 erros
      case 401: {
        if (!fetchingAccessToken) {
          fetchingAccessToken = true
          store
            .dispatch(tokenRefresh(localStorage.refresh_token))
            .then(access_token => {
              fetchingAccessToken = false
              onAccessTokenFetched(access_token)
            })
        }
        const retryOriginalRequest = new Promise(resolve => {
          addSubscriber(access_token => {
            originalRequest.headers.Authorization = access_token
            resolve(axios(originalRequest))
          })
        })
        return retryOriginalRequest
      }
      default: {
        return Promise.reject(error)
      }
    }
  }
)

export default {
  API
}
