'use client';
import { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, QrCode, CheckCircle2, ArrowRight, Check } from 'lucide-react';
import { PRODUCTS, CATEGORIES, RATING_CONFIG, calcCostPerMonth, TARIFF_BY_STATE } from '@/lib/data';
import { Header } from '@/app/components/Header';
import { CategoryIcon } from '@/app/components/CategoryIcon';
import { ProductImage } from '@/app/components/ProductImage';

function BuscaContent() {
  const router = useRouter();
  const params = useSearchParams();
  const initialQ = params.get('q') || '';
  const initialCat = params.get('cat') || '';

  const [query, setQuery] = useState(initialQ);
  const [category, setCategory] = useState(initialCat);
  const [compareList, setCompareList] = useState<string[]>([]);
  const tariff = TARIFF_BY_STATE['SP'].tariff;

  const filtered = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchQ = !query || `${p.name} ${p.brand} ${p.model}`.toLowerCase().includes(query.toLowerCase());
      const matchCat = !category || p.category === category;
      return matchQ && matchCat;
    });
  }, [query, category]);

  function toggleCompare(id: string) {
    setCompareList(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 2 ? [...prev, id] : prev
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full">
        {/* Search Bar & QR Code button */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-violet-400" size={18} />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar por geladeira, marca ou modelo de aparelho..."
              className="w-full pl-10 pr-4 py-3 border border-violet-100 rounded-2xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-xs"
            />
          </div>
          <button
            onClick={() => router.push('/qrcode')}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm transition-all shadow-md shadow-violet-500/20"
          >
            <QrCode size={18} />
            <span>Escanear Etiqueta</span>
          </button>
        </div>

        {/* Categories (Com estilo refinado e acentos roxos) */}
        <div className="flex gap-2 flex-wrap mb-6">
          <button
            onClick={() => setCategory('')}
            className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
              !category
                ? 'bg-violet-600 text-white border-violet-600 shadow-sm shadow-violet-500/25'
                : 'bg-white text-gray-700 border-gray-200 hover:border-violet-300 hover:text-violet-700'
            }`}
          >
            Todos os Aparelhos
          </button>
          {CATEGORIES.map(cat => {
            const isSelected = category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                  isSelected
                    ? 'bg-violet-600 text-white border-violet-600 shadow-sm shadow-violet-500/25'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-violet-300 hover:text-violet-700'
                }`}
              >
                <CategoryIcon category={cat.id} size={14} className={isSelected ? 'text-white' : ''} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Results Bar */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold text-gray-500">
            {filtered.length} {filtered.length === 1 ? 'modelo encontrado' : 'modelos encontrados'}
          </p>
          {compareList.length === 2 && (
            <button
              onClick={() => router.push(`/comparar?a=${compareList[0]}&b=${compareList[1]}`)}
              className="bg-gradient-to-r from-violet-600 to-emerald-600 hover:from-violet-700 hover:to-emerald-700 text-white px-5 py-2 rounded-xl text-xs font-extrabold shadow-md shadow-violet-500/20 flex items-center gap-1.5 transition-all"
            >
              <span>Comparar 2 Selecionados</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>

        {compareList.length > 0 && compareList.length < 2 && (
          <div className="bg-violet-50 border border-violet-200 text-violet-900 px-4 py-2.5 rounded-2xl mb-4 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 size={16} className="text-violet-600 shrink-0" />
            <span>1 aparelho selecionado. Selecione outro modelo na lista abaixo para compará-los lado a lado.</span>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(product => {
            const cost = calcCostPerMonth(product.consumptionKwhMonth, tariff);
            const ratingCfg = RATING_CONFIG[product.rating];
            const isSelected = compareList.includes(product.id);

            return (
              <div
                key={product.id}
                className={`bg-white rounded-3xl shadow-xs border transition-all overflow-hidden flex flex-col justify-between ${
                  isSelected 
                    ? 'border-violet-600 ring-2 ring-violet-500/20 shadow-md' 
                    : 'border-gray-200/90 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-500/5'
                }`}
              >
                {/* Imagem do Produto via URL */}
                <div className="relative h-48 bg-slate-50 overflow-hidden">
                  <ProductImage
                    src={product.imageUrl}
                    alt={product.name}
                    category={product.category}
                    containerClassName="w-full h-full"
                  />
                  {/* Badge de Eficiência Energética */}
                  <div className="absolute top-3 right-3">
                    <span className={`${ratingCfg.bg} ${ratingCfg.color} text-xs font-black px-2.5 py-1 rounded-lg shadow-sm`}>
                      Classe {product.rating}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-violet-600 uppercase tracking-wider">
                      {product.brand} · {product.model}
                    </span>
                    <h3 className="font-bold text-gray-900 text-sm mt-0.5 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="space-y-1.5 my-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Consumo elétrico</span>
                      <span className="font-semibold text-gray-800">{product.consumptionKwhMonth} kWh/mês</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Custo estimado</span>
                      <span className="font-bold text-emerald-700">R$ {cost.toFixed(2)}/mês</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/produto/${product.id}`)}
                      className="flex-1 bg-slate-100 hover:bg-violet-50 hover:text-violet-800 text-gray-700 py-2.5 rounded-xl text-xs font-bold transition-colors"
                    >
                      Ver detalhes
                    </button>
                    <button
                      onClick={() => toggleCompare(product.id)}
                      className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                        isSelected
                          ? 'bg-violet-600 text-white shadow-sm shadow-violet-500/25'
                          : 'bg-violet-50 text-violet-700 hover:bg-violet-100'
                      }`}
                    >
                      {isSelected ? <Check size={14} /> : '+'}
                      <span>Comparar</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default function BuscaPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-gray-500">Carregando busca...</div>}>
      <BuscaContent />
    </Suspense>
  );
}
