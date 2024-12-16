'use client'
import NextLink from 'next/link'
import { ThemeSwitch } from '@/components/theme-switch'
import { Logo } from '@/components/icons'
import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/react'
import { LogOut } from 'lucide-react'
import api from '@/services/api'
import { authUrl } from '@/lib/urls'
import toast from 'react-hot-toast'
import { useAccount } from '@/hooks/useAccount'
import { usePathname } from 'next/navigation'

export const Navbar = () => {
  const handleLogout = async () => {
    try {
      await api.post(authUrl.logout)
      window.location.href = '/auth/login'
    } catch (error) {
      console.error('error:', error)
      toast.error('Logout failed')
    }
  }

  const { name } = useAccount()
  const pathName = usePathname()

  if (pathName.includes('/auth/')) return null

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo />
            <p className="font-bold text-inherit">HRMS</p>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="sm:flex basis-1/5 sm:basis-full" justify="end">
        <NavbarItem className="gap-2">
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="flex gap-2">
          <Dropdown>
            <DropdownTrigger>
              <Avatar
                isBordered
                showFallback
                name={name || ''}
                src="https://i.pravatasr.cc/150?u=a042581f4e29026024d"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem onPress={handleLogout} key="logout" className="text-danger" color="danger">
                <div className="flex gap-2">
                  <LogOut className="transition-opacity hover:opacity-80 cursor-pointer" />
                  <span className="font-semibold">Logout</span>
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
    </NextUINavbar>
  )
}
