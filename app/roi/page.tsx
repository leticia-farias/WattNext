'use client';
import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Calculator, 
  TrendingUp, 
  Leaf, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';
import { PRODUCTS, TARIFF_BY_STATE, calcROI } from '@/lib/data';
import { Header } from '@/app/components/Header';
import { ProductImage } from '@/app/components/ProductImage';

function RoiContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [oldId, setOldId] = useState(params.get('a') || '');
  const [newId, setNewId] = useState(params.get('b') || '');
  const [newPrice, setNewPrice] = useState('2799');
  const [uf, setUf] = useState('SP');

  const oldProduct = PRODUCTS.find(p => p.id === oldId);
  const newProduct = PRODUCTS.find(p => p.id === newId);
  const tariff = TARIFF_BY_STATE[uf]?.tariff ?? 0.76;

  const result = oldProduct && newProduct && newProduct.consumptionKwhMonth < oldProduct.consumptionKwhMonth
    ? calcROI(oldProduct, newProduct, parseFloat(newPrice) || 0, tariff)
    : null;

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-8 flex-1 w-full">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-violet-700 mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Voltar</span>
        </button>

        <div className="bg-white rounded-3xl shadow-xs border border-violet-100/80 p-6 md:p-8 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-xl bg-violet-100 text-violet-700">
              <Calculator size={20} />
            </div>
            <h1 className="text-xl font-black text-gray-900">Calculadora de Payback (ROI)</h1>
          </div>
          <p className="text-xs text-gray-500 mb-8">
            Descubra em quantos meses a economia acumulada na conta de luz quita o investimento no aparelho mais eficiente.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                Aparelho Atual (Maior Consumo)
              </label>
              <select
                value={oldId}
                onChange={e => setOldId(e.target.value)}
                className="w-full border border-gray-300 rounded-2xl px-3.5 py-3 text-xs bg-white focus:ring-2 focus:ring-violet-500 focus:outline-none"
              >
                <option value="">Selecione o aparelho atual...</option>
                {PRODUCTS.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.brand} — {p.name} (Classe {p.rating}) · {p.consumptionKwhMonth} kWh/mês
                  </option>
                ))}
              </select>

              {oldProduct && (
                <div className="mt-3 flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-gray-200 shrink-0">
                    <ProductImage
                      src={oldProduct.imageUrl}
                      alt={oldProduct.name}
                      category={oldProduct.category}
                      containerClassName="w-full h-full"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-gray-900 truncate">{oldProduct.name}</div>
                    <div className="text-[11px] text-gray-500">{oldProduct.consumptionKwhMonth} kWh/mês</div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-600 inline-block" />
                Aparelho Novo (Alta Eficiência)
              </label>
              <select
                value={newId}
                onChange={e => setNewId(e.target.value)}
                className="w-full border border-gray-300 rounded-2xl px-3.5 py-3 text-xs bg-white focus:ring-2 focus:ring-violet-500 focus:outline-none"
              >
                <option value="">Selecione o modelo novo...</option>
                {PRODUCTS.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.brand} — {p.name} (Classe {p.rating}) · {p.consumptionKwhMonth} kWh/mês
                  </option>
                ))}
              </select>

              {newProduct && (
                <div className="mt-3 flex items-center gap-3 p-3 bg-violet-50/50 rounded-2xl border border-violet-100">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-gray-200 shrink-0">
                    <ProductImage
                      src={newProduct.imageUrl}
                      alt={newProduct.name}
                      category={newProduct.category}
                      containerClassName="w-full h-full"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-gray-900 truncate">{newProduct.name}</div>
                    <div className="text-[11px] text-violet-700 font-bold">{newProduct.consumptionKwhMonth} kWh/mês</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 flex items-center gap-1">
                <DollarSign size={14} className="text-violet-600" />
                <span>Preço do Aparelho Novo (R$)</span>
              </label>
              <input
                type="number"
                value={newPrice}
                onChange={e => setNewPrice(e.target.value)}
                className="w-full border border-gray-300 rounded-2xl px-3.5 py-3 text-xs bg-white focus:ring-2 focus:ring-violet-500 focus:outline-none"
                placeholder="Ex: 2799"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Estado / Distribuidora</label>
              <select
                value={uf}
                onChange={e => setUf(e.target.value)}
                className="w-full border border-gray-300 rounded-2xl px-3.5 py-3 text-xs bg-white focus:ring-2 focus:ring-violet-500 focus:outline-none"
              >
                {Object.entries(TARIFF_BY_STATE).map(([k, v]) => (
                  <option key={k} value={k}>
                    {k} — {v.name} (R$ {v.tariff}/kWh)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {result && result.monthlySaving > 0 ? (
            <div className="bg-gradient-to-br from-violet-50/80 via-purple-50/50 to-emerald-50/70 border border-violet-200 rounded-3xl p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h3 className="font-black text-gray-900 text-sm">Viabilidade e Retorno do Investimento</h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {[
                  { 
                    label: 'Economia Mensal', 
                    value: `R$ ${result.monthlySaving.toFixed(2)}`, 
                    icon: <DollarSign size={18} className="text-emerald-700" />,
                    border: 'border-emerald-100'
                  },
                  { 
                    label: 'Prazo Payback', 
                    value: result.paybackMonths >= 9999 ? 'N/A' : `${result.paybackMonths} meses`, 
                    icon: <Clock size={18} className="text-violet-600" />,
                    border: 'border-violet-100'
                  },
                  { 
                    label: 'Economia (5 anos)', 
                    value: `R$ ${result.fiveYearSaving.toFixed(0)}`, 
                    icon: <TrendingUp size={18} className="text-indigo-600" />,
                    border: 'border-indigo-100'
                  },
                  { 
                    label: 'CO₂ Evitado (5 anos)', 
                    value: `${result.co2Avoided5y.toFixed(0)} kg`, 
                    icon: <Leaf size={18} className="text-emerald-600" />,
                    border: 'border-emerald-100'
                  },
                ].map((stat, i) => (
                  <div key={i} className={`bg-white rounded-2xl p-3.5 text-center border ${stat.border} shadow-2xs`}>
                    <div className="flex justify-center mb-1.5">{stat.icon}</div>
                    <div className="text-sm font-black text-gray-900">{stat.value}</div>
                    <div className="text-[10px] text-gray-500 font-medium mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>

              {result.fiveYearSaving > 0 && (
                <div className="bg-white/90 rounded-2xl p-3 text-center border border-violet-200/60">
                  <p className="text-xs text-violet-950 font-bold">
                    Após o payback de {result.paybackMonths} meses, a economia líquida gerada para o seu bolso é de R$ {result.fiveYearSaving.toFixed(0)} nos primeiros 5 anos!
                  </p>
                </div>
              )}
            </div>
          ) : oldId && newId ? (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center text-amber-900 text-xs flex items-center justify-center gap-2 font-medium">
              <AlertCircle size={16} className="text-amber-600 shrink-0" />
              <span>O novo aparelho deve ter consumo elétrico menor que o modelo antigo para apurar o retorno financeiro.</span>
            </div>
          ) : (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-6 text-center text-gray-400 text-xs font-medium">
              Selecione o aparelho atual e o novo modelo acima para calcular a projeção de economia.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function RoiPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-gray-500">Carregando calculadora...</div>}>
      <RoiContent />
    </Suspense>
  );
}
