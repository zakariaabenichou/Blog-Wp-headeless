// src/app/layout.tsx
import type { Metadata } from 'next';
// 1. Import the fonts we want from next/font
import { Lora, Poppins } from 'next/font/google';
import './globals.css';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

// 2. Configure the body font (Poppins)
const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins', // CSS variable name
  weight: ['400', '500', '600', '700'], // Weights we'll use
});

// 3. Configure the heading font (Lora)
const lora = Lora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lora', // CSS variable name
});

export const metadata: Metadata = {
  title: 'Sourdough Recipes - Elena Bakes',
  description: '',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 4. Apply the font variables to the <html> tag
    <html lang="en" className={`${poppins.variable} ${lora.variable}`}>
      <body className={`bg-white text-text-main flex flex-col min-h-screen`}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}