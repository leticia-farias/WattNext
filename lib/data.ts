export type EnergyRating = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

export interface Product {
  id: string;
  name: string;
  brand: string;
  model: string;
  category: string;
  rating: EnergyRating;
  consumptionKwhMonth: number;
  powerWatts: number;
  price?: number;
  imageUrl: string;
  description: string;
  lifespan: string;
  affiliateUrl?: string;
}

export const TARIFF_BY_STATE: Record<string, { name: string; tariff: number }> = {
  SP: { name: 'CPFL/Enel SP', tariff: 0.76 },
  RJ: { name: 'Light/Enel RJ', tariff: 0.82 },
  MG: { name: 'CEMIG', tariff: 0.71 },
  RS: { name: 'CEEE/RGE', tariff: 0.78 },
  SC: { name: 'CELESC', tariff: 0.70 },
  PR: { name: 'COPEL', tariff: 0.68 },
  BA: { name: 'COELBA', tariff: 0.85 },
  PE: { name: 'CELPE', tariff: 0.87 },
  CE: { name: 'ENEL CE', tariff: 0.89 },
  GO: { name: 'CELG/Enel GO', tariff: 0.80 },
  DF: { name: 'CEB', tariff: 0.74 },
  AM: { name: 'Amazonas Energia', tariff: 0.92 },
};

export const FLAG_COSTS: Record<string, { label: string; extra: number; color: string }> = {
  green: { label: 'Verde', extra: 0, color: 'bg-green-500' },
  yellow: { label: 'Amarela', extra: 0.02074, color: 'bg-yellow-400' },
  red1: { label: 'Vermelha P1', extra: 0.04463, color: 'bg-red-500' },
  red2: { label: 'Vermelha P2', extra: 0.07877, color: 'bg-red-700' },
};

export const CURRENT_FLAG = 'yellow';

export const RATING_CONFIG: Record<EnergyRating, { color: string; bg: string; label: string; score: number }> = {
  A: { color: 'text-white', bg: 'bg-green-600', label: 'Excelente', score: 95 },
  B: { color: 'text-white', bg: 'bg-green-400', label: 'Muito Bom', score: 80 },
  C: { color: 'text-white', bg: 'bg-yellow-500', label: 'Bom', score: 65 },
  D: { color: 'text-white', bg: 'bg-orange-400', label: 'Regular', score: 50 },
  E: { color: 'text-white', bg: 'bg-orange-600', label: 'Ruim', score: 35 },
  F: { color: 'text-white', bg: 'bg-red-500', label: 'Muito Ruim', score: 20 },
  G: { color: 'text-white', bg: 'bg-red-700', label: 'Péssimo', score: 5 },
};

