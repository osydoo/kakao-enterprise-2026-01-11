import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ModalStack } from '@/components/modal';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { QueryProvider } from '@/providers/QueryProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'KEH',
  description: 'kakao enterprise homework',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-hidden`}>
        <QueryProvider>
          <DashboardShell>{children}</DashboardShell>
          <ModalStack />
        </QueryProvider>
      </body>
    </html>
  );
}
