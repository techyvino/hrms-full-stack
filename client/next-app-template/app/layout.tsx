import '@/styles/globals.css'
import clsx from 'clsx'
import { Metadata, Viewport } from 'next'

import { Providers } from './providers'

import AuthWrapper from '@/app/auth-wrapper'
import NoSsrWrapper from '@/app/no-ssr-wrapper'
import PullToPageRefresh from '@/app/pull-to-refresh'
import { fontSans } from '@/config/fonts'
import { siteConfig } from '@/config/site'
import { Toaster } from 'react-hot-toast'
import { Navbar } from '@/components/navbar'

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
    <html suppressHydrationWarning lang="en">
      <head />
      <body className={clsx('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <Providers themeProps={{ attribute: 'class', defaultTheme: 'dark' }}>
          <NoSsrWrapper>
            <>
              <Navbar />
              <PullToPageRefresh />
              <AuthWrapper>{children}</AuthWrapper>
              <Toaster
                toastOptions={{
                  style: {
                    borderRadius: '99px',
                  },
                }}
              />
            </>
          </NoSsrWrapper>
        </Providers>
      </body>
    </html>
  )
}
