import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import './globals.css';
import { ReactNode } from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';
import Image from 'next/image';
import Link from 'next/link';
import { Analytics } from '@vercel/analytics/next';


// Add this metadata export
export const metadata = {
  title: 'qrsu.io - NFC tools for iPhone',
  description: 'Read, write, and erase NFC tags with the qrsu.io app for iPhone. Write a link onto a tag, or clear it and reuse it.',
  keywords: ['qrsu.io', 'qrsu', 'NFC tools', 'NFC tag reader', 'NFC tag writer', 'erase NFC tag', 'write URL to NFC', 'iPhone NFC app', 'QR code app'],
  authors: [{ name: 'qrsu.io' }],
  creator: 'qrsu.io',
  publisher: 'qrsu.io',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.qrsui.io'),
  alternates: {
    canonical: 'https://www.qrsui.io',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'qrsu.io - NFC tools for iPhone',
    description: 'Read, write, and erase NFC tags with the qrsu.io app. Write a link onto a tag, or clear it and reuse it.',
    url: 'https://www.qrsui.io',
    siteName: 'qrsu.io',
    images: [
      {
        url: '/qrsu.png',
        width: 1200,
        height: 630,
        alt: 'qrsu.io NFC tools for iPhone',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'qrsu.io - NFC tools for iPhone',
    description: 'Read, write, and erase NFC tags with the qrsu.io app. Write a link onto a tag, or clear it and reuse it.',
    creator: '@qrsu_io',
    images: ['/qrsu.png'],
  },
  icons: {
    icon: '/favicon.ico',
  },
  verification: {
    google: '', // Add your Google Search Console verification code here when available
  },
};

const fontHeading = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
});

const fontBody = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps): JSX.Element {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'qrsu.io',
    description: 'Read, write, and erase NFC tags with the qrsu.io app for iPhone.',
    url: 'https://www.qrsui.io',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'iOS 17.6 or later',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    creator: {
      '@type': 'Organization',
      name: 'qrsu.io',
      url: 'https://www.qrsui.io',
    },
    featureList: [
      'Read NFC tags',
      'Write a URL to an NFC tag',
      'Erase NFC tags',
      'QR code creation',
      'URL shortener in the iOS app'
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'antialiased min-h-screen flex flex-col',
          fontHeading.variable,
          fontBody.variable
        )}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center pt-4 pl-4">
              <div className="dark:bg-white dark:p-2 dark:rounded">
                <Image src="/logo.png" alt="qrsu.io logo" width={112} height={37} />
              </div>
            </div>
            <ThemeToggle />
          </div>
          <main className="flex-grow">
            {children}
          </main>
          <footer className="mt-auto py-4 text-center">
            <div className="flex justify-center space-x-4">
              <Link href="/privacy-policy" className="text-sm text-muted-foreground hover:underline">Privacy Policy</Link>
              <Link href="/terms-of-service" className="text-sm text-muted-foreground hover:underline">Terms of Service</Link>
            </div>
          </footer>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}