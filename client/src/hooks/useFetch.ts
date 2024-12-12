import type { AxiosRequestConfig } from 'axios'
import axios, { AxiosError } from 'axios'
import { useCallback, useEffect, useRef, useState } from 'react'

import api from '@/services/api'

export interface UseFetchOptions<T> {
  initialData?: T
  onSuccess?: (data: T) => void
  onError?: (error: AxiosError) => void
}

export interface UseFetchResult<T> {
  data: T | undefined
  error: AxiosError | null
  isLoading: boolean
  isError: boolean
  fetcher: (reqOption: AxiosRequestConfig | string) => Promise<void>
}

export function useFetch<T = unknown>(options: UseFetchOptions<T> = {}): UseFetchResult<T> {
  const { initialData, onSuccess, onError } = options

  const [axiosConfig, setAxiosConfig] = useState<AxiosRequestConfig>()

  const [data, setData] = useState<T | undefined>(initialData)
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
      const response = await api.request<T>({
        ...axiosConfig,
        signal: abortController.signal,
      })

      // Only update state if the component is still mounted
      const responseData = response.data
      setData(responseData)
      onSuccess?.(responseData)
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
      await setAxiosConfig({ url: reqConfig, method: 'GET' })
    } else if (reqConfig?.url) await setAxiosConfig(reqConfig)
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
