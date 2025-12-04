import type { Metadata, Viewport } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Daily Focus',
  description: '每日计划与专注任务管理应用',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--bg-page)] text-slate-800 antialiased">
        <div className="pb-safe">
          {children}
        </div>
      </body>
    </html>
  );
}
