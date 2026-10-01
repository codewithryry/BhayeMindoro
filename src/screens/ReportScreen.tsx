import { useState, type FormEvent } from 'react';

import { OptionPicker, Page, TextArea, TextField, type Option } from '../components/ui';
import { useMunicipalities } from '../hooks/useMunicipalities';
import {
  MAX_REPORT_DESCRIPTION_LENGTH,
  ReportUnavailableError,
  submitReport,
} from '../lib/reports';
import type { ReportType } from '../types/database';

const REPORT_TYPES: readonly (Option & { value: ReportType })[] = [
  { value: 'overcharging', label: 'Na-overcharge ako' },
  { value: 'incorrect_info', label: 'Mali ang fare info' },
  { value: 'other', label: 'Iba pa' },
];

type Status = { kind: 'idle' } | { kind: 'success' } | { kind: 'error'; message: string };

function parseFare(input: string): number | null | 'invalid' {
  const trimmed = input.trim();
  if (trimmed === '') return null;
  if (!/^\d{1,6}(\.\d{1,2})?$/.test(trimmed)) return 'invalid';
  return Number(trimmed);
}

export function ReportScreen() {
  const { municipalities, loading } = useMunicipalities();
  const [reportType, setReportType] = useState<ReportType>('overcharging');
  const [municipalityId, setMunicipalityId] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [farePaid, setFarePaid] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const reportedFare = parseFare(farePaid);
    if (reportedFare === 'invalid') {
      setStatus({ kind: 'error', message: 'Maglagay ng tamang halaga, hal. 25 o 25.50.' });
      return;
    }

    setSubmitting(true);
    setStatus({ kind: 'idle' });
    try {
      await submitReport({
        report_type: reportType,
        municipality_id: municipalityId,
        description,
        reported_fare: reportedFare,
      });
      setStatus({ kind: 'success' });
      setDescription('');
      setFarePaid('');
    } catch (error) {
      console.error('[Bhaye Mindoro] Report submission failed', error);
      setStatus({
        kind: 'error',
        message:
          error instanceof ReportUnavailableError
            ? 'Hindi pa available ang pag-submit ng report.'
            : 'Hindi ma-submit. Subukang muli kapag may internet connection.',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Page narrow>
      <form className="card stack" onSubmit={onSubmit}>
        <h2 className="card-title">Report a Fare Concern</h2>
        <p className="muted">Anonymous ang report. Hindi kailangan ng account.</p>

        <OptionPicker
          label="Type"
          options={REPORT_TYPES}
          value={reportType}
          onChange={(value) => setReportType(value as ReportType)}
          emptyText=""
        />
        <OptionPicker
          label="Municipality"
          options={municipalities.map((m) => ({ value: m.id, label: m.name }))}
          value={municipalityId}
          onChange={setMunicipalityId}
          emptyText={loading ? 'Naglo-load...' : 'Wala pang municipality data.'}
        />
        <TextArea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={MAX_REPORT_DESCRIPTION_LENGTH}
          rows={5}
        />
        <TextField
          label="Fare paid"
          value={farePaid}
          onChange={(e) => setFarePaid(e.target.value)}
          inputMode="decimal"
          placeholder="₱"
        />
        <button type="submit" className="button button-primary" disabled={submitting}>
          {submitting ? 'Sinusubmit...' : 'Submit Report'}
        </button>

        {status.kind === 'success' ? (
          <p className="notice notice-success" role="status">
            Salamat! Natanggap na ang iyong report.
          </p>
        ) : null}
        {status.kind === 'error' ? (
          <p className="notice notice-error" role="alert">
            {status.message}
          </p>
        ) : null}
      </form>
    </Page>
  );
}
