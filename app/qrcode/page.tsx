'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  QrCode, 
  Camera, 
  Upload, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  RotateCw, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { Header } from '@/app/components/Header';
import { PRODUCTS, RATING_CONFIG, calcCostPerMonth, TARIFF_BY_STATE } from '@/lib/data';
import { ProductImage } from '@/app/components/ProductImage';

export default function QrCodeScannerPage() {
  const router = useRouter();
  const [cameraActive, setCameraActive] = useState(false);
  const [hasCameraError, setHasCameraError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [detectedProductId, setDetectedProductId] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tariff = TARIFF_BY_STATE['SP'].tariff;
  const detectedProduct = PRODUCTS.find(p => p.id === detectedProductId);

  // Presets para teste rápido
  const quickTestProducts = [
    { label: 'Geladeira Frost Free 375L (Classe A)', id: 'brastemp-brm44' },
    { label: 'Ar-condicionado 12k BTU (Classe C)', id: 'midea-ar-convencional' },
    { label: 'Chuveiro Elétrico 7500W (Classe D)', id: 'lorenzetti-chuveiro' },
    { label: 'Smart TV OLED 55" 4K (Classe A)', id: 'lg-tv-oled' },
    { label: 'Máquina de Lavar 12kg (Classe A)', id: 'electrolux-lava' },
  ];

  async function startCamera() {
    setHasCameraError(false);
    setErrorMessage('');
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Câmera não suportada neste dispositivo/navegador.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
      simulateScanDetection();
    } catch (err: any) {
      setHasCameraError(true);
      setErrorMessage(err?.message || 'Permissão de câmera negada ou câmera indisponível.');
      setCameraActive(false);
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setIsScanning(false);
  }

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  function simulateScanDetection() {
    setIsScanning(true);
    const timer = setTimeout(() => {
      const randomProduct = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
      setDetectedProductId(randomProduct.id);
      setIsScanning(false);
    }, 2200);

    return () => clearTimeout(timer);
  }

  function handleSelectPreset(id: string) {
    setIsScanning(true);
    setTimeout(() => {
      setDetectedProductId(id);
      setIsScanning(false);
    }, 400);
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setTimeout(() => {
      const randomProduct = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
      setDetectedProductId(randomProduct.id);
      setIsScanning(false);
    }, 900);
  }

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8 flex-1 w-full">
        {/* Intro */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-100 to-indigo-100 text-violet-900 text-xs font-bold px-3.5 py-1.5 rounded-full mb-3 border border-violet-200/60 shadow-2xs">
            <QrCode size={14} className="text-violet-600" />
            <span>Leitor Óptico de QR Code & Etiqueta ENCE</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Escaneie o QR Code do Aparelho
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
            Aponte a câmera para a etiqueta do INMETRO ou envie uma imagem para decodificar os dados e calcular o gasto real em R$/mês.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Scanner Viewport */}
          <div className="lg:col-span-7 bg-white rounded-3xl shadow-xs border border-violet-100/80 overflow-hidden p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-gray-800 flex items-center gap-2">
                <Camera size={18} className="text-violet-600" /> Visor do Scanner
              </span>
              {cameraActive && (
                <button
                  onClick={stopCamera}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 underline"
                >
                  Desligar Câmera
                </button>
              )}
            </div>

            {/* Camera Box */}
            <div className="relative aspect-4/3 w-full bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center shadow-inner border border-slate-900">
              {cameraActive ? (
                <>
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Miras do Scanner em Roxo & Verde Neon */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8">
                    <div className="relative w-64 h-64 border-2 border-violet-400/60 rounded-3xl">
                      <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-violet-500 rounded-tl-xl" />
                      <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-violet-500 rounded-tr-xl" />
                      <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl" />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-xl" />

                      {/* Linha de varredura animada */}
                      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-violet-400 to-transparent shadow-lg shadow-violet-500/80 animate-pulse absolute top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  {isScanning && (
                    <div className="absolute bottom-4 bg-slate-950/80 backdrop-blur-md text-white text-xs px-4 py-2 rounded-full flex items-center gap-2 border border-white/10">
                      <RotateCw size={14} className="animate-spin text-violet-400" />
                      <span>Decodificando parâmetros energéticos...</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center p-6 text-gray-300">
                  <div className="w-16 h-16 rounded-3xl bg-violet-950/70 border border-violet-800/60 flex items-center justify-center mx-auto mb-4 text-violet-400 shadow-inner">
                    <QrCode size={32} />
                  </div>
                  <p className="text-sm font-bold text-gray-100 mb-1">
                    Câmera Pronta para Uso
                  </p>
                  <p className="text-xs text-gray-400 max-w-xs mx-auto mb-5 leading-relaxed">
                    Ative a câmera ou selecione um arquivo de imagem com QR Code.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <button
                      onClick={startCamera}
                      className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-violet-500/25 flex items-center gap-2 transition-all"
                    >
                      <Camera size={16} /> Iniciar Câmera
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-gray-200 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all"
                    >
                      <Upload size={16} /> Enviar Imagem
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </div>
                  {hasCameraError && (
                    <div className="mt-4 text-xs text-amber-300 bg-amber-950/70 border border-amber-800 rounded-xl p-2.5 max-w-sm mx-auto flex items-center gap-2">
                      <AlertCircle size={16} className="shrink-0" />
                      <span>{errorMessage} (Você pode simular usando os atalhos abaixo)</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Test Presets */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <span className="text-[11px] font-bold text-violet-700 uppercase tracking-wider block mb-3">
                Simular Leitura Rápida de Etiqueta (Sem Câmera):
              </span>
              <div className="flex flex-wrap gap-2">
                {quickTestProducts.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPreset(p.id)}
                    className={`text-xs py-2 px-3 rounded-xl border transition-all ${
                      detectedProductId === p.id
                        ? 'bg-violet-600 text-white border-violet-600 font-bold shadow-sm shadow-violet-500/25'
                        : 'bg-slate-50 hover:bg-violet-50 hover:text-violet-800 text-gray-700 border-gray-200'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Result Card com Roxo & Esmeralda */}
          <div className="lg:col-span-5 space-y-4">
            {detectedProduct ? (
              <div className="bg-white rounded-3xl shadow-xs border-2 border-violet-500 overflow-hidden">
                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-5 py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={18} />
                    <span className="font-bold text-sm">Aparelho Reconhecido</span>
                  </div>
                  <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
                    ENCE Validado
                  </span>
                </div>

                <div className="p-5">
                  {/* Imagem do Produto via URL */}
                  <div className="mb-4 rounded-2xl overflow-hidden border border-gray-100 bg-slate-50 h-44 flex items-center justify-center">
                    <ProductImage
                      src={detectedProduct.imageUrl}
                      alt={detectedProduct.name}
                      category={detectedProduct.category}
                      className="w-full h-full object-cover"
                      containerClassName="w-full h-full"
                    />
                  </div>

                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="text-xs font-bold text-violet-600">
                        {detectedProduct.brand} · {detectedProduct.model}
                      </span>
                      <h3 className="font-extrabold text-gray-900 text-base leading-snug">
                        {detectedProduct.name}
                      </h3>
                    </div>
                    <span className={`${RATING_CONFIG[detectedProduct.rating].bg} ${RATING_CONFIG[detectedProduct.rating].color} text-sm font-black px-3 py-1 rounded-lg shrink-0 shadow-sm`}>
                      {detectedProduct.rating}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mb-4 line-clamp-2 leading-relaxed">
                    {detectedProduct.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-5 bg-violet-50/50 p-3.5 rounded-2xl border border-violet-100/60">
                    <div>
                      <span className="text-[11px] text-gray-500 block font-medium">Consumo Mensal</span>
                      <span className="text-sm font-black text-gray-900">
                        {detectedProduct.consumptionKwhMonth} kWh/mês
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-gray-500 block font-medium">Custo Estimado</span>
                      <span className="text-sm font-black text-emerald-700">
                        R$ {calcCostPerMonth(detectedProduct.consumptionKwhMonth, tariff).toFixed(2)}/mês
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => router.push(`/produto/${detectedProduct.id}`)}
                      className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-violet-500/20"
                    >
                      <span>Ver Análise Completa</span>
                      <ArrowRight size={16} />
                    </button>
                    <button
                      onClick={() => router.push(`/minha-casa`)}
                      className="w-full bg-slate-100 hover:bg-violet-50 hover:text-violet-800 text-gray-700 font-bold py-2.5 rounded-xl text-xs transition-colors"
                    >
                      + Cadastrar na Minha Casa
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-dashed border-violet-200 p-8 text-center text-gray-400">
                <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center mx-auto mb-3 text-violet-500">
                  <Sparkles size={20} />
                </div>
                <h4 className="font-bold text-gray-800 text-sm mb-1">
                  Nenhum aparelho escaneado
                </h4>
                <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                  Aponte para o QR Code da etiqueta com o visor ao lado ou selecione um modelo de teste rápido.
                </p>
              </div>
            )}

            {/* Dica sobre etiquetas com Roxo & Esmeralda */}
            <div className="bg-gradient-to-r from-violet-50/70 to-emerald-50/60 border border-violet-200/60 rounded-3xl p-5 text-xs text-violet-950 shadow-2xs">
              <div className="flex items-center gap-2 font-bold text-violet-900 mb-1.5">
                <ShieldCheck size={18} className="text-violet-600" /> Onde fica o QR Code na Etiqueta?
              </div>
              <p className="text-violet-900/80 leading-relaxed">
                As novas etiquetas do Programa Brasileiro de Etiquetagem (PBE/INMETRO) possuem o QR Code oficial no canto inferior. Ao fazer a leitura, o Watt Next? extrai o consumo real e projeta o valor em reais na sua fatura.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
