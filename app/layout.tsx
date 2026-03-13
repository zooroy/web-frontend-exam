import localFont from 'next/font/local';

import { QueryProvider } from '@/components/common/QueryProvider';

import type { Metadata } from 'next';

import './globals.css';

const notoSansTc = localFont({
  src: [
    {
      path: '../node_modules/@fontsource/noto-sans-tc/files/noto-sans-tc-latin-400-normal.woff2',
      style: 'normal',
      weight: '400',
    },
    {
      path: '../node_modules/@fontsource/noto-sans-tc/files/noto-sans-tc-latin-700-normal.woff2',
      style: 'normal',
      weight: '700',
    },
  ],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HeeLoo Jobs',
  description: '適合前端工程師的好工作',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant" className={notoSansTc.className}>
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
