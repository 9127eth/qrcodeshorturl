import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import './globals.css';
import { ReactNode } from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';
import Image from 'next/image';
import Head from 'next/head';


// Add this metadata export
export const metadata = {
  title: 'qrsu.io - QR Code & URL Shortener',
  description: 'Generate QR codes and shorten URLs quickly and securely.',
  keywords: ['qrsu.io','qrsu','Free QR Codes', 'Free QR Code Generator', 'Free URL Shortener', 'QR Code Generator', 'Custom QR Codes', 'Dynamic QR Codes', 'QR Code Creator', 'Create QR Codes', 'QR Code Scanner', 'Trackable QR Codes', 'QR Code Marketing', 'QR Code Design', 'Best QR Code Generator', 'Free Short URL', 'Short Codes', 'URL Shortener', 'Custom Short URLs', 'URL Redirection', 'Link Shortener', 'Short URL Service', 'Short Link Creator', 'Free Link Shortener', 'Dynamic URL Shortener', 'QR Codes for Business', 'QR Code API', 'Free Link Generator', 'Trackable URLs', 'Secure URL Shortener', 'Branded QR Codes', 'QR Code Solutions'],
  openGraph: {
    title: 'qrsu.io - QR Code & URL Shortener',
    description: 'Create QR codes and short URLs quickly and securely with qrsu.io.',
    url: 'https://qrcodeshorturl.com',
    siteName: 'qrsu.io',
    images: [
      {
        url: '/qrsu.png', // This should match the image you added in the public directory
        width: 1200,
        height: 630,
        alt: 'qrsu.io - QR Code & URL Shortener',
      },
    ],
    locale: 'en_US',
    type: 'website',
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
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <link rel="icon" href="/favicon.ico" />
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
              <a href="/privacy-policy" className="text-sm text-muted-foreground hover:underline">Privacy Policy</a>
              <a href="/terms-of-service" className="text-sm text-muted-foreground hover:underline">Terms of Service</a>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}