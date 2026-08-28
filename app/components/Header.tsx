'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, Search, Home, Calculator, QrCode } from 'lucide-react';

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Buscar', href: '/busca', icon: Search },
    { label: 'Minha Casa', href: '/minha-casa', icon: Home },
    { label: 'Calculadora ROI', href: '/roi', icon: Calculator },
  ];

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div>
            <div className="flex items-center">
              <span className="text-xl font-black tracking-tight text-gray-900">Watt</span>
              <span className="text-xl font-black tracking-tight text-violet-600 ml-1">Next?</span>
            </div>
            <span className="text-[10px] text-gray-400 font-medium block -mt-1 tracking-wider uppercase">consumo consciente</span>
          </div>
        </Link>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium text-gray-600">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'bg-violet-50 text-violet-700 font-bold border border-violet-100'
                    : 'hover:text-violet-700 hover:bg-gray-50'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-violet-600' : 'text-gray-400'} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* QR Code Action Button em Roxo Elétrico */}
        <div className="flex items-center gap-2">
          <Link
            href="/qrcode"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm ${
              pathname === '/qrcode'
                ? 'bg-violet-700 text-white shadow-violet-300'
                : 'bg-violet-600 hover:bg-violet-700 text-white shadow-violet-500/25 hover:shadow-md'
            }`}
          >
            <QrCode size={18} />
            <span className="hidden sm:inline">Escanear QR Code</span>
            <span className="sm:hidden">QR</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
