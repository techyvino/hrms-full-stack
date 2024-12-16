'use client'
import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

const AdminLayout = ({ children }: LayoutProps) => {
  return (
    <div className="flex h-screen flex-col">
      <header className="bg-muted text-lg font-semibold p-3">Admin</header>
      <main>{children}</main>
    </div>
  )
}

export default AdminLayout