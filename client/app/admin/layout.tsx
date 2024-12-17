'use client'
import type { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

const AdminLayout = ({ children }: LayoutProps) => {
  return (
    <div className="flex h-screen flex-col">
      <header className="bg-muted p-3 text-lg font-semibold">Admin</header>
      <main>{children}</main>
    </div>
  )
}

export default AdminLayout
