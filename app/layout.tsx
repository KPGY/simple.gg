import localFont from 'next/font/local';
import './globals.css';
import Link from 'next/link';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className='fixed w-full top-0 z-10 bg-blue-300 h-11 flex items-center justify-center'>
          <Link className='ml-5 text-xl font-bold' href={'/'}>
            Simple.gg
          </Link>
        </header>
        {children}
      </body>
    </html>
  );
}
