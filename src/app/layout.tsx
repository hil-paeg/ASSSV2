import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from './providers'
import { AuthProvider } from '@/contexts/AuthContext'
// import { Toaster } from '@/components/ui/sonner'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ClientSessionProvider } from '@/components/providers/ClientSessionProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Support Track Portal',
  description: 'Support ticket management and tracking system',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientSessionProvider session={session}>
          <AuthProvider>
            <Providers>
              {children}
              {/* <Toaster position="top-center" /> */}
            </Providers>
          </AuthProvider>
        </ClientSessionProvider>
      </body>
    </html>
  )
}
