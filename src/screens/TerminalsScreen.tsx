import { MapPin } from 'lucide-react';

import { EmptyState, Page } from '../components/ui';

export function TerminalsScreen() {
  return (
    <Page>
      <EmptyState
        icon={<MapPin size={28} />}
        title="Wala pang terminal data."
        message="Lalabas dito ang mga verified na terminal ng van, bus, jeep, at ferry."
      />
    </Page>
  );
}
