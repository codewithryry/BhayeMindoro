import { ArrowLeftRight, Route, Search } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Checkbox, EmptyState, FareDisclaimer, Page, TextField } from '../components/ui';

export function RouteSearchScreen() {
  const [params, setParams] = useSearchParams();
  const [from, setFrom] = useState(params.get('from') ?? '');
  const [to, setTo] = useState(params.get('to') ?? '');
  const [discounted, setDiscounted] = useState(false);

  const searchedFrom = params.get('from') ?? '';
  const searchedTo = params.get('to') ?? '';
  const searched = searchedFrom !== '' && searchedTo !== '';
  const canSearch = from.trim() !== '' && to.trim() !== '';

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (canSearch) setParams({ from: from.trim(), to: to.trim() }, { replace: true });
  }

  return (
    <Page>
      <div className="split">
        <form className="card stack" onSubmit={onSubmit}>
          <TextField
            label="Saan ka manggagaling?"
            placeholder="From"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
          <button
            type="button"
            className="icon-button swap-inline"
            aria-label="Palitan ang From at To"
            onClick={() => {
              setFrom(to);
              setTo(from);
            }}
          >
            <ArrowLeftRight size={18} aria-hidden />
          </button>
          <TextField
            label="Saan ka pupunta?"
            placeholder="To"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
          <Checkbox label="Student / Senior / PWD" checked={discounted} onChange={setDiscounted} />
          <button type="submit" className="button button-primary" disabled={!canSearch}>
            <Search size={18} aria-hidden />
            Hanap Ruta
          </button>
        </form>

        <div className="stack">
          {searched ? (
            <>
              <p className="result-summary">
                {searchedFrom} → {searchedTo}
                {discounted ? ' · Student / Senior / PWD' : ''}
              </p>
              <EmptyState
                icon={<Route size={28} />}
                title="Wala pang available na ruta."
                message="Magdagdag ng verified fare data para lumabas dito."
              />
            </>
          ) : (
            <EmptyState
              icon={<Search size={28} />}
              title="Hanapin ang iyong biyahe"
              message="Ilagay kung saan ka manggagaling at pupunta."
            />
          )}
          <FareDisclaimer />
        </div>
      </div>
    </Page>
  );
}
