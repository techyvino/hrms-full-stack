'use client'
import type { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

const AdminLayout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col">
      <main>{children}</main>
    </div>
  )
}

export default AdminLayout
