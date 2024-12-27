import '@/styles/globals.css'

import clsx from 'clsx'
import type { Metadata, Viewport } from 'next'
import { Toaster } from 'react-hot-toast'

import { Navbar } from '@/components/navbar'
import { AuthWrapper } from '@/components/wrappers/auth-wrapper'
import { NoSSRWrapper } from '@/components/wrappers/no-ssr'
import { Providers } from '@/components/wrappers/providers'
import { fontSans } from '@/config/fonts'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: '/favicon.ico',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head />
      <body
        suppressHydrationWarning
        className={clsx('min-h-screen bg-background font-sans antialiased', fontSans.variable)}
      >
        <NoSSRWrapper>
          <Providers themeProps={{ attribute: 'class', defaultTheme: 'light' }}>
            <Navbar />
            <AuthWrapper>{children}</AuthWrapper>
            <Toaster
              position="bottom-center"
              toastOptions={{
                style: {
                  borderRadius: '99px',
                },
              }}
            />
          </Providers>
        </NoSSRWrapper>
      </body>
    </html>
  )
}
