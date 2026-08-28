'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, QrCode, Leaf, BarChart3, Home, ChevronRight, TrendingDown, ArrowRight, Sparkles, Zap } from 'lucide-react';
import { CATEGORIES, PRODUCTS, RATING_CONFIG, calcCostPerMonth, TARIFF_BY_STATE } from '@/lib/data';
import { Header } from '@/app/components/Header';
import { CategoryIcon } from '@/app/components/CategoryIcon';
import { ProductImage } from '@/app/components/ProductImage';

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const tariff = TARIFF_BY_STATE['SP'].tariff;

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) router.push(`/busca?q=${encodeURIComponent(query)}`);
  }

  const featuredProducts = PRODUCTS.slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50/50 via-slate-50/50 to-emerald-50/40 flex flex-col">
      <Header />

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 pt-16 pb-12 text-center">

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 tracking-tight mb-5 leading-tight">
          Descubra quanto seu aparelho<br />
          <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent">
            gasta em R$/mês
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Busque eletrodomésticos, escaneie a etiqueta via <strong className="text-violet-700">QR Code</strong> e compare o custo real da sua energia com precisão tarifária.
        </p>

        {/* Search & QR Actions */}
        <div className="max-w-2xl mx-auto mb-8 space-y-3">
          <form onSubmit={handleSearch} className="flex gap-2 p-1.5 bg-white rounded-2xl shadow-lg shadow-violet-500/5 border border-violet-100/80">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-400" size={20} />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Busque por geladeira, ar-condicionado, TV, chuveiro..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border-0 bg-transparent focus:outline-none text-gray-800 text-sm sm:text-base placeholder:text-gray-400"
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-7 py-3.5 rounded-xl font-bold shadow-md shadow-violet-500/20 transition-all text-sm sm:text-base whitespace-nowrap"
            >
              Buscar
            </button>
          </form>

          {/* Botão de QR Code com Estilo Roxo & Esmeralda */}
          <div className="flex justify-center">
            <button
              onClick={() => router.push('/qrcode')}
              className="inline-flex items-center gap-2.5 bg-white hover:bg-violet-50/80 border border-violet-200 text-violet-700 font-bold px-5 py-2.5 rounded-full text-xs sm:text-sm transition-all shadow-xs hover:shadow-sm"
            >
              <div className="w-5 h-5 rounded-md bg-violet-100 text-violet-700 flex items-center justify-center">
                <QrCode size={13} />
              </div>
              <span>Escanear Etiqueta do Aparelho via QR Code</span>
              <ArrowRight size={14} className="text-violet-500" />
            </button>
          </div>
        </div>

        {/* Categories (Sem Emojis, com acentos de cores modernas) */}
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => router.push(`/busca?cat=${cat.id}`)}
              className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-xs border border-gray-200 hover:border-violet-300 hover:bg-violet-50/50 px-4 py-2 rounded-full text-xs font-semibold text-gray-700 hover:text-violet-800 transition-all shadow-2xs"
            >
              <CategoryIcon category={cat.id} size={15} />
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Products com Imagens Reais via URL */}
      <section className="max-w-6xl mx-auto px-4 py-12 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
              <span>Aparelhos em Destaque</span>
              <span className="w-2 h-2 rounded-full bg-violet-600" />
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Modelos com classificação energética testada pelo INMETRO</p>
          </div>
          <button
            onClick={() => router.push('/busca')}
            className="text-xs font-bold text-violet-700 hover:text-violet-800 flex items-center gap-1"
          >
            Ver todos <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredProducts.map(p => {
            const cost = calcCostPerMonth(p.consumptionKwhMonth, tariff);
            const ratingCfg = RATING_CONFIG[p.rating];
            return (
              <div
                key={p.id}
                onClick={() => router.push(`/produto/${p.id}`)}
                className="bg-white rounded-3xl border border-gray-200/80 hover:border-violet-300 hover:shadow-xl hover:shadow-violet-500/5 transition-all cursor-pointer flex flex-col group overflow-hidden"
              >
                <div className="relative h-44 bg-slate-50 overflow-hidden">
                  <ProductImage
                    src={p.imageUrl}
                    alt={p.name}
                    category={p.category}
                    containerClassName="w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`${ratingCfg.bg} ${ratingCfg.color} text-xs font-black px-2.5 py-0.5 rounded-lg shadow-sm`}>
                      Classe {p.rating}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-violet-600 uppercase tracking-wider">{p.brand}</span>
                    <h3 className="font-bold text-gray-900 text-sm line-clamp-1 group-hover:text-violet-700 transition-colors mt-0.5">
                      {p.name}
                    </h3>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 font-medium block">Custo estimado</span>
                      <span className="text-sm font-extrabold text-emerald-700">R$ {cost.toFixed(2)}/mês</span>
                    </div>
                    <span className="text-[11px] text-gray-500 font-semibold bg-gray-50 px-2 py-0.5 rounded-md">
                      {p.consumptionKwhMonth} kWh
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stats com Nova Paleta Roxo & Esmeralda */}
      <section className="bg-white border-y border-violet-100/60 py-14">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-4">
              <div className="text-4xl font-black bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                R$ 18 bi
              </div>
              <div className="text-gray-600 text-sm font-medium">desperdiçados por ano com eletrodomésticos ineficientes no Brasil</div>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl font-black text-emerald-600 mb-2">
                40%
              </div>
              <div className="text-gray-600 text-sm font-medium">de diferença no consumo elétrico entre classe C e classe A</div>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent mb-2">
                2 TWh
              </div>
              <div className="text-gray-600 text-sm font-medium">de economia potencial se 1% das casas trocassem 1 aparelho antigo</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center max-w-lg mx-auto mb-12">
          <span className="text-xs font-bold text-violet-600 uppercase tracking-wider">Metodologia</span>
          <h2 className="text-2xl font-black text-gray-900 mt-1">Como o Watt Next? Funciona</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              icon: <QrCode size={26} className="text-violet-600" />, 
              bg: 'bg-violet-50 border-violet-100',
              title: 'Escaneie ou Busque', 
              desc: 'Pesquise pelo modelo ou aponte a câmera para ler o QR Code da etiqueta PBE/INMETRO em segundos.' 
            },
            { 
              icon: <BarChart3 size={26} className="text-emerald-600" />, 
              bg: 'bg-emerald-50 border-emerald-100',
              title: 'Cálculo Tarifário Real', 
              desc: 'Calculamos em reais o custo mensal com base na sua distribuidora estadual e na bandeira tarifária atual.' 
            },
            { 
              icon: <TrendingDown size={26} className="text-indigo-600" />, 
              bg: 'bg-indigo-50 border-indigo-100',
              title: 'Economia & Payback', 
              desc: 'Compare aparelhos lado a lado e calcule exatamente em quantos meses o investimento se paga.' 
            },
          ].map((f, i) => (
            <div key={i} className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-xs hover:shadow-md transition-all text-center">
              <div className={`w-14 h-14 rounded-2xl ${f.bg} border flex items-center justify-center mx-auto mb-5`}>
                {f.icon}
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-base">{f.title}</h3>
              <p className="text-gray-600 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Minha Casa com Gradiente Roxo / Deep Indigo */}
      <section className="bg-gradient-to-r from-violet-950 via-purple-900 to-indigo-950 py-16 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md border border-white/20">
            <Home className="text-emerald-400" size={30} />
          </div>
          <h2 className="text-3xl font-black mb-3">Minha Casa Energética</h2>
          <p className="text-violet-100 max-w-xl mx-auto mb-8 text-sm sm:text-base leading-relaxed">
            Cadastre todos os aparelhos do seu imóvel e faça o cruzamento automático com a sua conta de luz para identificar desvios e aparelhos vilões.
          </p>
          <button
            onClick={() => router.push('/minha-casa')}
            className="bg-white text-violet-950 hover:bg-violet-50 font-extrabold px-8 py-3.5 rounded-xl inline-flex items-center gap-2 shadow-lg shadow-black/20 transition-all text-sm"
          >
            <span>Analisar Minha Casa</span>
            <ChevronRight size={18} className="text-violet-600" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-gray-400 py-8 text-xs mt-auto border-t border-slate-900">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-violet-500" />
            <span className="font-bold text-gray-200">Watt Next?</span>
            <span>— Tech SaaS Hold'em 2026</span>
          </div>
          <div className="text-gray-500">
            Dados certificados: INMETRO / PBE · ANEEL · PROCEL
          </div>
        </div>
      </footer>
    </div>
  );
}
