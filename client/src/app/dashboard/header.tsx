import React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const Header = () => {
  return (
    <div className="mb-5 flex items-center justify-between border-b">
      <p className="p-4 font-semibold">Dashboard</p>
      <Avatar className="mx-5">
        <AvatarImage src="https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_18.png" />
        <AvatarFallback>User</AvatarFallback>
      </Avatar>
    </div>
  )
}

export default Header
