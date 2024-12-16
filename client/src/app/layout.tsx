import './globals.css'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'

import AuthWrapper from '@/app/auth-wrapper'
import { cn } from '@/lib/utils'

import NoSSRWrapper from './no-ssr-wrapper'
import PullToPageRefresh from '@/app/pull-to-refresh'
import ThemeProvider from '@/app/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={cn(inter?.className, 'font-sans', 'antialiased')}>
        <NoSSRWrapper>
          <ThemeProvider>
            <PullToPageRefresh />
            <AuthWrapper>{children}</AuthWrapper>
            <Toaster
              toastOptions={{
                style: {
                  borderRadius: '99px',
                },
              }}
            />
          </ThemeProvider>
        </NoSSRWrapper>
      </body>
    </html>
  )
}
