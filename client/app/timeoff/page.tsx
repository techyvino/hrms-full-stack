'use client'
import { Button, Card, CardBody, CardFooter } from '@nextui-org/react'
import React from 'react'

import Title from '@/components/title'

const TimeOff = () => {
  const leaves = [
    {
      name: 'Sick Leave',
      days: 1,
      type: 'SL',
      icon: '🤒',
    },
    {
      name: 'Casual Leave',
      days: 2,
      type: 'CL',
      icon: '🎉',
    },
  ]

  // type leaveType = (typeof leaves)[number]['type']
  const handleRequestTimeOff = (leaveType: string) => {
    alert(`Requesting ${leaveType}`)
  }

  return (
    <main>
      <Title title="Time Off" />
      <div className="flex flex-col justify-center gap-4">
        {leaves?.map((leave) => (
          <Card key={leave.name} className="mx-2 mt-4 h-80 w-full max-w-sm">
            <CardBody className="mt-5 flex items-center justify-center">
              <div className="text-5xl">{leave?.icon}</div>
              <p className="mt-2 text-xl font-semibold">{leave?.name}</p>
              <p>Balance: {leave?.days}</p>
            </CardBody>
            <CardFooter>
              <Button fullWidth color="danger" onPress={() => handleRequestTimeOff(leave?.name)}>
                Request
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  )
}

export default TimeOff
