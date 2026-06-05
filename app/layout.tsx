import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title:       'Afandi Coordinator OS',
  description: 'نظام إدارة عملاء عيادة د. محمد أفندي',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ar' dir='rtl'>
      <head>
        {/* Preconnect for faster font load */}
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link
          href='https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600&display=swap'
          rel='stylesheet'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  )
}
