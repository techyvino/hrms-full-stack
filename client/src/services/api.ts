'use client'
export interface ApiError {
  message: string
}

import axios from 'axios'
import { deleteCookie, getCookie } from 'cookies-next/client'

const baseURL = 'https://arvi-hrms.up.railway.app/api'

const api = axios.create({
  baseURL,
})

// Request interceptor to add token on header
api.interceptors.request.use(async (config) => {
  const token = getCookie('access_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// Response interceptor to check authorization errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      deleteCookie('access_token')
      window.location.href = '/auth/login'
    }

    return Promise.reject(error)
  }
)

export default api
