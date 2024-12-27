import React from 'react'

import { formatDate } from '@/lib/timeUtils'

export interface PunchInfoCardProps {
  time?: string | null
  title?: string
  fields: {
    name: string
    value: string | number
  }[]
}

const InfoCard = ({ title = '', time = '', fields = [] }: PunchInfoCardProps) => {
  return (
    <div className="w-full">
      <div className="my-2 rounded-md border px-2 pb-2">
        <h4 className="my-2 text-xl underline underline-offset-4">
          {title && <span className="font-semibold">{title}</span>}
          {time && <span className="text-nowrap text-sm text-gray-700">({formatDate(time, 'hh:mm a')})</span>}
        </h4>
        <div className="flex flex-col">
          {fields?.map((item, index) => (
            <p key={index} className="text-lg">
              <span className="font-semibold">{item.name}:</span>
              <span className="mx-2">{item.value || 'N/A'}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

export default InfoCard
