import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import './globals.css';
import { ReactNode } from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';


// Add this metadata export
export const metadata = {
  title: 'qrsu.io - QR Code & URL Shortener',
  description: 'Generate QR codes and shorten URLs quickly and securely.',
  keywords: ['qrsu.io','qrsu','Free QR Codes', 'Free QR Code Generator', 'Free URL Shortener', 'QR Code Generator', 'Custom QR Codes', 'Dynamic QR Codes', 'QR Code Creator', 'Create QR Codes', 'QR Code Scanner', 'Trackable QR Codes', 'QR Code Marketing', 'QR Code Design', 'Best QR Code Generator', 'Free Short URL', 'Short Codes', 'URL Shortener', 'Custom Short URLs', 'URL Redirection', 'Link Shortener', 'Short URL Service', 'Short Link Creator', 'Free Link Shortener', 'Dynamic URL Shortener', 'QR Codes for Business', 'QR Code API', 'Free Link Generator', 'Trackable URLs', 'Secure URL Shortener', 'Branded QR Codes', 'QR Code Solutions'],
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
    title: 'qrsu.io - QR Code & URL Shortener',
    description: 'Create QR codes and short URLs quickly and securely with qrsu.io.',
    url: 'https://www.qrsui.io',
    siteName: 'qrsu.io',
    images: [
      {
        url: '/qrsu.png',
        width: 1200,
        height: 630,
        alt: 'qrsu.io - QR Code & URL Shortener',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'qrsu.io - QR Code & URL Shortener',
    description: 'Create QR codes and short URLs quickly and securely with qrsu.io.',
    creator: '@qrsu_io',
    images: ['/qrsu.png'],
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
    description: 'Generate QR codes and shorten URLs quickly and securely.',
    url: 'https://www.qrsui.io',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web Browser',
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
      'Free QR Code Generation',
      'URL Shortening Service',
      'Safe URL Validation',
      'Multiple Download Formats',
      'No Registration Required'
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <body 
        className={cn(
          'antialiased min-h-screen flex flex-col',
          fontHeading.variable,
          fontBody.variable
        )}
      >
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
      </body>
    </html>
  );
}