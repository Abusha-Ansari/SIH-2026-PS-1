import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import 'leaflet/dist/leaflet.css';
import Header from '../components/layout/Header';
import Navbar from '../components/layout/Navbar';

export const metadata: Metadata = {
  title: 'THUNDER-X | AI Hyperlocal Nowcasting & Lightning Early Warning',
  description: 'MoES/IMD Automated AI-Driven Severe Convection & Lightning Prediction System'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 flex flex-col h-screen overflow-hidden">
        <Suspense fallback={<div className="h-16 border-b border-slate-800 bg-slate-950" />}>
          <Header />
        </Suspense>
        <div className="flex flex-1 overflow-hidden">
          <Suspense fallback={<div className="w-56 border-r border-slate-800 bg-slate-950" />}>
            <Navbar />
          </Suspense>
          <main className="flex-1 overflow-y-auto p-4 bg-slate-900/50">
            <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" /></div>}>
              {children}
            </Suspense>
          </main>
        </div>
      </body>
    </html>
  );
}
