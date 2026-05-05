import { mockMedicationsCatalog } from '@/shared/services/demo';
import type { MedicationCatalogItem } from '@/shared/types/domain';

/**
 * Búsqueda local en el catálogo. Sin red.
 */
export const searchMedicationsCatalog = (
  query: string,
): MedicationCatalogItem[] => {
  const q = query.trim().toLowerCase();
  if (!q) return mockMedicationsCatalog;
  return mockMedicationsCatalog.filter(
    (m) =>
      m.name.toLowerCase().includes(q) ||
      m.substance.toLowerCase().includes(q),
  );
};
