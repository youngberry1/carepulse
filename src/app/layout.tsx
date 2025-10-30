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

  manifest: '/icons/manifest.webmanifest',

  icons: {
    icon: [
      { url: '/icons/favicon.ico' },
      { url: '/icons/favicon.svg', type: 'image/svg+xml' },
      { url: '/icons/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
    ],
    apple: '/icons/apple-touch-icon.png',
    shortcut: '/icons/favicon.ico',
  },

  openGraph: {
    title: 'CarePulse — Healthcare Management Platform',
    description: 'Easily manage patients, appointments and medical workflows.',
    url: 'https://carepulse-one-ruby.vercel.app/',
    siteName: 'CarePulse',
    images: [
      {
        url: 'https://carepulse-one-ruby.vercel.app/onboarding-1200x630.png',
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
    images: ['https://carepulse-one-ruby.vercel.app/onboarding-1200x630.png'],
  },
};


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
