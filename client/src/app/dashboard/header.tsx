import { Button } from '@nextui-org/react'
import { LogOut } from 'lucide-react'
import React from 'react'
import toast from 'react-hot-toast'

import { authUrl } from '@/lib/urls'
import api from '@/services/api'

const Header = () => {
  const handleLogout = async () => {
    try {
      await api.post(authUrl.logout)
      window.location.href = '/auth/login'
    } catch (error) {
      console.error('error:', error)
      toast.error('Logout failed')
    }
  }

  return (
    <div className="mb-5 flex items-center justify-between border-b">
      <p className="p-4 font-semibold">Dashboard</p>

      {/* <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className="mx-5">
            <AvatarImage src="https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_18.png" />
            <AvatarFallback>User</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mx-5 border bg-slate-50">
          <DropdownMenuItem>
          </DropdownMenuItem>
          </DropdownMenuContent>
          </DropdownMenu> */}
      <Button className="flex items-center gap-3" variant={'light'} onPress={handleLogout}>
        <LogOut />
        <p>Logout</p>
      </Button>
    </div>
  )
}

export default Header
