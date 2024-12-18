import { Button } from '@nextui-org/react'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

interface TitleProps {
  title?: string
  children?: React.ReactNode
}
const Title = ({ title, children }: TitleProps) => {
  const { back } = useRouter()

  return (
    <div className="flex items-center">
      <Button className="rounded-full" size="sm" variant="light" onPress={back}>
        <ChevronLeft />
      </Button>
      <p className={'text-2xl font-semibold'}>{children || title}</p>
    </div>
  )
}

export default Title
