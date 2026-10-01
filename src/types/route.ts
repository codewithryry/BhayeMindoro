import type { FareQuote } from './fare';
import type { TransportMode } from './database';

export type RouteSearch = {
  from: string;
  to: string;
  discounted: boolean;
};

export type RouteOption = {
  routeId: string;
  mode: TransportMode;
  originName: string;
  destinationName: string;
  /** Minutes; null when not yet verified. */
  estimatedTravelTime: number | null;
  terminalName: string | null;
  fare: FareQuote | null;
};
