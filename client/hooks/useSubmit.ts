import type { AxiosError, AxiosRequestConfig } from 'axios'
import { useCallback, useState } from 'react'

import type { ApiError } from '@/services/api'
import api from '@/services/api'

type UseSubmitOptions<T> = {
  initialData?: T
  onSuccess?: (data: T) => void
  onError?: (error: ApiError | undefined) => void
  onSubmitStart?: () => void
  onSubmitEnd?: () => void
}

type UseSubmitResult<T> = {
  data?: T
  error: AxiosError<ApiError> | null
  isLoading: boolean
  isError: boolean
  submit: (reqConfig: AxiosRequestConfig) => Promise<void>
}

export function useSubmit<T = unknown>(options: UseSubmitOptions<T> = {}): UseSubmitResult<T> {
  const { initialData, onSuccess, onError, onSubmitStart, onSubmitEnd } = options

  const [data, setData] = useState<T | undefined>(initialData)
  const [error, setError] = useState<AxiosError<ApiError> | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const submitFn = useCallback(
    async (reqConfig: AxiosRequestConfig) => {
      setIsLoading(true)
      setError(null)

      // Optional callback before submission
      onSubmitStart?.()

      try {
        const response = await api({
          method: 'POST',
          ...reqConfig,
        })
        setData(response.data) // Assuming response contains the submitted data

        // Optional success callback
        onSuccess?.(response.data)
      } catch (err) {
        const axiosError = err as AxiosError<ApiError>

        // Optional error callback
        onError?.(axiosError?.response?.data)
        setError(axiosError)
      } finally {
        setIsLoading(false)
        // Optional callback after submission ends
        onSubmitEnd?.()
      }
    },
    [onSubmitStart, onSubmitEnd, onSuccess, onError]
  )

  const submit = useCallback(
    async (config: AxiosRequestConfig) => {
      submitFn(config)
    },
    [submitFn]
  )

  return {
    data,
    error,
    isLoading,
    isError: error !== null,
    submit,
  }
}
