export type DiscountType = 'regular' | 'student' | 'senior' | 'pwd';

/** Provenance every fare shown to users must carry. */
export type FareProvenance = {
  sourceName: string;
  /** ISO timestamp of the last verification of the source. */
  lastUpdated: string | null;
  /** ISO date (YYYY-MM-DD). */
  effectiveDate: string;
};

export type FareQuote = {
  regularFare: number;
  /** Fare the passenger pays for the selected discount type. */
  payableFare: number;
  discountType: DiscountType;
  currency: string;
  provenance: FareProvenance;
};
