import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo.png" />

        {/* Site Metadata */}
        <meta name="description" content="ZEITZONE — Premium watches at affordable prices. Wear Your Royal Moment." />
        <meta name="keywords" content="watches, premium watches, affordable watches, mens watch, ladies watch, smart watch, Bangladesh" />
        <meta name="author" content="ZEITZONE" />
        <meta name="theme-color" content="#0a0a0a" />

        {/* Open Graph (shows nice preview when sharing link on WhatsApp, Facebook etc) */}
        <meta property="og:title" content="ZEITZONE — Wear Your Royal Moment" />
        <meta property="og:description" content="Premium watches at affordable prices." />
        <meta property="og:image" content="/logo.png" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="ZEITZONE" />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}