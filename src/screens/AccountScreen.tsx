import { ArrowRight, Flag, Info, LogIn, LogOut, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { Avatar, FareDisclaimer, Page, SectionLabel } from '../components/ui';
import { useAuth } from '../lib/auth';

export function AccountScreen() {
  const navigate = useNavigate();
  const { status, user, displayName, signOut } = useAuth();
  const signedIn = status === 'signed_in';

  async function onSignOut() {
    await signOut();
    navigate('/welcome', { replace: true });
  }

  return (
    <Page narrow>
      <section className="card profile-card">
        <Avatar name={displayName} guest={!signedIn} />
        <div>
          <h2>{displayName}</h2>
          <p className="muted">{signedIn ? user?.email : 'Guest mode — walang account'}</p>
        </div>
      </section>

      {!signedIn ? (
        <section className="card stack">
          <p>Puwede mong gamitin ang lahat ng public na feature bilang guest.</p>
          <Link to="/login" className="button button-primary">
            <LogIn size={18} aria-hidden />
            Mag-login
          </Link>
          <Link to="/login?mode=signup" className="button button-secondary">
            <UserPlus size={18} aria-hidden />
            Gumawa ng account
          </Link>
        </section>
      ) : null}

      <section>
        <SectionLabel>Iba pa</SectionLabel>
        <div className="action-list">
          <Link to="/report" className="card action-row">
            <span className="stat-icon tone-red">
              <Flag size={18} aria-hidden />
            </span>
            <span>
              <strong>Report Fare Concern</strong>
              <small>I-report ang overcharging</small>
            </span>
            <ArrowRight size={18} aria-hidden />
          </Link>
          <div className="card action-row">
            <span className="stat-icon tone-blue">
              <Info size={18} aria-hidden />
            </span>
            <span>
              <strong>Tungkol sa app</strong>
              <small>Bhaye Mindoro v1.0.0 · Verified data lamang ang ipinapakita</small>
            </span>
          </div>
        </div>
      </section>

      <button type="button" className="button button-danger" onClick={onSignOut}>
        <LogOut size={18} aria-hidden />
        {signedIn ? 'Mag-logout' : 'Lumabas sa guest mode'}
      </button>

      <FareDisclaimer />
    </Page>
  );
}
