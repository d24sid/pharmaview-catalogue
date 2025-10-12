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

/**
 * Smart, forgiving mapping from an arbitrary sheet row object
 * to a typed Medicine. Case/space/underscore insensitive header matching.
 *
 * `row` is expected to be an object where keys are header names and values are cell values,
 * e.g. { "Name": "Paracetamol", "price": "20", "uses": "fever, headache" }
 */
export function fromSheetRow(row: Record<string, any>): Medicine {
  const getKey = (wanted: string[]) => {
    const normalizedWanted = wanted.map(w => w.replace(/\s|_|-/g, '').toLowerCase());
    const keys = Object.keys(row || {});
    for (const k of keys) {
      const nk = k.replace(/\s|_|-/g, '').toLowerCase();
      if (normalizedWanted.includes(nk)) return k;
    }
    return undefined;
  };

  const get = (...candidates: string[]) => {
    const k = getKey(candidates);
    if (!k) return '';
    const v = row[k];
    return v === null || v === undefined ? '' : v;
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

  const name = String(get('name', 'medicine name', 'drug')).trim() || 'Unknown Medicine';
  const genericName = String(get('genericname', 'generic name', 'generic')).trim() || '';
  const brand = String(get('brand', 'company')).trim() || '';
  const category = String(get('category', 'therapeutic category')).trim() || 'Uncategorized';
  const manufacturer = String(get('manufacturer', 'maker')).trim() || '';
  const description = String(get('description', 'details', 'notes')).trim() || '';
  const dosage = String(get('dosage', 'strength')).trim() || '';
  const form = String(get('form', 'dosage form', 'type')).trim() || '';

  const price = parseNumber(get('price', 'cost', 'mrp'), 0);
  const stock = Math.max(0, parseInt(String(parseNumber(get('stock', 'quantity', 'available')) || 0), 10) || 0);

  const availabilityRaw = String(get('availability', 'status', 'stock status') || '').toLowerCase();
  let availability: Availability = 'In Stock';
  if (availabilityRaw.includes('low')) availability = 'Low Stock';
  else if (availabilityRaw.includes('out')) availability = 'Out of Stock';

  const presRaw = String(get('prescription', 'rx required', 'requires prescription', 'rx') || '').toLowerCase();
  const prescription = presRaw === '1' || presRaw === 'true' || presRaw === 'yes';

  const imageUrl = String(get('imageurl', 'image', 'photo', 'img') || '').trim() || undefined;

  const uses = splitList(get('uses', 'indications'));
  const sideEffects = splitList(get('sideeffects', 'side effects', 'adverse effects'));
  const contraindications = splitList(get('contraindications', 'contra indications', 'contraindication'));

  // Compose id: use explicit id column if present, otherwise stable fallback
  const idFromSheet = String(get('id', 'uid', 'code') || '').trim();
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

/**
 * A small in-memory mock dataset so UI works while sheet loads/falls back.
 * Keep this for local dev; remove or shrink for production.
 */
export const mockMedicines: Medicine[] = [
  {
    id: '1',
    name: 'Amoxicillin',
    genericName: 'Amoxicillin Trihydrate',
    brand: 'Amoxil',
    category: 'antibiotics',
    manufacturer: 'PharmaCorp',
    description: 'Broad-spectrum antibiotic used to treat various bacterial infections including respiratory tract, urinary tract, and skin infections.',
    dosage: '500mg',
    form: 'Capsule',
    price: 24.99,
    stock: 150,
    availability: 'In Stock',
    prescription: true,
    imageUrl: '/src/assets/medicine-generic.jpg',
    uses: ['Bacterial infections', 'Respiratory infections', 'Urinary tract infections', 'Skin infections'],
    sideEffects: ['Nausea', 'Diarrhea', 'Stomach upset', 'Headache'],
    contraindications: ['Penicillin allergy', 'Severe kidney disease']
  },
  // ... (keep your other mocks as-is)
];
