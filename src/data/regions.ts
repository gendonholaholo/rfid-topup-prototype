// ===========================================
// PERTAMINA REGIONS
// ===========================================

export interface PertaminaRegion {
  code: number;
  shortName: string;
  name: string;
  provinces: string[];
}

export const PERTAMINA_REGIONS: PertaminaRegion[] = [
  {
    code: 1,
    shortName: 'Sumbagut',
    name: 'Sumbagut',
    provinces: ['Aceh', 'Sumatera Utara', 'Riau', 'Kepulauan Riau'],
  },
  {
    code: 2,
    shortName: 'Sumbagsel',
    name: 'Sumbagsel',
    provinces: ['Sumatera Barat', 'Jambi', 'Sumatera Selatan', 'Bengkulu', 'Lampung', 'Bangka Belitung'],
  },
  {
    code: 3,
    shortName: 'Jakarta Banten',
    name: 'Jakarta Banten',
    provinces: ['DKI Jakarta', 'Banten'],
  },
  {
    code: 4,
    shortName: 'Jawa Bagian Barat',
    name: 'Jawa Bagian Barat',
    provinces: ['Jawa Barat'],
  },
  {
    code: 5,
    shortName: 'Jawa Bagian Tengah',
    name: 'Jawa Bagian Tengah',
    provinces: ['Jawa Tengah', 'DI Yogyakarta'],
  },
  {
    code: 6,
    shortName: 'Jatimbalinus',
    name: 'Jatimbalinus',
    provinces: ['Jawa Timur', 'Bali', 'Nusa Tenggara Barat', 'Nusa Tenggara Timur'],
  },
  {
    code: 7,
    shortName: 'Indonesia Bagian Timur',
    name: 'Indonesia Bagian Timur',
    provinces: ['Kalimantan', 'Sulawesi', 'Maluku', 'Papua'],
  },
];

export function getRegionByCode(code: number): PertaminaRegion | undefined {
  return PERTAMINA_REGIONS.find((r) => r.code === code);
}

export function getRegionName(code: number): string {
  return getRegionByCode(code)?.name || `Region ${code}`;
}
