import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/global.css';
import { Providers } from '@/components/providers/Providers';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DSA Mastery - Master Data Structures & Algorithms',
  description: 'A comprehensive platform to master Data Structures and Algorithms with structured learning paths, progress tracking, and curated resources.',
  keywords: 'DSA, Data Structures, Algorithms, Coding, Programming, LeetCode, Interview Preparation',
  authors: [{ name: 'DSA Mastery Team' }],
  openGraph: {
    title: 'DSA Mastery Platform',
    description: 'Master Data Structures & Algorithms with our comprehensive learning platform',
    url: 'https://dsamastery.com',
    siteName: 'DSA Mastery',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1f2937',
                color: '#fff',
                borderRadius: '0.5rem',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
