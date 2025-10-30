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
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
  formatDetection: {
    email: false,
    address: false,
  },
  openGraph: {
    title: 'CarePulse — Healthcare Management Platform',
    description: 'Easily manage patients, appointments and medical workflows.',
    url: 'https://carepulse-one-ruby.vercel.app/',
    siteName: 'CarePulse',
    images: [
      {
        url: '/public/assets/onboarding.png',
        width: 1200,
        height: 630,
        alt: 'CarePulse App Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CarePulse — Healthcare Management',
    description: 'Manage patients & appointments smartly.',
    images: ['/public/assets/onboarding.png'],
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
