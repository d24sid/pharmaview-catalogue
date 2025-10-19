// types.ts
export type Availability = 'In Stock' | 'Low Stock' | 'Out of Stock';

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  brand: string;
  category: string;
  manufacturer: string;
  description: string;
  dosage: string;
  form: string; // tablet, capsule, syrup, etc.
  price: number;
  stock: number;
  availability: Availability;
  prescription: boolean;
  imageUrl?: string; // optional — not every sheet row must have an image
  uses: string[];
  sideEffects: string[];
  contraindications: string[];

  // Extras: will hold any additional columns from the sheet not captured above.
  raw?: Record<string, any>;
}

/**
 * categories: kept as runtime data (for UI) and typed as well
 */
export const categories = [
  { id: 'antibiotics', name: 'Antibiotics', icon: '💊' },
  { id: 'painkillers', name: 'Pain Relief', icon: '🩹' },
  { id: 'vitamins', name: 'Vitamins & Supplements', icon: '🌟' },
  { id: 'cardiac', name: 'Cardiac Care', icon: '❤️' },
  { id: 'respiratory', name: 'Respiratory', icon: '🫁' },
  { id: 'diabetes', name: 'Diabetes Care', icon: '🩺' },
  { id: 'digestive', name: 'Digestive Health', icon: '🥗' },
  { id: 'skincare', name: 'Dermatology', icon: '🧴' },
] as const;

export type CategoryId = typeof categories[number]['id'];

/* ---------------------------
 * Sheet row conversion helpers
 * --------------------------- */

/**
 * Smart, forgiving mapping from an arbitrary sheet row object
 * to a typed Medicine. Case/space/underscore/extra-char insensitive header matching.
 *
 * `row` is expected to be an object where keys are header names and values are cell values,
 * e.g. { "Name": "Paracetamol", "price": "20", "uses": "fever, headache" }
 */
export function fromSheetRow(row: Record<string, any>): Medicine {
  // normalize any header/value: keep only alphanumeric, lowercase
  const normalize = (s: any) =>
    String(s ?? '')
      .replace(/[^a-z0-9]/gi, '') // remove everything except letters and digits
      .toLowerCase();

  const getKey = (wanted: string[]) => {
    const normalizedWanted = wanted.map(w => normalize(w));
    const keys = Object.keys(row || {});
    for (const k of keys) {
      const nk = normalize(k);
      if (normalizedWanted.includes(nk)) return k;
    }
    return undefined;
  };

  const get = (...candidates: string[]) => {
    const k = getKey(candidates);
    if (!k) return '';
    const v = row[k];
    return v === null || v === undefined ? '' : String(v).trim();
  };

  const parseNumber = (val: any, fallback = 0) => {
    if (typeof val === 'number') return val;
    const s = String(val || '').replace(/[^\d.-]/g, '');
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : fallback;
  };

  const splitList = (val: any): string[] => {
    if (!val) return [];
    if (Array.isArray(val)) return val.map(v => String(v).trim()).filter(Boolean);
    return String(val)
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
  };

  // --- Core field mapping ---
  const name = get('name', 'medicine name', 'drug', 'product name', 'productname', 'Product Name') || '';
  const genericName = get('genericname', 'generic name', 'generic') || '';
  const brand = get('brand', 'company', 'marketer') || '';
  const category = get('category', 'therapeutic category') || 'Uncategorized';
  const manufacturer = get('manufacturer', 'maker') || '';
  const description = get('description', 'details', 'notes') || '';
  const dosage = get('dosage', 'strength') || '';
  const form = get('form', 'dosage form', 'type') || '';

  const price = parseNumber(get('price', 'cost', 'mrp'), 0);
  const stock = Math.max(0, parseInt(String(parseNumber(get('stock', 'quantity', 'available') || 0)), 10) || 0);

  const availabilityRaw = (get('availability', 'status', 'stock status') || '').toLowerCase();
  let availability: Availability = 'In Stock';
  if (availabilityRaw.includes('low')) availability = 'Low Stock';
  else if (availabilityRaw.includes('out')) availability = 'Out of Stock';

  const presRaw = (get('prescription', 'rx required', 'requires prescription', 'rx') || '').toLowerCase();
  const prescription = presRaw === '1' || presRaw === 'true' || presRaw === 'yes' || presRaw === 'y';

  const imageUrl = (get('imageurl', 'image', 'photo', 'img') || '').trim() || undefined;

  const uses = splitList(get('uses', 'indications'));
  const sideEffects = splitList(get('sideeffects', 'side effects', 'adverse effects'));
  const contraindications = splitList(get('contraindications', 'contra indications', 'contraindication', 'contraindications', 'contrainDications'));

  // Compose id: use explicit id column if present, otherwise stable fallback
  const idFromSheet = (get('id', 'uid', 'code') || '').trim();
  const id = idFromSheet || `${name.replace(/\s+/g, '-').toLowerCase()}-${Math.random().toString(36).slice(2, 8)}`;

  // Keep original row so nothing is lost
  const raw = { ...row };

  return {
    id,
    name,
    genericName,
    brand,
    category,
    manufacturer,
    description,
    dosage,
    form,
    price,
    stock,
    availability,
    prescription,
    imageUrl,
    uses,
    sideEffects,
    contraindications,
    raw,
  };
}

/* -------------------------------------------------------
 * Google Visualization (gviz) response -> plain row objects
 * -------------------------------------------------------
 *
 * Accepts the object passed into google.visualization.Query.setResponse(...)
 * and converts it into an array of simple { header: value } objects.
 *
 * Notes:
 * - Uses 'f' (formatted value) if present, otherwise 'v' (raw value).
 * - Treats null cells as ''.
 * - Converts numeric cells' v to number, but if 'f' exists uses string from 'f'.
 */
export function gvizResponseToRows(gvizResponse: any): Record<string, any>[] {
  if (!gvizResponse || !gvizResponse.table) return [];

  const cols = gvizResponse.table.cols || [];
  const rows = gvizResponse.table.rows || [];

  // Build header labels: prefer the 'label' property, fallback to 'id' or index
  const headers = cols.map((c: any, idx: number) => {
    if (c && c.label) return String(c.label).trim();
    if (c && c.id) return String(c.id).trim();
    return `col${idx}`;
  });

  const result: Record<string, any>[] = [];

  for (const r of rows) {
    const cells = Array.isArray(r.c) ? r.c : [];
    const rowObj: Record<string, any> = {};

    for (let i = 0; i < headers.length; i++) {
      const header = headers[i] ?? `col${i}`;
      const cell = cells[i];

      if (!cell) {
        rowObj[header] = '';
        continue;
      }

      // Prefer formatted value 'f' if provided (user-facing string), else use 'v'
      if (cell.f !== undefined && cell.f !== null) {
        rowObj[header] = cell.f;
      } else {
        // If v is null/undefined, treat as empty string
        if (cell.v === null || cell.v === undefined) rowObj[header] = '';
        else rowObj[header] = cell.v;
      }
    }

    result.push(rowObj);
  }

  return result;
}

/**
 * Convenience: parse gviz response straight into Medicine[] using fromSheetRow
 */
export function medicinesFromGviz(gvizResponse: any): Medicine[] {
  const plainRows = gvizResponseToRows(gvizResponse);
  return plainRows.map(r => fromSheetRow(r));
}

