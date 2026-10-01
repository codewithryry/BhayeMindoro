import {
  ArrowLeftRight,
  ArrowRight,
  Building2,
  Bus,
  Calculator,
  CircleAlert,
  Flag,
  LogIn,
  MapPin,
  Route,
  Search,
} from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { FareDisclaimer, Page, SectionLabel } from '../components/ui';
import { useCacheStats } from '../hooks/useCacheStats';
import { useAuth } from '../lib/auth';

function greeting(date = new Date()): string {
  const hour = date.getHours();
  if (hour >= 5 && hour < 11) return 'Magandang umaga';
  if (hour >= 11 && hour < 13) return 'Magandang tanghali';
  if (hour >= 13 && hour < 18) return 'Magandang hapon';
  return 'Magandang gabi';
}

export function DashboardScreen() {
  const navigate = useNavigate();
  const { status, displayName } = useAuth();
  const stats = useCacheStats();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const firstName = status === 'signed_in' ? displayName.split(' ')[0] : 'Guest';
  const hasFareData = (stats?.fares ?? 0) + (stats?.tricycleFares ?? 0) > 0;

  function onSearch(event: FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (from.trim()) params.set('from', from.trim());
    if (to.trim()) params.set('to', to.trim());
    navigate(`/ruta${params.size ? `?${params}` : ''}`);
  }

  const statCards = [
    { label: 'Mga Ruta', value: stats?.routes, icon: Route, tone: 'green', to: '/ruta' },
    {
      label: 'Tricycle Fares',
      value: stats?.tricycleFares,
      icon: Calculator,
      tone: 'amber',
      to: '/tricycle',
    },
    { label: 'Terminals', value: stats?.terminals, icon: MapPin, tone: 'blue', to: '/terminals' },
    {
      label: 'Mga Bayan',
      value: stats?.municipalities,
      icon: Building2,
      tone: 'violet',
      to: '/tricycle',
    },
  ] as const;

  return (
    <Page>
      <section className="hero">
        <div className="hero-text">
          <h2 className="hero-greeting">
            {greeting()}, {firstName}!
          </h2>
          <p className="hero-subtitle">
            Saan ka pupunta ngayon? Gabay sa pamasahe at biyahe sa Mindoro.
          </p>
          <div className="hero-actions">
            <Link to="/ruta" className="button button-dark">
              <Route size={18} aria-hidden />
              Hanap Ruta
            </Link>
            <Link to="/tricycle" className="button button-light">
              <Calculator size={18} aria-hidden />
              Tricycle Fare
            </Link>
          </div>
        </div>
        <div className="hero-art" aria-hidden>
          <span className="hero-art-ring" />
          <span className="hero-art-badge">
            <Bus size={56} strokeWidth={1.8} />
          </span>
        </div>
      </section>

      <div className="dashboard-grid">
        <section className="card">
          <SectionLabel>Mabilis na paghahanap</SectionLabel>
          <form className="quick-search" onSubmit={onSearch}>
            <label className="quick-field">
              <span className="quick-dot quick-dot-from" aria-hidden />
              <input
                placeholder="Saan ka manggagaling?"
                aria-label="Saan ka manggagaling?"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </label>
            <button
              type="button"
              className="icon-button quick-swap"
              aria-label="Palitan ang From at To"
              onClick={() => {
                setFrom(to);
                setTo(from);
              }}
            >
              <ArrowLeftRight size={18} aria-hidden />
            </button>
            <label className="quick-field">
              <span className="quick-dot quick-dot-to" aria-hidden />
              <input
                placeholder="Saan ka pupunta?"
                aria-label="Saan ka pupunta?"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </label>
            <button type="submit" className="button button-primary">
              <Search size={18} aria-hidden />
              Hanap
            </button>
          </form>
        </section>

        <section className="card">
          <SectionLabel>Paalala</SectionLabel>
          {stats && !hasFareData ? (
            <Link to="/report" className="attention">
              <CircleAlert size={22} aria-hidden />
              <span>
                <strong>Wala pang verified fare data</strong>
                <small>Lalabas dito ang pamasahe kapag na-verify na. May concern? I-report.</small>
              </span>
              <ArrowRight size={18} aria-hidden />
            </Link>
          ) : (
            <p className="muted">
              {stats?.lastSyncedAt
                ? `Huling update ng data: ${stats.lastSyncedAt.slice(0, 10)}`
                : 'Tinitingnan ang data...'}
            </p>
          )}
          {status !== 'signed_in' ? (
            <Link to="/login" className="attention attention-soft">
              <LogIn size={22} aria-hidden />
              <span>
                <strong>Naka-guest ka</strong>
                <small>Mag-login o gumawa ng account kung gusto mo.</small>
              </span>
              <ArrowRight size={18} aria-hidden />
            </Link>
          ) : null}
        </section>
      </div>

      <section>
        <SectionLabel>Datos</SectionLabel>
        <div className="stat-grid">
          {statCards.map(({ label, value, icon: Icon, tone, to }) => (
            <Link key={label} to={to} className="card stat-card">
              <span className={`stat-icon tone-${tone}`}>
                <Icon size={18} aria-hidden />
              </span>
              <span className="stat-label">{label}</span>
              <span className="stat-value">{value ?? '–'}</span>
              <span className="stat-note">{value ? 'Verified lamang' : 'Wala pang data'}</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <SectionLabel>Iba pa</SectionLabel>
        <div className="action-list">
          <Link to="/terminals" className="card action-row">
            <span className="stat-icon tone-blue">
              <MapPin size={18} aria-hidden />
            </span>
            <span>
              <strong>Mga Terminal</strong>
              <small>Hanapin ang terminal ng van, bus, jeep, at ferry</small>
            </span>
            <ArrowRight size={18} aria-hidden />
          </Link>
          <Link to="/report" className="card action-row">
            <span className="stat-icon tone-red">
              <Flag size={18} aria-hidden />
            </span>
            <span>
              <strong>Report Fare Concern</strong>
              <small>Anonymous. Hindi kailangan ng account.</small>
            </span>
            <ArrowRight size={18} aria-hidden />
          </Link>
        </div>
      </section>

      <FareDisclaimer />
    </Page>
  );
}
