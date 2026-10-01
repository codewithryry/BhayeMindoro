import { colors } from '../constants/colors';

// Inline styles on purpose: this must render even if the stylesheet failed to load.
export function ErrorFallback() {
  return (
    <div
      role="alert"
      style={{
        minHeight: '100vh',
        padding: 24,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 12,
        fontFamily: 'system-ui, sans-serif',
        background: colors.background,
        color: colors.text,
        textAlign: 'center',
      }}
    >
      <h1 style={{ margin: 0, fontSize: 28, color: colors.primary }}>Bhaye Mindoro</h1>
      <p style={{ margin: 0, fontSize: 18 }}>May problema sa pag-load ng app.</p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        style={{
          alignSelf: 'center',
          minHeight: 52,
          padding: '0 28px',
          border: 0,
          borderRadius: 12,
          fontSize: 17,
          fontWeight: 700,
          color: colors.textOnPrimary,
          background: colors.primary,
          cursor: 'pointer',
        }}
      >
        Subukan ulit
      </button>
    </div>
  );
}
