'use client'

import { usePullToRefresh } from 'use-pull-to-refresh'

const MAXIMUM_PULL_LENGTH = 240
const REFRESH_THRESHOLD = 180

export default function PullToPageRefresh() {
  const onRefresh = () => {
    return window.location.reload()
  }
  const { isRefreshing, pullPosition } = usePullToRefresh({
    // you can choose what behavior for `onRefresh`, could be calling an API to load more data, or refresh whole page.
    onRefresh: onRefresh,
    maximumPullLength: MAXIMUM_PULL_LENGTH,
    refreshThreshold: REFRESH_THRESHOLD,
  })

  return (
    <div
      style={{
        top: (isRefreshing ? REFRESH_THRESHOLD : pullPosition) / 2,
        opacity: isRefreshing || pullPosition > 0 ? 1 : 0,
      }}
      className="bg-white fixed inset-x-1/2 z-30 h-10 w-10 -translate-x-1/2 rounded-full p-2 shadow-lg"
    >
      <div
        className={`h-full w-full ${isRefreshing ? 'animate-spin' : ''}`}
        style={!isRefreshing ? { transform: `rotate(${pullPosition}deg)` } : {}}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className=""
          style={{ transform: `rotate(${pullPosition}deg)` }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
      </div>
    </div>
  )
}
