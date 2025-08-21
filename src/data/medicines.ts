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
  availability: 'In Stock' | 'Low Stock' | 'Out of Stock';
  prescription: boolean;
  imageUrl: string;
  uses: string[];
  sideEffects: string[];
  contraindications: string[];
}

export const categories = [
  { id: 'antibiotics', name: 'Antibiotics', icon: '💊' },
  { id: 'painkillers', name: 'Pain Relief', icon: '🩹' },
  { id: 'vitamins', name: 'Vitamins & Supplements', icon: '🌟' },
  { id: 'cardiac', name: 'Cardiac Care', icon: '❤️' },
  { id: 'respiratory', name: 'Respiratory', icon: '🫁' },
  { id: 'diabetes', name: 'Diabetes Care', icon: '🩺' },
  { id: 'digestive', name: 'Digestive Health', icon: '🥗' },
  { id: 'skincare', name: 'Dermatology', icon: '🧴' },
];

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
  {
    id: '2',
    name: 'Ibuprofen',
    genericName: 'Ibuprofen',
    brand: 'Advil',
    category: 'painkillers',
    manufacturer: 'MediPharm',
    description: 'Nonsteroidal anti-inflammatory drug (NSAID) for pain relief, fever reduction, and inflammation control.',
    dosage: '400mg',
    form: 'Tablet',
    price: 12.50,
    stock: 200,
    availability: 'In Stock',
    prescription: false,
    imageUrl: '/src/assets/medicine-generic.jpg',
    uses: ['Pain relief', 'Fever reduction', 'Inflammation', 'Headaches', 'Muscle pain'],
    sideEffects: ['Stomach irritation', 'Nausea', 'Dizziness', 'Heartburn'],
    contraindications: ['Stomach ulcers', 'Severe heart disease', 'Kidney problems']
  },
  {
    id: '3',
    name: 'Vitamin D3',
    genericName: 'Cholecalciferol',
    brand: 'VitaPlus',
    category: 'vitamins',
    manufacturer: 'HealthSupplements Inc.',
    description: 'Essential vitamin for bone health, immune system support, and calcium absorption.',
    dosage: '1000 IU',
    form: 'Softgel',
    price: 18.75,
    stock: 85,
    availability: 'In Stock',
    prescription: false,
    imageUrl: '/src/assets/medicine-generic.jpg',
    uses: ['Bone health', 'Immune support', 'Calcium absorption', 'Vitamin D deficiency'],
    sideEffects: ['Constipation', 'Kidney stones (high doses)', 'Nausea'],
    contraindications: ['Hypercalcemia', 'Kidney stones', 'Sarcoidosis']
  },
  {
    id: '4',
    name: 'Lisinopril',
    genericName: 'Lisinopril',
    brand: 'Prinivil',
    category: 'cardiac',
    manufacturer: 'CardioMed',
    description: 'ACE inhibitor used to treat high blood pressure and heart failure.',
    dosage: '10mg',
    form: 'Tablet',
    price: 32.40,
    stock: 75,
    availability: 'In Stock',
    prescription: true,
    imageUrl: '/src/assets/medicine-generic.jpg',
    uses: ['High blood pressure', 'Heart failure', 'Post-heart attack care'],
    sideEffects: ['Dry cough', 'Dizziness', 'Fatigue', 'Headache'],
    contraindications: ['Angioedema history', 'Pregnancy', 'Bilateral renal artery stenosis']
  },
  {
    id: '5',
    name: 'Albuterol Inhaler',
    genericName: 'Albuterol Sulfate',
    brand: 'ProAir',
    category: 'respiratory',
    manufacturer: 'RespiCare',
    description: 'Fast-acting bronchodilator for quick relief of asthma and COPD symptoms.',
    dosage: '90mcg/puff',
    form: 'Inhaler',
    price: 45.60,
    stock: 30,
    availability: 'Low Stock',
    prescription: true,
    imageUrl: '/src/assets/medicine-generic.jpg',
    uses: ['Asthma', 'COPD', 'Bronchospasm', 'Exercise-induced bronchospasm'],
    sideEffects: ['Tremor', 'Nervousness', 'Headache', 'Throat irritation'],
    contraindications: ['Hypersensitivity to albuterol', 'Severe heart conditions']
  },
  {
    id: '6',
    name: 'Metformin',
    genericName: 'Metformin Hydrochloride',
    brand: 'Glucophage',
    category: 'diabetes',
    manufacturer: 'DiabeteCare',
    description: 'First-line medication for type 2 diabetes management and blood sugar control.',
    dosage: '850mg',
    form: 'Extended Release Tablet',
    price: 28.90,
    stock: 120,
    availability: 'In Stock',
    prescription: true,
    imageUrl: '/src/assets/medicine-generic.jpg',
    uses: ['Type 2 diabetes', 'Blood sugar control', 'Insulin resistance'],
    sideEffects: ['Nausea', 'Diarrhea', 'Metallic taste', 'Stomach upset'],
    contraindications: ['Severe kidney disease', 'Lactic acidosis risk', 'Severe heart failure']
  },
  {
    id: '7',
    name: 'Omeprazole',
    genericName: 'Omeprazole',
    brand: 'Prilosec',
    category: 'digestive',
    manufacturer: 'GastroMed',
    description: 'Proton pump inhibitor for treating acid reflux, GERD, and stomach ulcers.',
    dosage: '20mg',
    form: 'Delayed Release Capsule',
    price: 22.35,
    stock: 95,
    availability: 'In Stock',
    prescription: false,
    imageUrl: '/src/assets/medicine-generic.jpg',
    uses: ['Acid reflux', 'GERD', 'Stomach ulcers', 'Heartburn'],
    sideEffects: ['Headache', 'Nausea', 'Diarrhea', 'Stomach pain'],
    contraindications: ['Hypersensitivity to omeprazole', 'Severe liver disease']
  },
  {
    id: '8',
    name: 'Hydrocortisone Cream',
    genericName: 'Hydrocortisone',
    brand: 'CortAid',
    category: 'skincare',
    manufacturer: 'DermaPharm',
    description: 'Topical corticosteroid for treating skin inflammation, itching, and minor skin irritations.',
    dosage: '1%',
    form: 'Topical Cream',
    price: 15.20,
    stock: 60,
    availability: 'In Stock',
    prescription: false,
    imageUrl: '/src/assets/medicine-generic.jpg',
    uses: ['Skin inflammation', 'Eczema', 'Allergic reactions', 'Insect bites', 'Rashes'],
    sideEffects: ['Skin thinning', 'Burning sensation', 'Irritation', 'Dryness'],
    contraindications: ['Viral skin infections', 'Fungal infections', 'Bacterial skin infections']
  },
  {
    id: '9',
    name: 'Acetaminophen',
    genericName: 'Acetaminophen',
    brand: 'Tylenol',
    category: 'painkillers',
    manufacturer: 'PainRelief Corp',
    description: 'Safe and effective pain reliever and fever reducer suitable for all ages.',
    dosage: '325mg',
    form: 'Tablet',
    price: 9.99,
    stock: 180,
    availability: 'In Stock',
    prescription: false,
    imageUrl: '/src/assets/medicine-generic.jpg',
    uses: ['Pain relief', 'Fever reduction', 'Headaches', 'Minor aches'],
    sideEffects: ['Rare: liver damage with overdose', 'Allergic reactions'],
    contraindications: ['Severe liver disease', 'Alcohol dependency']
  },
  {
    id: '10',
    name: 'Multivitamin Complex',
    genericName: 'Multivitamin and Mineral Supplement',
    brand: 'VitaComplete',
    category: 'vitamins',
    manufacturer: 'NutriHealth',
    description: 'Comprehensive daily vitamin and mineral supplement for overall health and wellness.',
    dosage: 'One Daily',
    form: 'Tablet',
    price: 25.50,
    stock: 140,
    availability: 'In Stock',
    prescription: false,
    imageUrl: '/src/assets/medicine-generic.jpg',
    uses: ['Nutritional support', 'Energy boost', 'Immune system', 'Overall wellness'],
    sideEffects: ['Upset stomach if taken on empty stomach', 'Mild nausea'],
    contraindications: ['Iron overload conditions', 'Hypervitaminosis']
  }
];