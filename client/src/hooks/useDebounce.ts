import { useEffect, useState } from 'react'

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Create a timeout to update the debounced value
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Clean up the timeout if the value changes or the component unmounts
    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}