export const CATEGORIES = [
  { id: 'geladeira', label: 'Geladeiras', iconName: 'Refrigerator' },
  { id: 'ar_condicionado', label: 'Ar-condicionado', iconName: 'AirVent' },
  { id: 'tv', label: 'Televisores', iconName: 'Tv' },
  { id: 'maquina_lavar', label: 'Máq. de Lavar', iconName: 'WashingMachine' },
  { id: 'chuveiro', label: 'Chuveiros', iconName: 'ShowerHead' },
  { id: 'computador', label: 'Computadores', iconName: 'Laptop' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'brastemp-brm44',
    name: 'Geladeira Frost Free 375L',
    brand: 'Brastemp',
    model: 'BRM44HB',
    category: 'geladeira',
    rating: 'A',
    consumptionKwhMonth: 36,
    powerWatts: 50,
    price: 3299,
    imageUrl: '',
    description: 'Geladeira Frost Free com tecnologia inverter, eficiência máxima e controle de temperatura independente.',
    lifespan: '15–18 anos',
    affiliateUrl: 'https://mercadolivre.com.br',
  },
  {
    id: 'consul-crm44',
    name: 'Geladeira Frost Free 400L',
    brand: 'Consul',
    model: 'CRM44AB',
    category: 'geladeira',
    rating: 'B',
    consumptionKwhMonth: 45,
    powerWatts: 62,
    price: 2799,
    imageUrl: 'https://brastemp.vtexassets.com/arquivos/ids/282469-1600-auto/01_Brastemp_Geladeira_BRM46MB_Imagem_Frontal.webp?v=639102210037130000&quality=80&width=1000&aspect=true&format=webp',
    description: 'Geladeira duplex com prateleiras dobráveis e freezer espaçoso. Boa relação custo-benefício.',
    lifespan: '12–15 anos',
    affiliateUrl: 'https://mercadolivre.com.br',
  },
  {
    id: 'electrolux-antiga',
    name: 'Geladeira Frost Free 360L',
    brand: 'Electrolux',
    model: 'DF37A',
    category: 'geladeira',
    rating: 'C',
    consumptionKwhMonth: 62,
    powerWatts: 86,
    price: 1899,
    imageUrl: '',
    description: 'Modelo sem tecnologia inverter. Consumo significativamente maior em relação à classe A.',
    lifespan: '10–12 anos',
  },
  {
    id: 'lg-geladeira-velha',
    name: 'Geladeira Side by Side 550L',
    brand: 'LG',
    model: 'GC-B22FTQK',
    category: 'geladeira',
    rating: 'D',
    consumptionKwhMonth: 89,
    powerWatts: 124,
    price: 1200,
    imageUrl: 'https://brastemp.vtexassets.com/arquivos/ids/282469-1600-auto/01_Brastemp_Geladeira_BRM46MB_Imagem_Frontal.webp?v=639102210037130000&quality=80&width=1000&aspect=true&format=webp',
    description: 'Modelo side by side de geração anterior sem inverter, alto consumo energético contínuo.',
    lifespan: '8–10 anos',
  },
  {
    id: 'samsung-ar-9000',
    name: 'Ar-condicionado Split 12000 BTU',
    brand: 'Samsung',
    model: 'AR12BVHZCWKNAZ',
    category: 'ar_condicionado',
    rating: 'A',
    consumptionKwhMonth: 68,
    powerWatts: 944,
    price: 2799,
    imageUrl: '',
    description: 'Split inverter com Wi-Fi, compressor digital inverter e filtro autolimpante.',
    lifespan: '10–12 anos',
    affiliateUrl: 'https://mercadolivre.com.br',
  },
  {
    id: 'midea-ar-convencional',
    name: 'Ar-condicionado Split 12000 BTU',
    brand: 'Midea',
    model: 'MSS12HR',
    category: 'ar_condicionado',
    rating: 'C',
    consumptionKwhMonth: 112,
    powerWatts: 1556,
    price: 1799,
    imageUrl: '',
    description: 'Modelo convencional sem inverter com frequência fixa de operação.',
    lifespan: '8–10 anos',
  },
  {
    id: 'lg-tv-oled',
    name: 'Smart TV OLED 55" 4K',
    brand: 'LG',
    model: 'OLED55C3PSA',
    category: 'tv',
    rating: 'A',
    consumptionKwhMonth: 15,
    powerWatts: 21,
    price: 5499,
    imageUrl: '',
    description: 'OLED com processador α9, Dolby Vision e webOS. Ultra eficiente para o tamanho.',
    lifespan: '10–15 anos',
    affiliateUrl: 'https://mercadolivre.com.br',
  },
  {
    id: 'samsung-tv-qled',
    name: 'Smart TV QLED 55" 4K',
    brand: 'Samsung',
    model: 'QN55Q70CAGXZD',
    category: 'tv',
    rating: 'B',
    consumptionKwhMonth: 22,
    powerWatts: 31,
    price: 3799,
    imageUrl: '',
    description: 'QLED com Quantum Processor Lite 4K e Tizen OS atualizado.',
    lifespan: '10–12 anos',
  },
  {
    id: 'plasma-tv-antiga',
    name: 'TV Plasma 50" HD',
    brand: 'Panasonic',
    model: 'TC-P50S30B',
    category: 'tv',
    rating: 'E',
    consumptionKwhMonth: 78,
    powerWatts: 108,
    price: 500,
    imageUrl: '',
    description: 'TV Plasma de alta resolução e tecnologia obsoleta com altíssimo consumo energético.',
    lifespan: '5–8 anos',
  },
  {
    id: 'electrolux-lava',
    name: 'Máquina de Lavar 12kg',
    brand: 'Electrolux',
    model: 'LAC12',
    category: 'maquina_lavar',
    rating: 'A',
    consumptionKwhMonth: 8,
    powerWatts: 11,
    price: 2199,
    imageUrl: '',
    description: 'Motor inverter 12kg com múltiplos programas de lavagem econômica.',
    lifespan: '12–15 anos',
    affiliateUrl: 'https://mercadolivre.com.br',
  },
  {
    id: 'brastemp-lava-antiga',
    name: 'Máquina de Lavar 10kg',
    brand: 'Brastemp',
    model: 'BWC10AB',
    category: 'maquina_lavar',
    rating: 'C',
    consumptionKwhMonth: 18,
    powerWatts: 25,
    price: 1299,
    imageUrl: '',
    description: 'Lavadora sem motor inverter, com maior consumo de água e energia.',
    lifespan: '8–10 anos',
  },
  {
    id: 'lorenzetti-chuveiro',
    name: 'Chuveiro Elétrico Ultra Turbo',
    brand: 'Lorenzetti',
    model: 'Ultra Turbo',
    category: 'chuveiro',
    rating: 'D',
    consumptionKwhMonth: 110,
    powerWatts: 7500,
    price: 89,
    imageUrl: '',
    description: 'Chuveiro 7500W — um dos maiores consumidores de energia da residência.',
    lifespan: '5–8 anos',
  },
  {
    id: 'lorenzetti-chuveiro-eficiente',
    name: 'Chuveiro Elétrico Acqua Advanced',
    brand: 'Lorenzetti',
    model: 'Acqua Advanced',
    category: 'chuveiro',
    rating: 'B',
    consumptionKwhMonth: 73,
    powerWatts: 5500,
    price: 149,
    imageUrl: '',
    description: 'Chuveiro 5500W com resistência blindada de alta durabilidade e economia.',
    lifespan: '8–10 anos',
    affiliateUrl: 'https://mercadolivre.com.br',
  },
  {
    id: 'dell-notebook',
    name: 'Notebook Inspiron 15',
    brand: 'Dell',
    model: 'Inspiron 15 3000',
    category: 'computador',
    rating: 'A',
    consumptionKwhMonth: 12,
    powerWatts: 45,
    price: 2499,
    imageUrl: '',
    description: 'Notebook com processador de baixo consumo e bateria de longa duração.',
    lifespan: '5–7 anos',
    affiliateUrl: 'https://mercadolivre.com.br',
  },
  {
    id: 'pc-desktop-gamer',
    name: 'PC Desktop Gamer RTX 4070',
    brand: 'Pichau',
    model: 'Gamer Pro 4070',
    category: 'computador',
    rating: 'D',
    consumptionKwhMonth: 108,
    powerWatts: 500,
    price: 8999,
    imageUrl: '',
    description: 'PC desktop gamer de alta performance com placa RTX 4070. Alto consumo em carga.',
    lifespan: '5–8 anos',
  },
];

