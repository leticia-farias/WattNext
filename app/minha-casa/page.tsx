'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Zap, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  Home, 
  TrendingUp
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { PRODUCTS, TARIFF_BY_STATE, calcCostPerMonth, calcCO2, RATING_CONFIG, FLAG_COSTS, CURRENT_FLAG } from '@/lib/data';
import { Header } from '@/app/components/Header';
import { ProductImage } from '@/app/components/ProductImage';

interface Appliance {
  id: string;
  productId: string;
  nickname: string;
  hoursPerDay: number;
}

// Cores refinadas com Roxo / Violeta em destaque
const COLORS = [
  '#7c3aed', // Violeta principal
  '#10b981', // Esmeralda
  '#6366f1', // Indigo
  '#06b6d4', // Ciano
  '#8b5cf6', // Roxo suave
  '#f59e0b', // Âmbar
  '#ec4899', // Rosa
  '#14b8a6', // Teal
  '#f97316', // Laranja
];

const ANOMALY_SUGGESTIONS = [
  'Borracha de vedação da geladeira desgastada (perda contínua de frio)',
  'Chuveiro elétrico com resistência parcialmente oxidada ou degradada',
  'Ar-condicionado com filtros sujos (compressor sob esforço contínuo)',
  'Aparelhos obsoletos em standby permanente (televisores antigos, decodificadores)',
  'Possível fuga de corrente no quadro elétrico (consulte um eletricista)',
  'Uso acima do padrão do ar-condicionado em horários de pico',
];

