import axios from 'axios'
import Cookies from 'js-cookie'
import qs from 'qs'

const httpRequest = axios.create({
  baseURL: import.meta.env.VITE_VUE_APP_SERVER_URL
})

const getToken = () => {
  return Cookies.get('jwt-token')
}

export const get = async (path, params = {}, options = {}) => {
  const jwtToken = getToken()
  if (jwtToken) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${jwtToken}`
    }
  }
  // Chuyển params thành query string
  const queryString = qs.stringify(params, { addQueryPrefix: true })
  const response = await httpRequest.get(`${path}${queryString}`, options)
  return response.data
}

export const post = async (path, data = {}, options = {}) => {
  const jwtToken = getToken()
  if (jwtToken) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${jwtToken}`
    }
  }
  const response = await httpRequest.post(path, data, options)
  return response.data
}

export default httpRequest
