import type { AxiosRequestConfig } from 'axios'
import axios, { AxiosError } from 'axios'
import { useCallback, useEffect, useRef, useState } from 'react'

import api from '@/services/api'

export interface ApiResponse<T> {
  data: T
  status: number
  success: boolean
  message?: string
}

export interface UseFetchOptions<T> {
  initialData?: T
  onSuccess?: (data: ApiResponse<T>) => void
  onError?: (error: AxiosError) => void
}

export interface UseFetchResult<T> {
  data: T
  error: AxiosError | null
  isLoading: boolean
  isError: boolean
  fetcher: (reqOption: AxiosRequestConfig | string) => Promise<void>
}

export function useFetch<T>(options: UseFetchOptions<T> = {}): UseFetchResult<T> {
  const { initialData, onSuccess, onError } = options

  const [axiosConfig, setAxiosConfig] = useState<AxiosRequestConfig>()

  const [data, setResponse] = useState(initialData as T)
  const [error, setError] = useState<AxiosError | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // For managing the request (cancel logic)
  const abortControllerRef = useRef<AbortController | null>(null)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Create a new abort controller for this request
      const abortController = new AbortController()

      abortControllerRef.current = abortController

      // Pass the signal to axios
      const response = await api.request<ApiResponse<T>>({
        ...axiosConfig,
        signal: abortController.signal,
      })

      setResponse(response?.data?.data)
      onSuccess?.(response?.data)
    } catch (err) {
      if (err instanceof AxiosError && axios.isCancel(err)) {
        // Ignore request cancellation
        return
      }

      setError(err as AxiosError)
      onError?.(err as AxiosError)
    } finally {
      setIsLoading(false)
    }
  }, [axiosConfig, onSuccess, onError])

  const fetcher = useCallback(async (reqConfig: AxiosRequestConfig | string) => {
    if (typeof reqConfig === 'string') {
      setAxiosConfig({ url: reqConfig, method: 'GET' })
    } else if (reqConfig?.url) setAxiosConfig(reqConfig)
  }, [])

  useEffect(() => {
    if (axiosConfig) {
      fetchData()
    }
  }, [axiosConfig, fetchData])

  // Cleanup effect
  useEffect(() => {
    return () => {
      // Cancel any ongoing request on cleanup
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  return {
    data,
    error,
    isLoading,
    fetcher,
    isError: error !== null,
  }
}
