import './globals.css';
import type { Metadata } from 'next';
// import { Inter } from "next/font/google";
import { ToastProvider } from '@/components/providers/toast-provider';
import ConfettiProvider from '@/components/providers/confetti-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { SessionProvider } from 'next-auth/react';
import { canCreateCourse } from '@/lib/permissions';
import { auth } from '@/auth';
import FacebookMessenger from '@/components/facebook-messenger';

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Audesse在线教育招聘平台',
  description: 'Audesse在线教育平台',
  icons: '/logoVector_32.svg',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang='zh' suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute='class'
          defaultTheme='light'
          enableSystem
          disableTransitionOnChange
        >
          <ConfettiProvider />
          <ToastProvider />
          <SessionProvider session={session}>{children}</SessionProvider>
        </ThemeProvider>
      </body>

      {!canCreateCourse(session) && <FacebookMessenger />}
    </html>
  );
}
