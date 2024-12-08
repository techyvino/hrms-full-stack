import type { AxiosRequestConfig } from 'axios'
import axios from 'axios'

export interface GETRequestOptions extends AxiosRequestConfig {
  params?: Record<string, string>
}
export interface ResponseError extends Error {
  response?: Response
}

async function callApi(url: string, options?: AxiosRequestConfig): Promise<unknown> {
  const BASE_URL = 'https://arvi-hrms.vercel.app/api'

  const fetchUrl = `${BASE_URL}${url}`
  try {
    const response = await axios(fetchUrl, {
      ...options,
    } as AxiosRequestConfig)
    console.log('response:', response)
    if (response) {
      return response
    }
    throw `HTTP error! status: ${response}`
  } catch (error) {
    console.error(error)
  }
}

async function get(url: string, options: GETRequestOptions): Promise<unknown> {
  const newUrl = url
  const token = '' // Get token from the session or auth service
  if (token) {
    options.headers = { ...options.headers, Authorization: `Bearer ${token}` }
  }

  return callApi(newUrl, { method: 'GET', ...options })
}

async function post(url: string, options: AxiosRequestConfig): Promise<unknown> {
  const token = '' // Get token from the session or auth service
  if (token) {
    options.headers = { ...options.headers, Authorization: `Bearer ${token}` }
  }
  return callApi(url, { method: 'post', ...options })
}

export { callApi, get, post }
