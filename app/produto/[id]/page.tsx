'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Zap, 
  Leaf, 
  Clock, 
  TrendingDown, 
  ShoppingCart, 
  QrCode, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';
import { PRODUCTS, RATING_CONFIG, TARIFF_BY_STATE, calcCostPerMonth, calcCO2, FLAG_COSTS, CURRENT_FLAG } from '@/lib/data';
import { Header } from '@/app/components/Header';
import { ProductImage } from '@/app/components/ProductImage';
import { ProductQrModal } from '@/app/components/ProductQrModal';

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const product = PRODUCTS.find(p => p.id === id);
  const tariff = TARIFF_BY_STATE['SP'].tariff;
  const flag = FLAG_COSTS[CURRENT_FLAG];

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <div className="max-w-md mx-auto p-12 text-center my-auto">
          <p className="text-gray-600 mb-4 text-sm font-medium">Produto não encontrado no banco de dados.</p>
          <button
            onClick={() => router.push('/busca')}
            className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-violet-500/20"
          >
            Voltar para a busca
          </button>
        </div>
      </div>
    );
  }

  const costMonth = calcCostPerMonth(product.consumptionKwhMonth, tariff);
  const costYear = costMonth * 12;
  const co2Month = calcCO2(product.consumptionKwhMonth);
  const rating = RATING_CONFIG[product.rating];

  // Sugestão de troca mais eficiente
  const betterOptions = PRODUCTS.filter(p =>
    p.category === product.category &&
    p.id !== product.id &&
    p.consumptionKwhMonth < product.consumptionKwhMonth
  ).slice(0, 2);

  const ratings: Array<'A'|'B'|'C'|'D'|'E'|'F'|'G'> = ['A','B','C','D','E','F','G'];

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8 flex-1 w-full">
        {/* Navigation Breadcrumb */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-violet-700 mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Voltar</span>
        </button>

        {/* Main Product Card */}
        <div className="bg-white rounded-3xl shadow-xs border border-violet-100/70 p-6 md:p-8 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-8">
            {/* Foto Real do Produto via URL */}
            <div className="md:col-span-5 rounded-2xl overflow-hidden border border-gray-100 bg-slate-50 shadow-inner h-64 flex items-center justify-center relative">
              <ProductImage
                src={product.imageUrl}
                alt={product.name}
                category={product.category}
                containerClassName="w-full h-full"
              />
              <div className="absolute top-3 left-3">
                <span className={`${rating.bg} ${rating.color} text-xs font-black px-3 py-1 rounded-lg shadow-md`}>
                  Classe {product.rating}
                </span>
              </div>
            </div>

            {/* Informações Básicas */}
            <div className="md:col-span-7 flex flex-col justify-between h-full">
              <div>
                <span className="text-xs font-bold text-violet-600 uppercase tracking-wider mb-1 block">
                  {product.brand} · Modelo {product.model}
                </span>
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mb-2">
                  {product.name}
                </h1>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  {product.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-2">
                <button
                  onClick={() => setIsQrModalOpen(true)}
                  className="inline-flex items-center gap-2 bg-violet-50 hover:bg-violet-100 text-violet-800 border border-violet-200 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  <QrCode size={16} className="text-violet-600" />
                  <span>Gerar / Ver QR Code</span>
                </button>
                <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3.5 py-2.5 rounded-xl text-xs font-semibold">
                  <Clock size={14} className="text-slate-500" />
                  <span>Vida útil: {product.lifespan}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ENCE Rating Bar */}
          <div className="mb-8 p-5 bg-slate-50/80 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-emerald-600" /> Classificação Energética (ENCE / INMETRO)
              </p>
              <span className="text-xs text-violet-700 font-bold">{rating.label}</span>
            </div>
            <div className="flex gap-1.5">
              {ratings.map(r => {
                const isCurrent = r === product.rating;
                return (
                  <div
                    key={r}
                    className={`flex-1 h-10 flex items-center justify-center text-xs font-black rounded-lg transition-all ${
                      isCurrent
                        ? `${RATING_CONFIG[r].bg} ${RATING_CONFIG[r].color} scale-105 shadow-md ring-2 ring-white`
                        : 'bg-gray-200 text-gray-400 opacity-60'
                    }`}
                  >
                    {r}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bandeira Tarifária */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl px-4 py-3 flex items-center gap-2.5 mb-6 text-xs text-amber-900">
            <div className={`w-3 h-3 rounded-full ${flag.color} shrink-0`} />
            <span>
              Bandeira tarifária vigente: <strong>{flag.label}</strong> (adicional de R$ {flag.extra.toFixed(5)}/kWh na tarifa)
            </span>
          </div>

          {/* Métricas Principais */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { 
                label: 'Consumo mensal', 
                value: `${product.consumptionKwhMonth} kWh`, 
                sub: `${product.powerWatts}W de potência`, 
                icon: <Zap className="text-amber-500" size={18} /> 
              },
              { 
                label: 'Custo mensal (SP)', 
                value: `R$ ${costMonth.toFixed(2)}`, 
                sub: 'tarifa CPFL/Enel SP', 
                icon: <span className="text-emerald-700 font-bold text-sm">R$</span> 
              },
              { 
                label: 'Custo anual projetado', 
                value: `R$ ${costYear.toFixed(0)}`, 
                sub: 'estimativa de 12 meses', 
                icon: <TrendingDown className="text-violet-600" size={18} /> 
              },
              { 
                label: 'Emissão de CO₂', 
                value: `${co2Month.toFixed(1)} kg`, 
                sub: 'por mês (fator ONS 2023)', 
                icon: <Leaf className="text-emerald-600" size={18} /> 
              },
            ].map((stat, i) => (
              <div key={i} className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100">
                <div className="flex items-center gap-1.5 mb-1.5">
                  {stat.icon}
                  <span className="text-[11px] font-medium text-gray-500">{stat.label}</span>
                </div>
                <div className="text-lg font-black text-gray-900">{stat.value}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">{stat.sub}</div>
              </div>
            ))}
          </div>

          {/* Ações */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => router.push('/minha-casa')}
              className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white py-3.5 rounded-2xl font-extrabold text-xs transition-all shadow-md shadow-violet-500/25 flex items-center justify-center gap-2"
            >
              <span>+ Adicionar à Minha Casa</span>
            </button>
            <button
              onClick={() => router.push(`/roi?b=${product.id}`)}
              className="border border-violet-300 text-violet-700 hover:bg-violet-50 py-3.5 px-5 rounded-2xl font-bold text-xs transition-colors"
            >
              Simular ROI da troca
            </button>
            {product.affiliateUrl && (
              <a
                href={product.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border border-gray-200 text-gray-700 px-5 py-3.5 rounded-2xl hover:bg-gray-50 text-xs font-bold transition-colors"
              >
                <ShoppingCart size={15} />
                <span>Ver Loja</span>
              </a>
            )}
          </div>
        </div>

        {/* Alternativas Mais Eficientes */}
        {betterOptions.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xs border border-violet-100/70 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown className="text-violet-600" size={20} />
              <h2 className="font-extrabold text-gray-900 text-base">Alternativas Mais Eficientes</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {betterOptions.map(alt => {
                const altCost = calcCostPerMonth(alt.consumptionKwhMonth, tariff);
                const saving = costMonth - altCost;
                return (
                  <div key={alt.id} className="border border-violet-100 bg-gradient-to-br from-violet-50/40 via-white to-emerald-50/30 rounded-2xl p-4 flex flex-col justify-between shadow-2xs">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-gray-200 shrink-0">
                        <ProductImage
                          src={alt.imageUrl}
                          alt={alt.name}
                          category={alt.category}
                          containerClassName="w-full h-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] text-violet-600 uppercase font-bold">{alt.brand}</span>
                        <h4 className="font-bold text-gray-900 text-xs truncate">{alt.name}</h4>
                        <span className={`inline-block mt-1 ${RATING_CONFIG[alt.rating].bg} ${RATING_CONFIG[alt.rating].color} text-[10px] font-bold px-1.5 py-0.5 rounded`}>
                          Classe {alt.rating}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-emerald-800 font-bold bg-emerald-100/70 p-2.5 rounded-xl mb-3 border border-emerald-200/50">
                      Economia: R$ {saving.toFixed(2)}/mês (R$ {(saving * 12).toFixed(0)}/ano)
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/comparar?a=${product.id}&b=${alt.id}`)}
                        className="flex-1 bg-white border border-violet-300 text-violet-700 hover:bg-violet-50 py-2 rounded-xl text-xs font-bold transition-colors"
                      >
                        Comparar
                      </button>
                      <button
                        onClick={() => router.push(`/produto/${alt.id}`)}
                        className="bg-violet-600 hover:bg-violet-700 text-white px-3 py-2 rounded-xl text-xs font-bold transition-colors shadow-sm shadow-violet-500/20"
                      >
                        Ver Ficha
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Modal de QR Code */}
      <ProductQrModal
        product={product}
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
      />
    </div>
  );
}
