import { NavLink, Outlet, Link } from 'react-router-dom';
import {
  LayoutDashboard, Package, Tags, Home, PanelTop, FileText, Settings as SettingsIcon,
  ClipboardList, Users, LogOut, ExternalLink
} from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';

const NAV_ITEMS = [
  { to: '/admin', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories & Activities', icon: Tags },
  { to: '/admin/home', label: 'Home & Promo Tiles', icon: Home },
  { to: '/admin/header-footer', label: 'Header & Footer', icon: PanelTop },
  { to: '/admin/pages', label: 'Pages & FAQ', icon: FileText },
  { to: '/admin/settings', label: 'Settings', icon: SettingsIcon },
  { to: '/admin/orders', label: 'Orders', icon: ClipboardList }
];

export default function Layout() {
  const { profile, isAdmin, signOut } = useAdminAuth();

  return (
    <div className="min-h-screen bg-white text-black flex font-sans">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-black text-white flex flex-col">
        <div className="px-6 py-6 border-b border-white/10">
          <span className="text-lg font-black tracking-[0.3em] uppercase block">IVORY</span>
          <span className="text-[9px] font-mono tracking-widest text-white/40 uppercase">Admin Portal</span>
        </div>

        <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ to, end, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-6 py-2.5 text-[11px] font-mono tracking-wider uppercase transition-colors ${
                  isActive ? 'bg-white text-black font-bold' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon size={14} />
              <span>{label}</span>
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink
              to="/admin/staff"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-6 py-2.5 text-[11px] font-mono tracking-wider uppercase transition-colors ${
                  isActive ? 'bg-white text-black font-bold' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Users size={14} />
              <span>Staff</span>
            </NavLink>
          )}
        </nav>

        <div className="px-6 py-4 border-t border-white/10 space-y-3">
          <Link to="/" target="_blank" className="flex items-center space-x-2 text-[10px] font-mono text-white/50 hover:text-white uppercase">
            <ExternalLink size={12} />
            <span>View storefront</span>
          </Link>
          <div className="space-y-1">
            <p className="text-[10px] font-mono text-white/70 truncate">{profile?.email}</p>
            <p className="text-[9px] font-mono text-white/30 uppercase">{profile?.role ?? '—'}</p>
          </div>
          <button
            onClick={() => signOut()}
            className="flex items-center space-x-2 text-[10px] font-mono text-white/50 hover:text-white uppercase"
          >
            <LogOut size={12} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-8 py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
