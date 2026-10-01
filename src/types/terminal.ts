import type { TerminalRow } from './database';

export type Terminal = Pick<
  TerminalRow,
  'id' | 'name' | 'municipality_id' | 'address' | 'latitude' | 'longitude' | 'description'
>;
