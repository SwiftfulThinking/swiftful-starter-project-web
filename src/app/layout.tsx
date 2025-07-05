import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/contexts/auth-context"
import { AuthGuard } from "@/components/auth-guard"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Swiftful Starter Project',
  description: 'A starter template for web projects',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <AuthGuard allowedPaths={['/']} allow404={true}>
            {children}
          </AuthGuard>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}
