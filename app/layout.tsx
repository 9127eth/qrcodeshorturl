import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import './globals.css';
import { ReactNode } from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';

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
      <body 
        className={cn(
          'antialiased min-h-screen flex flex-col',
          fontHeading.variable,
          fontBody.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex justify-end p-4">
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