export default function MinhaCasaPage() {
  const router = useRouter();
  const [appliances, setAppliances] = useState<Appliance[]>([
    { id: '1', productId: 'brastemp-brm44', nickname: 'Geladeira da Cozinha', hoursPerDay: 24 },
    { id: '2', productId: 'samsung-ar-9000', nickname: 'Ar-cond. Quarto Principal', hoursPerDay: 8 },
    { id: '3', productId: 'samsung-tv-qled', nickname: 'TV da Sala', hoursPerDay: 5 },
    { id: '4', productId: 'lorenzetti-chuveiro', nickname: 'Chuveiro Banheiro Social', hoursPerDay: 1 },
  ]);
  const [realBillKwh, setRealBillKwh] = useState('');
  const [addProductId, setAddProductId] = useState('');
  const [addNickname, setAddNickname] = useState('');
  const [addHours, setAddHours] = useState('8');
  const [showAddForm, setShowAddForm] = useState(false);
  const uf = 'SP';
  const tariff = TARIFF_BY_STATE[uf].tariff;
  const flag = FLAG_COSTS[CURRENT_FLAG];

  const applianceData = useMemo(() => {
    return appliances.map(a => {
      const product = PRODUCTS.find(p => p.id === a.productId);
      if (!product) return null;
      const kwhMonth = (product.powerWatts * a.hoursPerDay * 30) / 1000;
      const costMonth = kwhMonth * (tariff + flag.extra);
      return { ...a, product, kwhMonth, costMonth };
    }).filter(Boolean) as Array<Appliance & { product: typeof PRODUCTS[0]; kwhMonth: number; costMonth: number }>;
  }, [appliances, tariff, flag]);

  const totalKwh = applianceData.reduce((s, a) => s + a.kwhMonth, 0);
  const totalCost = applianceData.reduce((s, a) => s + a.costMonth, 0);
  const totalCO2 = calcCO2(totalKwh);

  const pieData = applianceData.map(a => ({ name: a.nickname, value: parseFloat(a.kwhMonth.toFixed(1)) }));

  const variance = realBillKwh ? ((parseFloat(realBillKwh) - totalKwh) / totalKwh) * 100 : null;
  const isAnomaly = variance !== null && variance > 15;

  function removeAppliance(id: string) { 
    setAppliances(prev => prev.filter(a => a.id !== id)); 
  }

  function addAppliance() {
    if (!addProductId) return;
    setAppliances(prev => [...prev, {
      id: Date.now().toString(),
      productId: addProductId,
      nickname: addNickname || PRODUCTS.find(p => p.id === addProductId)?.name || 'Aparelho',
      hoursPerDay: parseInt(addHours) || 8,
    }]);
    setAddProductId('');
    setAddNickname('');
    setAddHours('8');
    setShowAddForm(false);
  }

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-8 flex-1 w-full">
        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-violet-700 mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Voltar para o Início</span>
        </button>

        <div className="mb-6">
          <h1 className="text-2xl font-black text-gray-900">Minha Casa Energética</h1>
          <p className="text-xs text-gray-500 mt-1">Gerencie os aparelhos da sua residência e faça o cruzamento com a conta de luz.</p>
        </div>

        {/* Total Cards com Roxo & Esmeralda */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { 
              label: 'Consumo total estimado', 
              value: `${totalKwh.toFixed(0)} kWh/mês`, 
              sub: `${applianceData.length} aparelhos cadastrados`, 
              icon: <Zap className="text-violet-600" size={22} />, 
              bg: 'bg-violet-50/70 border-violet-200/70' 
            },
            { 
              label: 'Custo mensal estimado', 
              value: `R$ ${totalCost.toFixed(2)}`, 
              sub: `Tarifa ${uf}: R$ ${tariff}/kWh + bandeira`, 
              icon: <span className="text-emerald-700 font-extrabold text-xl">R$</span>, 
              bg: 'bg-emerald-50/70 border-emerald-200/70' 
            },
            { 
              label: 'Emissão de CO₂', 
              value: `${totalCO2.toFixed(1)} kg/mês`, 
              sub: 'Fator ONS 2023: 0,0817 kgCO₂/kWh', 
              icon: <TrendingUp className="text-indigo-600" size={22} />, 
              bg: 'bg-indigo-50/70 border-indigo-200/70' 
            },
          ].map((card, i) => (
            <div key={i} className={`${card.bg} border rounded-3xl p-5 flex items-center gap-4 shadow-2xs`}>
              <div className="p-3 bg-white rounded-2xl shadow-xs shrink-0">{card.icon}</div>
              <div>
                <div className="text-xl font-black text-gray-900">{card.value}</div>
                <div className="text-[11px] text-gray-500 font-medium">{card.sub}</div>
                <div className="text-xs font-bold text-gray-700 mt-1">{card.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Pie Chart com cores roxas vibrantes */}
          <div className="bg-white rounded-3xl shadow-xs border border-violet-100/80 p-6">
            <h2 className="font-extrabold text-gray-900 text-sm mb-4">Divisão do Consumo (kWh/mês)</h2>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie 
                  data={pieData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={55} 
                  outerRadius={85} 
                  dataKey="value" 
                  label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`} 
                  labelLine={false}
                >
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => `${v} kWh/mês`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Appliance List com Thumbnails */}
          <div className="bg-white rounded-3xl shadow-xs border border-violet-100/80 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-extrabold text-gray-900 text-sm">Aparelhos Cadastrados</h2>
                <button 
                  onClick={() => setShowAddForm(v => !v)} 
                  className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors shadow-sm shadow-violet-500/20"
                >
                  <Plus size={14} /> Adicionar
                </button>
              </div>

              {showAddForm && (
                <div className="bg-slate-50 border border-violet-100 rounded-2xl p-4 mb-4 space-y-3">
                  <select 
                    value={addProductId} 
                    onChange={e => setAddProductId(e.target.value)} 
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs bg-white focus:ring-2 focus:ring-violet-500 focus:outline-none"
                  >
                    <option value="">Selecione o modelo do aparelho...</option>
                    {PRODUCTS.map(p => <option key={p.id} value={p.id}>{p.brand} — {p.name}</option>)}
                  </select>
                  <input 
                    value={addNickname} 
                    onChange={e => setAddNickname(e.target.value)} 
                    placeholder="Nome personalizado (ex: Geladeira Principal)" 
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs bg-white focus:ring-2 focus:ring-violet-500 focus:outline-none" 
                  />
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      value={addHours} 
                      onChange={e => setAddHours(e.target.value)} 
                      className="w-20 border border-gray-300 rounded-xl px-3 py-2 text-xs bg-white focus:ring-2 focus:ring-violet-500 focus:outline-none" 
                    />
                    <span className="text-xs text-gray-500 font-medium">horas de uso diário</span>
                  </div>
                  <button 
                    onClick={addAppliance} 
                    className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2.5 rounded-xl text-xs font-bold transition-colors shadow-xs"
                  >
                    Salvar Aparelho
                  </button>
                </div>
              )}

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {applianceData.map((a, i) => (
                  <div key={a.id} className="flex items-center gap-3 p-2.5 rounded-2xl border border-gray-100 hover:bg-violet-50/30 transition-colors">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-gray-200">
                      <ProductImage
                        src={a.product.imageUrl}
                        alt={a.nickname}
                        category={a.product.category}
                        containerClassName="w-full h-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">{a.nickname}</p>
                      <p className="text-[11px] text-gray-500 font-medium">{a.kwhMonth.toFixed(1)} kWh · R$ {a.costMonth.toFixed(2)}/mês</p>
                    </div>
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${RATING_CONFIG[a.product.rating].bg} ${RATING_CONFIG[a.product.rating].color}`}>
                      {a.product.rating}
                    </span>
                    <button 
                      onClick={() => removeAppliance(a.id)} 
                      className="text-gray-300 hover:text-rose-500 p-1 transition-colors"
                      aria-label="Remover"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Comparação com Conta Real */}
        <div className="bg-white rounded-3xl shadow-xs border border-violet-100/80 p-6 md:p-8">
          <div className="flex items-center gap-2 mb-1">
            <Home size={20} className="text-violet-600" />
            <h2 className="font-extrabold text-gray-900 text-base">Comparar com sua Conta de Luz Real</h2>
          </div>
          <p className="text-xs text-gray-500 mb-6">
            Informe os kWh descritos na sua fatura recente e a inteligência do Watt Next? analisa se há anomalia de consumo.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-end mb-6">
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-gray-700 mb-2">Consumo Faturado (kWh)</label>
              <input
                type="number"
                value={realBillKwh}
                onChange={e => setRealBillKwh(e.target.value)}
                placeholder={`Ex: ${Math.round(totalKwh * 1.2)}`}
                className="w-full border border-violet-200/80 rounded-2xl px-4 py-3 text-base bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3 text-center shrink-0 w-full sm:w-auto">
              <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Total Estimado</div>
              <div className="text-xl font-black text-gray-900">{totalKwh.toFixed(0)} kWh</div>
            </div>
          </div>

          {variance !== null && (
            <div className={`rounded-2xl p-5 border ${isAnomaly ? 'bg-rose-50/80 border-rose-200' : 'bg-emerald-50/80 border-emerald-200'}`}>
              <div className="flex items-start gap-3.5">
                {isAnomaly ? (
                  <AlertTriangle className="text-rose-500 shrink-0 mt-0.5" size={24} />
                ) : (
                  <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={24} />
                )}
                <div className="flex-1">
                  <h3 className={`font-bold text-sm mb-1 ${isAnomaly ? 'text-rose-900' : 'text-emerald-900'}`}>
                    {isAnomaly
                      ? `Atenção: Consumo ${variance.toFixed(0)}% acima do esperado`
                      : `Consumo Normal (${variance > 0 ? '+' : ''}${variance.toFixed(0)}% vs estimado)`
                    }
                  </h3>
                  <p className={`text-xs mb-3 leading-relaxed ${isAnomaly ? 'text-rose-700' : 'text-emerald-700'}`}>
                    {isAnomaly
                      ? 'Detectamos uma discrepância expressiva no seu consumo mensal. Principais hipóteses para verificação:'
                      : 'O montante cobrado na sua fatura condiz com a potência e tempo de uso dos aparelhos informados.'
                    }
                  </p>
                  {isAnomaly && (
                    <ul className="space-y-1.5 pt-1">
                      {ANOMALY_SUGGESTIONS.slice(0, 4).map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-rose-800">
                          <span className="text-rose-400 font-bold">•</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
