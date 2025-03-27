import React from 'react';
import Header from './components/header';
import Footer from './components/footer';
import Sidebar from './components/sidebar';
import './globals.css';

export const metadata = {
  title: 'Go Bravo',
  description: 'Empowering your financial journey with robust credit analysis',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <head>
        {/* Import Montserrat from Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          margin: 0,
          fontFamily: 'Montserrat, sans-serif',
        }}
      >
        <Header />
        <div style={{ display: 'flex', flex: 1 }}>
          <Sidebar />
          <main
            style={{
              flex: 1,
              padding: '1rem',
              background: 'linear-gradient(135deg, #a89fe1, #71f3f8)',
            }}
          >
            {children}
          </main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
