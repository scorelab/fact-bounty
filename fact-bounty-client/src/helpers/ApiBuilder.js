import { create } from 'axios'
import { APIConstantsDev } from '../constants/ApiConstants'

const API = create({
  baseURL: APIConstantsDev.API_URL,
  timeout: 20000,
  headers: { 'Access-Control-Allow-Origin': '*' }
})

API.interceptors.request.use(
  request => {
    request.headers.Authorization = localStorage.jwtToken
    return request
  },
  error => {
    return Promise.reject(error)
  }
)

export default {
  API
}
