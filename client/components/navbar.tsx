'use client'
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@nextui-org/react'
import { LogOut } from 'lucide-react'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import toast from 'react-hot-toast'

import PullToPageRefresh from '@/app/pull-to-refresh'
import { Logo } from '@/components/icons'
import { ThemeSwitch } from '@/components/theme-switch'
import { useAccount } from '@/hooks/useAccount'
import { authUrl } from '@/lib/urls'
import api from '@/services/api'

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
    <>
      <PullToPageRefresh />
      <NextUINavbar shouldHideOnScroll className="mb-4 shadow-md" maxWidth="xl" position="sticky">
        <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
          <NavbarBrand as="li" className="max-w-fit gap-3">
            <NextLink className="flex items-center justify-start gap-1" href="/">
              <Logo />
              <p className="font-bold text-inherit">HRMS</p>
            </NextLink>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="basis-1/5 sm:flex sm:basis-full" justify="end">
          <NavbarItem className="gap-2">
            <ThemeSwitch />
          </NavbarItem>
          <NavbarItem className="flex gap-2">
            <Dropdown>
              <DropdownTrigger className="cursor-pointer">
                <Avatar
                  isBordered
                  showFallback
                  name={name || ''}
                  src="https://i.pravatasr.cc/150?u=a042581f4e29026024d"
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem key="logout" className="text-danger" color="danger" onPress={handleLogout}>
                  <div className="flex gap-2">
                    <LogOut className="cursor-pointer transition-opacity hover:opacity-80" />
                    <span className="font-semibold">Logout</span>
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        </NavbarContent>
      </NextUINavbar>
    </>
  )
}
