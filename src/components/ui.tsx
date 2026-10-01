import { Bus, Info, UserRound } from 'lucide-react';
import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';

import { FARE_DISCLAIMER } from '../constants/config';
import { formatPeso } from '../lib/fare';
import type { FareProvenance } from '../types/fare';

/** Page body inside the app shell. The shell's top bar shows the title. */
export function Page({ children, narrow = false }: { children: ReactNode; narrow?: boolean }) {
  return <div className={narrow ? 'page page-narrow' : 'page'}>{children}</div>;
}

export function BrandMark({ size = 40 }: { size?: number }) {
  return (
    <span className="brand-mark" style={{ width: size, height: size }} aria-hidden>
      <Bus size={Math.round(size * 0.58)} strokeWidth={2.2} />
    </span>
  );
}

export function Avatar({ name, guest }: { name: string; guest: boolean }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
  return (
    <span className={guest ? 'avatar avatar-guest' : 'avatar'} aria-hidden>
      {guest ? <UserRound size={18} /> : initials || 'U'}
    </span>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="section-label">{children}</p>;
}

export function EmptyState({
  title,
  message,
  icon,
}: {
  title: string;
  message?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="empty-state">
      {icon ? <span className="empty-state-icon">{icon}</span> : null}
      <p className="empty-state-title">{title}</p>
      {message ? <p className="empty-state-message">{message}</p> : null}
    </div>
  );
}

export function FareDisclaimer() {
  return (
    <p className="disclaimer">
      <Info size={18} aria-hidden />
      <span>{FARE_DISCLAIMER}</span>
    </p>
  );
}

function formatDate(iso: string | null): string {
  return iso ? iso.slice(0, 10) : 'Hindi pa na-verify';
}

/** A fare is never shown without its source, last-updated, and effective dates. */
export function FareResult({
  label,
  amount,
  provenance,
}: {
  label: string;
  amount: number;
  provenance: FareProvenance;
}) {
  return (
    <div className="card fare-result">
      <p className="fare-result-label">{label}</p>
      <p className="fare-result-amount">{formatPeso(amount)}</p>
      <dl className="fare-result-meta">
        <div>
          <dt>Source</dt>
          <dd>{provenance.sourceName}</dd>
        </div>
        <div>
          <dt>Last updated</dt>
          <dd>{formatDate(provenance.lastUpdated)}</dd>
        </div>
        <div>
          <dt>Effective date</dt>
          <dd>{formatDate(provenance.effectiveDate)}</dd>
        </div>
      </dl>
    </div>
  );
}

type FieldProps = { label: string; icon?: ReactNode; trailing?: ReactNode };

export function TextField({
  label,
  icon,
  trailing,
  ...inputProps
}: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <span className={icon ? 'field-control has-icon' : 'field-control'}>
        {icon ? <span className="field-icon">{icon}</span> : null}
        <input className="field-input" {...inputProps} />
        {trailing}
      </span>
    </label>
  );
}

export function TextArea({
  label,
  ...inputProps
}: { label: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <textarea className="field-input field-textarea" {...inputProps} />
    </label>
  );
}

export function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="checkbox">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

export type Option = { value: string; label: string };

/** Large tappable chips; simpler than a dropdown for short lists. */
export function OptionPicker({
  label,
  options,
  value,
  onChange,
  emptyText,
}: {
  label: string;
  options: readonly Option[];
  value: string | null;
  onChange: (value: string) => void;
  emptyText: string;
}) {
  return (
    <div className="field" role="radiogroup" aria-label={label}>
      <span className="field-label">{label}</span>
      {options.length === 0 ? (
        <p className="muted">{emptyText}</p>
      ) : (
        <div className="chips">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={option.value === value}
              className={option.value === value ? 'chip chip-selected' : 'chip'}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
