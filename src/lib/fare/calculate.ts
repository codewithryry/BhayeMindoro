import { SPECIAL_DISCOUNT_RATE } from '../../constants/config';
import type { DiscountType } from '../../types/fare';

// All arithmetic is done in whole centavos to avoid floating-point drift
// (e.g. 0.1 + 0.2). Results are rounded half-up to the nearest centavo.

const DISCOUNT_PERCENT = Math.round(SPECIAL_DISCOUNT_RATE * 100);

export function isSpecialDiscount(discountType: DiscountType): boolean {
  return discountType !== 'regular';
}

function toCentavos(pesos: number): number {
  if (!Number.isFinite(pesos) || pesos < 0) {
    throw new RangeError(`Invalid fare: ${pesos}`);
  }
  // Fares are stored with 2 decimal places (numeric(10,2)), so rounding the
  // scaled value recovers the exact centavo amount.
  return Math.round(pesos * 100);
}

function toPesos(centavos: number): number {
  return centavos / 100;
}

/**
 * Fare payable for the given discount type.
 * Student, senior, and PWD passengers get the statutory 20% discount.
 *
 * calculateDiscountedFare(100, 'student') === 80
 */
export function calculateDiscountedFare(fare: number, discountType: DiscountType): number {
  const centavos = toCentavos(fare);
  if (!isSpecialDiscount(discountType)) {
    return toPesos(centavos);
  }
  const discounted = Math.round((centavos * (100 - DISCOUNT_PERCENT)) / 100);
  return toPesos(discounted);
}

/**
 * Fare payable using an officially published discounted fare when the source
 * provides one, otherwise the computed 20% discount.
 */
export function resolvePayableFare(
  regularFare: number,
  officialDiscountedFare: number | null,
  discountType: DiscountType,
): number {
  if (isSpecialDiscount(discountType) && officialDiscountedFare != null) {
    return toPesos(toCentavos(officialDiscountedFare));
  }
  return calculateDiscountedFare(regularFare, discountType);
}

/** "₱80.00" */
export function formatPeso(amount: number): string {
  const [whole, cents] = toPesos(toCentavos(amount)).toFixed(2).split('.');
  return `₱${whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${cents}`;
}
