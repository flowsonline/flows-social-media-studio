'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Home' },
  { href: '/studio', label: 'Studio' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/ads', label: 'Ad Strategy' },
  { href: '/analytics', label: 'Analytics' },
];

export default function NavBar() {
  const pathname = usePathname();
  return (
    <nav className="sticky top-0 z-50 backdrop-blur bg-black/30 border-b border-white/10">
      <div className="max-w-6xl mx-auto flex items-center gap-6 px-4 py-3">
        <div className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-flows.teal to-flows.purple">FLOWS Studio</div>
        <div className="flex gap-4">
          {links.map(l => (
            <Link key={l.href} href={l.href} className={pathname===l.href?'text-white':'text-white/70 hover:text-white'}>{l.label}</Link>
          ))}
        </div>
        <div className="ml-auto">
          {process.env.NEXT_PUBLIC_AUTH_MODE !== "bypass" && (
            <Link href="/login" className="text-white/70 hover:text-white">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
