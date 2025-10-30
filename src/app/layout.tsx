// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CarePulse',
  description: 'CarePulse is a platform for managing appointments and patients.',
  keywords: ['carepulse', 'appointments', 'patients', 'management'],
  authors: [{ name: 'Trending Boss' }],
  creator: 'CarePulse',
  publisher: 'CarePulse',
  icons: {
    icon: '/Logomark.svg',
  },
  formatDetection: {
    email: false,
    address: false,
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster
          position="top-right"
          expand={false}
          richColors
          closeButton
        />
      </body>
    </html>
  );
}
