import { ChevronLeft, Eye, EyeOff, Lock, Mail, UserRound } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { BrandMark, TextField } from '../components/ui';
import { AuthError, useAuth } from '../lib/auth';

const MIN_PASSWORD_LENGTH = 8;

type Notice = { kind: 'error' | 'success'; text: string } | null;

export function LoginScreen() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const mode = params.get('mode') === 'signup' ? 'signup' : 'login';
  const { signIn, signUp, continueAsGuest, canUseAccounts } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  function switchMode(next: 'login' | 'signup') {
    setNotice(null);
    setParams(next === 'signup' ? { mode: 'signup' } : {}, { replace: true });
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setNotice(null);
    if (mode === 'signup' && password.length < MIN_PASSWORD_LENGTH) {
      setNotice({
        kind: 'error',
        text: `Dapat ${MIN_PASSWORD_LENGTH} characters o higit ang password.`,
      });
      return;
    }
    setBusy(true);
    try {
      if (mode === 'login') {
        await signIn(email.trim(), password);
        navigate('/', { replace: true });
      } else {
        const { needsConfirmation } = await signUp(name.trim(), email.trim(), password);
        if (needsConfirmation) {
          setNotice({
            kind: 'success',
            text: 'Na-create na ang account. Tingnan ang iyong email para i-confirm, saka mag-login.',
          });
          setPassword('');
          setParams({}, { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      }
    } catch (error) {
      setNotice({
        kind: 'error',
        text: error instanceof AuthError ? error.message : 'Hindi natuloy. Subukan ulit.',
      });
    } finally {
      setBusy(false);
    }
  }

  function onGuest() {
    continueAsGuest();
    navigate('/', { replace: true });
  }

  return (
    <div className="auth-screen auth-screen-form">
      <section className="auth-panel">
        <Link to="/welcome" className="auth-back">
          <ChevronLeft size={20} aria-hidden />
          Bumalik
        </Link>
        <form className="auth-card" onSubmit={onSubmit}>
          <div className="auth-card-brand">
            <BrandMark size={44} />
            <div>
              <h2>{mode === 'login' ? 'Mag-login' : 'Gumawa ng account'}</h2>
              <p className="muted">Bhaye Mindoro</p>
            </div>
          </div>

          <div className="segmented" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'login'}
              className={mode === 'login' ? 'active' : ''}
              onClick={() => switchMode('login')}
            >
              Login
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'signup'}
              className={mode === 'signup' ? 'active' : ''}
              onClick={() => switchMode('signup')}
            >
              Sign up
            </button>
          </div>

          {!canUseAccounts ? (
            <p className="notice notice-info">
              Hindi pa available ang login sa ngayon. Magpatuloy muna bilang guest.
            </p>
          ) : null}

          {mode === 'signup' ? (
            <TextField
              label="Pangalan"
              icon={<UserRound size={18} />}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
              maxLength={80}
            />
          ) : null}
          <TextField
            label="Email"
            type="email"
            icon={<Mail size={18} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            inputMode="email"
            required
          />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            icon={<Lock size={18} />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            required
            minLength={mode === 'signup' ? MIN_PASSWORD_LENGTH : undefined}
            trailing={
              <button
                type="button"
                className="field-trailing"
                aria-label={showPassword ? 'Itago ang password' : 'Ipakita ang password'}
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />

          {notice ? (
            <p
              className={notice.kind === 'error' ? 'notice notice-error' : 'notice notice-success'}
              role={notice.kind === 'error' ? 'alert' : 'status'}
            >
              {notice.text}
            </p>
          ) : null}

          <button
            type="submit"
            className="button button-primary"
            disabled={busy || !canUseAccounts}
          >
            {busy ? 'Sandali lang...' : mode === 'login' ? 'Mag-login' : 'Gumawa ng account'}
          </button>

          <div className="divider">
            <span>o</span>
          </div>
          <button type="button" className="button button-secondary" onClick={onGuest}>
            Magpatuloy bilang Guest
          </button>
        </form>
      </section>
    </div>
  );
}
