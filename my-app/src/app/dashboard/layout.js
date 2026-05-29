'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import {
  LayoutDashboard,
  FileText,
  Syringe,
  MessagesSquare,
  Volume2,
  LogOut,
  Heart,
  Menu,
  X,
  ChevronRight,
  Upload,
  User,
} from 'lucide-react';
import { useState } from 'react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/reports', label: 'Reports', icon: FileText },
  { href: '/dashboard/prescriptions', label: 'Prescriptions', icon: Syringe },
  { href: '/chat', label: 'AI Chat', icon: MessagesSquare },
  { href: '/voice', label: 'Voice', icon: Volume2 },
];

const MOBILE_NAV_ITEMS = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/dashboard/reports', label: 'Reports', icon: FileText },
  { href: '/chat', label: 'Chat', icon: MessagesSquare },
  { href: '/dashboard/prescriptions', label: 'Rx', icon: Syringe },
];

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  const isActive = (href) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gradient-to-br from-[#f4f0ea] via-white to-[#eef6ff]">
        {/* ── Mobile overlay ──────────────────────────────── */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* ── Sidebar (Desktop + Mobile Drawer) ──────────── */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200/60 bg-white/95 backdrop-blur-xl transition-transform duration-300 lg:static lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          role="navigation"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <Link href="/dashboard" className="flex items-center gap-2.5 group" aria-label="MedExplain AI Home">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 transition group-hover:shadow-lg group-hover:shadow-emerald-200">
                <Heart className="h-4.5 w-4.5 text-white" aria-hidden="true" />
              </div>
              <div>
                <span className="text-base font-bold text-slate-900">MedExplain</span>
                <span className="ml-0.5 text-base font-light text-emerald-600">AI</span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Nav items */}
          <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Sidebar navigation">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    active
                      ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon
                    className={`h-4.5 w-4.5 transition ${
                      active ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                    aria-hidden="true"
                  />
                  {item.label}
                  {active && <ChevronRight className="ml-auto h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-slate-100 p-4">
            <div className="mb-3 rounded-xl bg-slate-50 px-3 py-2.5">
              <p className="text-xs font-medium text-slate-500">Signed in as</p>
              <p className="mt-0.5 truncate text-sm font-semibold text-slate-800">
                {user?.name || user?.email || 'User'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600"
              aria-label="Sign out of your account"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign out
            </button>
          </div>
        </aside>

        {/* ── Main content area ───────────────────────────── */}
        <div className="flex flex-1 flex-col pb-16 lg:pb-0">
          {/* Mobile top header */}
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/60 bg-white/80 px-4 py-3 backdrop-blur-xl lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link href="/dashboard" className="flex items-center gap-2" aria-label="MedExplain AI Home">
              <Heart className="h-5 w-5 text-emerald-600" aria-hidden="true" />
              <span className="text-sm font-bold text-slate-900">MedExplain AI</span>
            </Link>
            <button
              onClick={() => router.push('/dashboard')}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50"
              aria-label="User profile"
            >
              <User className="h-4 w-4 text-emerald-600" aria-hidden="true" />
            </button>
          </header>

          {/* Page content */}
          <main className="flex-1" role="main">
            {children}
          </main>
        </div>

        {/* ── Mobile Bottom Nav ───────────────────────────── */}
        <nav
          className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-xl lg:hidden"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div className="flex items-center justify-around px-2 py-1.5">
            {MOBILE_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[10px] font-semibold transition ${
                    active
                      ? 'text-emerald-600'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                  aria-current={active ? 'page' : undefined}
                  aria-label={item.label}
                >
                  <div className={`rounded-lg p-1.5 transition ${active ? 'bg-emerald-50' : ''}`}>
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </ProtectedRoute>
  );
}
