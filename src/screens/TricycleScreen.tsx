import { Calculator } from 'lucide-react';
import { useState, type FormEvent } from 'react';

import {
  EmptyState,
  FareDisclaimer,
  FareResult,
  OptionPicker,
  Page,
  TextField,
} from '../components/ui';
import { useMunicipalities } from '../hooks/useMunicipalities';
import { getCacheStore } from '../lib/cache';
import { findTricycleFare, getFareSource } from '../lib/cache/queries';
import type { FareProvenance } from '../types/fare';

type Result =
  { kind: 'found'; amount: number; provenance: FareProvenance } | { kind: 'not_found' } | null;

export function TricycleScreen() {
  const { municipalities, loading } = useMunicipalities();
  const [municipalityId, setMunicipalityId] = useState<string | null>(null);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [result, setResult] = useState<Result>(null);

  const canCompute = municipalityId !== null && from.trim() !== '' && to.trim() !== '';

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!municipalityId) return;
    try {
      const store = getCacheStore();
      const fare = await findTricycleFare(store, municipalityId, from, to);
      const source = fare ? await getFareSource(store, fare.source_id) : null;
      // Never show a fare without its source.
      if (!fare || !source) {
        setResult({ kind: 'not_found' });
        return;
      }
      setResult({
        kind: 'found',
        amount: fare.regular_fare,
        provenance: {
          sourceName: fare.ordinance_number
            ? `${source.name} (Ordinance ${fare.ordinance_number})`
            : source.name,
          lastUpdated: source.last_verified_at,
          effectiveDate: fare.effective_date,
        },
      });
    } catch (error) {
      console.error('[Bhaye Mindoro] Tricycle fare lookup failed', error);
      setResult({ kind: 'not_found' });
    }
  }

  return (
    <Page>
      <div className="split">
        <form className="card stack" onSubmit={onSubmit}>
          <OptionPicker
            label="Pumili ng bayan"
            options={municipalities.map((m) => ({ value: m.id, label: m.name }))}
            value={municipalityId}
            onChange={(id) => {
              setMunicipalityId(id);
              setResult(null);
            }}
            emptyText={loading ? 'Naglo-load...' : 'Wala pang municipality data.'}
          />
          <TextField label="From" value={from} onChange={(e) => setFrom(e.target.value)} />
          <TextField label="To" value={to} onChange={(e) => setTo(e.target.value)} />
          <button type="submit" className="button button-primary" disabled={!canCompute}>
            <Calculator size={18} aria-hidden />
            Compute Fare
          </button>
        </form>

        <div className="stack">
          {result?.kind === 'found' ? (
            <FareResult
              label="Regular fare"
              amount={result.amount}
              provenance={result.provenance}
            />
          ) : null}
          {result?.kind === 'not_found' ? (
            <EmptyState
              icon={<Calculator size={28} />}
              title="Wala pang verified fare data."
              message="Wala pang verified na tricycle fare para sa rutang ito."
            />
          ) : null}
          {result === null ? (
            <EmptyState
              icon={<Calculator size={28} />}
              title="Kalkulahin ang tricycle fare"
              message="Pumili ng bayan at ilagay ang From at To."
            />
          ) : null}
          <FareDisclaimer />
        </div>
      </div>
    </Page>
  );
}
