// Mirrors supabase/migrations. Regenerate with `npx supabase gen types typescript`
// once the schema grows; keep this file in sync with every migration.

export type TransportMode = 'van' | 'jeep' | 'bus' | 'tricycle' | 'ferry';

export type FareSourceType = 'LGU' | 'ordinance' | 'operator' | 'terminal' | 'field_verification';

export type ReportType = 'overcharging' | 'incorrect_info' | 'other';

export type ReportStatus = 'pending' | 'reviewing' | 'resolved' | 'dismissed';

type Timestamps = {
  created_at: string;
  updated_at: string;
};

export type MunicipalityRow = Timestamps & {
  id: string;
  name: string;
  province: string;
};

export type FareSourceRow = Timestamps & {
  id: string;
  name: string;
  source_type: FareSourceType;
  reference: string | null;
  last_verified_at: string | null;
};

export type TerminalRow = Timestamps & {
  id: string;
  name: string;
  municipality_id: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
};

export type RouteRow = Timestamps & {
  id: string;
  origin_municipality_id: string;
  destination_municipality_id: string;
  mode: TransportMode;
  /** Minutes. */
  estimated_travel_time: number | null;
  terminal_id: string | null;
  active: boolean;
};

export type FareRow = Timestamps & {
  id: string;
  route_id: string;
  regular_fare: number;
  /** Only set when the official source publishes its own discounted fare. */
  discounted_fare: number | null;
  currency: string;
  source_id: string;
  /** ISO date (YYYY-MM-DD). */
  effective_date: string;
};

export type TricycleFareRow = Timestamps & {
  id: string;
  municipality_id: string;
  origin: string;
  destination: string;
  regular_fare: number;
  special_fare: number | null;
  night_fare: number | null;
  ordinance_number: string | null;
  source_id: string;
  /** ISO date (YYYY-MM-DD). */
  effective_date: string;
};

export type ReportRow = {
  id: string;
  report_type: ReportType;
  municipality_id: string | null;
  route_id: string | null;
  description: string | null;
  reported_fare: number | null;
  expected_fare: number | null;
  created_at: string;
  status: ReportStatus;
};

/** Fields an anonymous client may send. Status/ids/timestamps are server-controlled. */
export type ReportInsert = Pick<ReportRow, 'report_type'> &
  Partial<
    Pick<
      ReportRow,
      'municipality_id' | 'route_id' | 'description' | 'reported_fare' | 'expected_fare'
    >
  >;

type ReadOnlyTable<Row> = {
  Row: Row;
  Insert: never;
  Update: never;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      municipalities: ReadOnlyTable<MunicipalityRow>;
      fare_sources: ReadOnlyTable<FareSourceRow>;
      terminals: ReadOnlyTable<TerminalRow>;
      routes: ReadOnlyTable<RouteRow>;
      fares: ReadOnlyTable<FareRow>;
      tricycle_fares: ReadOnlyTable<TricycleFareRow>;
      reports: {
        Row: ReportRow;
        Insert: ReportInsert;
        Update: never;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      transport_mode: TransportMode;
      fare_source_type: FareSourceType;
      report_type: ReportType;
      report_status: ReportStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};