export function calcCostPerMonth(kwhMonth: number, tariff: number, flag: string = 'yellow'): number {
  const flagExtra = FLAG_COSTS[flag]?.extra ?? 0;
  return kwhMonth * (tariff + flagExtra);
}

export function calcCO2(kwhMonth: number): number {
  // fator de emissão médio BR: 0.0817 kgCO2/kWh (ONS 2023)
  return kwhMonth * 0.0817;
}

export function calcROI(oldProduct: Product, newProduct: Product, newPrice: number, tariff: number): {
  monthlySaving: number;
  paybackMonths: number;
  fiveYearSaving: number;
  co2Avoided5y: number;
} {
  const oldCost = calcCostPerMonth(oldProduct.consumptionKwhMonth, tariff);
  const newCost = calcCostPerMonth(newProduct.consumptionKwhMonth, tariff);
  const monthlySaving = oldCost - newCost;
  const paybackMonths = monthlySaving > 0 ? Math.ceil(newPrice / monthlySaving) : 9999;
  const fiveYearSaving = monthlySaving * 60 - newPrice;
  const co2Avoided5y = (oldProduct.consumptionKwhMonth - newProduct.consumptionKwhMonth) * 60 * 0.0817;
  return { monthlySaving, paybackMonths, fiveYearSaving, co2Avoided5y };
}
