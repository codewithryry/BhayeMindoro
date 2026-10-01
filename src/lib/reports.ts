import type { ReportInsert } from '../types/database';
import { getSupabase } from './supabase';

export const MAX_REPORT_DESCRIPTION_LENGTH = 2000;

export class ReportUnavailableError extends Error {}

/**
 * Submits an anonymous report. Insert-only: RLS forbids reading reports back,
 * so no `.select()` is chained here.
 */
export async function submitReport(report: ReportInsert): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) {
    throw new ReportUnavailableError('Supabase is not configured.');
  }
  const description = report.description?.trim() || null;
  if (description && description.length > MAX_REPORT_DESCRIPTION_LENGTH) {
    throw new Error('Masyadong mahaba ang description.');
  }
  const { error } = await supabase.from('reports').insert({ ...report, description });
  if (error) {
    throw new Error(error.message);
  }
}
