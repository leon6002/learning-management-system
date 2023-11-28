import { ClerkProvider, auth } from '@clerk/nextjs';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ToastProvider } from '@/components/providers/toast-provider';
import ConfettiProvider from '@/components/providers/confetti-provider';
import { ThemeProvider } from '@/components/theme-provider';
import FacebookMessenger from '@/components/facebook-messenger';
import { isTeacher } from '@/lib/teacher';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { userId } = auth();

	return (
		<ClerkProvider>
			<html lang="en">
				<body className={inter.className}>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<ConfettiProvider />

						<ToastProvider />

						{children}
					</ThemeProvider>
				</body>

				{!isTeacher(userId) && <FacebookMessenger />}
			</html>
		</ClerkProvider>
	);
}
