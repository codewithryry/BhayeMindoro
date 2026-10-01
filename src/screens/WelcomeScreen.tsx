import { Calculator, Flag, Route } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { BrandMark, FareDisclaimer } from '../components/ui';
import { useAuth } from '../lib/auth';

const FEATURES = [
  { icon: Route, title: 'Hanap Ruta', text: 'Alamin ang sasakyan, pamasahe, at oras ng biyahe.' },
  { icon: Calculator, title: 'Tricycle Calculator', text: 'Tingnan ang pamasahe ayon sa bayan.' },
  { icon: Flag, title: 'Report Fare Concern', text: 'I-report kung na-overcharge ka.' },
];

export function WelcomeScreen() {
  const navigate = useNavigate();
  const { continueAsGuest } = useAuth();

  function onGuest() {
    continueAsGuest();
    navigate('/', { replace: true });
  }

  return (
    <div className="auth-screen">
      <section className="auth-hero">
        <BrandMark size={64} />
        <h1>Bhaye Mindoro</h1>
        <p>Gabay sa pamasahe at biyahe sa Mindoro</p>
        <ul className="feature-list">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <li key={title}>
              <span className="feature-icon">
                <Icon size={20} aria-hidden />
              </span>
              <span>
                <strong>{title}</strong>
                <small>{text}</small>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <h2>Mabuhay!</h2>
          <p className="muted">Gamitin ang app bilang guest, o mag-login para sa iyong account.</p>
          <Link to="/login" className="button button-dark">
            Mag-login
          </Link>
          <button type="button" className="button button-secondary" onClick={onGuest}>
            Magpatuloy bilang Guest
          </button>
          <p className="auth-switch">
            Wala pang account? <Link to="/login?mode=signup">Gumawa ng account</Link>
          </p>
        </div>
        <FareDisclaimer />
      </section>
    </div>
  );
}
