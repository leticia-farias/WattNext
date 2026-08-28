'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Award, ArrowRight } from 'lucide-react';
import { PRODUCTS, RATING_CONFIG, TARIFF_BY_STATE, calcCostPerMonth, calcCO2 } from '@/lib/data';
import { Header } from '@/app/components/Header';
import { ProductImage } from '@/app/components/ProductImage';

function CompararContent() {
  const params = useSearchParams();
  const router = useRouter();
  const aId = params.get('a');
  const bId = params.get('b');

  const productA = PRODUCTS.find(p => p.id === aId);
  const productB = PRODUCTS.find(p => p.id === bId);
  const tariff = TARIFF_BY_STATE['SP'].tariff;

  if (!productA || !productB) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <div className="max-w-md mx-auto p-12 text-center my-auto">
          <p className="text-gray-600 mb-4 text-sm font-medium">Selecione dois aparelhos para comparar.</p>
          <button
            onClick={() => router.push('/busca')}
            className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-violet-500/20"
          >
            Ir para a busca
          </button>
        </div>
      </div>
    );
  }

  const costA = calcCostPerMonth(productA.consumptionKwhMonth, tariff);
  const costB = calcCostPerMonth(productB.consumptionKwhMonth, tariff);
  const co2A = calcCO2(productA.consumptionKwhMonth);
  const co2B = calcCO2(productB.consumptionKwhMonth);
  const ratingOrder: Record<string, number> = { A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7 };
  const aWins = ratingOrder[productA.rating] < ratingOrder[productB.rating];
  const winner = aWins ? productA : productB;
  const savingMonthly = Math.abs(costA - costB);
  const savingYearly = savingMonthly * 12;

  const rows = [
    {
      label: 'Classificação ENCE',
      a: (
        <span className={`${RATING_CONFIG[productA.rating].bg} ${RATING_CONFIG[productA.rating].color} px-3 py-1 rounded-md font-bold text-xs`}>
          Classe {productA.rating}
        </span>
      ),
      b: (
        <span className={`${RATING_CONFIG[productB.rating].bg} ${RATING_CONFIG[productB.rating].color} px-3 py-1 rounded-md font-bold text-xs`}>
          Classe {productB.rating}
        </span>
      ),
      betterA: ratingOrder[productA.rating] < ratingOrder[productB.rating],
    },
    {
      label: 'Consumo mensal',
      a: `${productA.consumptionKwhMonth} kWh`,
      b: `${productB.consumptionKwhMonth} kWh`,
      betterA: productA.consumptionKwhMonth < productB.consumptionKwhMonth,
    },
    {
      label: 'Custo mensal estimado (SP)',
      a: `R$ ${costA.toFixed(2)}`,
      b: `R$ ${costB.toFixed(2)}`,
      betterA: costA < costB,
    },
    {
      label: 'Custo anual projetado',
      a: `R$ ${(costA * 12).toFixed(0)}`,
      b: `R$ ${(costB * 12).toFixed(0)}`,
      betterA: costA < costB,
    },
    {
      label: 'Emissão de CO₂ mensal',
      a: `${co2A.toFixed(1)} kg`,
      b: `${co2B.toFixed(1)} kg`,
      betterA: co2A < co2B,
    },
    {
      label: 'Potência em Watts',
      a: `${productA.powerWatts}W`,
      b: `${productB.powerWatts}W`,
      betterA: productA.powerWatts < productB.powerWatts,
    },
    {
      label: 'Vida útil estimada',
      a: productA.lifespan,
      b: productB.lifespan,
      betterA: null,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-8 flex-1 w-full">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-violet-700 mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Voltar</span>
        </button>

        {/* Winner Banner com Gradiente Roxo / Deep Violet */}
        <div className="bg-gradient-to-r from-violet-900 via-indigo-900 to-purple-950 text-white rounded-3xl p-7 mb-8 text-center shadow-xl shadow-violet-950/15 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="inline-flex items-center gap-2 bg-white/10 text-emerald-300 border border-white/10 px-3.5 py-1 rounded-full text-xs font-bold mb-3 backdrop-blur-xs">
            <Award size={16} className="text-emerald-400" />
            <span>Vencedor em Eficiência Energética</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black">{winner.brand} — {winner.name}</h2>
          <p className="mt-2 text-violet-200 text-sm max-w-xl mx-auto">
            Proporciona uma economia direta de <strong className="text-emerald-300">R$ {savingMonthly.toFixed(2)} por mês</strong> (<strong className="text-emerald-300">R$ {savingYearly.toFixed(0)} por ano</strong>) com o mesmo padrão de uso.
          </p>
        </div>

        {/* Product Cards com Imagens via URL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {[productA, productB].map(p => (
            <div key={p.id} className="bg-white rounded-3xl p-5 border border-violet-100/70 shadow-xs flex items-center gap-4">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 border border-gray-100 shrink-0">
                <ProductImage
                  src={p.imageUrl}
                  alt={p.name}
                  category={p.category}
                  containerClassName="w-full h-full"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] text-violet-600 font-bold uppercase tracking-wider">{p.brand} · {p.model}</span>
                <h3 className="font-bold text-sm text-gray-900 truncate">{p.name}</h3>
                <button
                  onClick={() => router.push(`/produto/${p.id}`)}
                  className="mt-2 text-xs text-violet-700 hover:text-violet-900 font-bold inline-flex items-center gap-1"
                >
                  Ver ficha completa <ArrowRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-3xl shadow-xs border border-violet-100/80 overflow-hidden mb-8">
          <div className="grid grid-cols-3 gap-4 px-6 py-4 bg-slate-100/70 border-b border-slate-200 text-xs font-black text-slate-700 uppercase tracking-wider">
            <div>Critério</div>
            <div className="text-center text-violet-900">{productA.brand}</div>
            <div className="text-center text-violet-900">{productB.brand}</div>
          </div>
          {rows.map((row, i) => (
            <div
              key={i}
              className={`grid grid-cols-3 gap-4 px-6 py-4 items-center ${
                i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
              }`}
            >
              <div className="text-xs font-semibold text-gray-600">{row.label}</div>
              {[
                { val: row.a, better: row.betterA },
                { val: row.b, better: row.betterA === null ? null : !row.betterA },
              ].map((col, j) => (
                <div key={j} className="text-center flex items-center justify-center gap-2">
                  <span
                    className={`text-xs font-black ${
                      col.better === true
                        ? 'text-emerald-700'
                        : col.better === false
                        ? 'text-rose-600'
                        : 'text-gray-800'
                    }`}
                  >
                    {col.val}
                  </span>
                  {col.better === true && <CheckCircle size={14} className="text-emerald-600 shrink-0" />}
                  {col.better === false && <XCircle size={14} className="text-rose-400 shrink-0" />}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* ROI CTA com acentos Roxo & Esmeralda */}
        <div className="bg-gradient-to-r from-violet-50 via-purple-50 to-emerald-50 border border-violet-200/80 rounded-3xl p-7 text-center shadow-xs">
          <h3 className="font-black text-gray-900 mb-1 text-base">Quer saber em quantos meses essa troca se paga?</h3>
          <p className="text-xs text-gray-600 mb-4 max-w-md mx-auto">
            Informe o valor pago no aparelho novo e o simulador calcula o payback e as emissões de carbono evitadas.
          </p>
          <button
            onClick={() => router.push(`/roi?a=${productA.id}&b=${productB.id}`)}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-extrabold px-7 py-3 rounded-2xl text-xs shadow-md shadow-violet-500/20 transition-all"
          >
            Calcular Payback (ROI) da Troca
          </button>
        </div>
      </main>
    </div>
  );
}

export default function CompararPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-gray-500">Carregando comparação...</div>}>
      <CompararContent />
    </Suspense>
  );
}
