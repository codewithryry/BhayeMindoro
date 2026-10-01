import { ChevronLeft, LogIn } from 'lucide-react';
import { useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../lib/auth';
import { CENTER_ITEM, NAV_ITEMS, PAGE_TITLES } from './navigation';
import { Avatar, BrandMark } from './ui';

/**
 * App shell. Desktop: fixed sidebar plus a sticky top bar. Mobile: a compact
 * top bar and a floating bottom bar with the tricycle calculator in its centre.
 */
export function AppLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { status, displayName } = useAuth();
  const isHome = pathname === '/';
  const title = PAGE_TITLES[pathname] ?? 'Bhaye Mindoro';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className={isHome ? 'shell shell-home' : 'shell'}>
      <aside className="sidebar" aria-label="Main navigation">
        <Link to="/" className="sidebar-brand">
          <BrandMark size={40} />
          <span>
            <strong>Bhaye Mindoro</strong>
            <small>Gabay sa pamasahe</small>
          </span>
        </Link>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
            >
              <Icon size={20} aria-hidden />
              {label}
            </NavLink>
          ))}
        </nav>
        <NavLink
          to="/account"
          className={({ isActive }) => (isActive ? 'sidebar-account active' : 'sidebar-account')}
        >
          <Avatar name={displayName} guest={status !== 'signed_in'} />
          <span>
            <strong>{displayName}</strong>
            <small>{status === 'signed_in' ? 'Naka-login' : 'Guest mode'}</small>
          </span>
        </NavLink>
      </aside>

      <div className="shell-main">
        <header className="topbar">
          {isHome ? (
            <Link to="/" className="topbar-brand">
              <BrandMark size={32} />
              <span>Bhaye Mindoro</span>
            </Link>
          ) : (
            <div className="topbar-title">
              <button
                type="button"
                className="icon-button topbar-back"
                aria-label="Bumalik"
                onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))}
              >
                <ChevronLeft size={24} aria-hidden />
              </button>
              <h1>{title}</h1>
            </div>
          )}
          <div className="topbar-actions">
            {status !== 'signed_in' ? (
              <Link to="/login" className="pill-button">
                <LogIn size={16} aria-hidden />
                Login
              </Link>
            ) : null}
            <Link to="/account" className="topbar-avatar" aria-label="Account">
              <Avatar name={displayName} guest={status !== 'signed_in'} />
            </Link>
          </div>
        </header>

        <main className="page-area">
          <Outlet />
        </main>
      </div>

      <nav className="bottom-bar" aria-label="Main navigation">
        {NAV_ITEMS.map(({ to, short, icon: Icon }) =>
          to === CENTER_ITEM.to ? (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => (isActive ? 'bottom-fab active' : 'bottom-fab')}
              aria-label={CENTER_ITEM.label}
            >
              <Icon size={26} aria-hidden />
            </NavLink>
          ) : (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => (isActive ? 'bottom-link active' : 'bottom-link')}
            >
              <Icon size={22} aria-hidden />
              <span>{short}</span>
            </NavLink>
          ),
        )}
      </nav>
    </div>
  );
}
