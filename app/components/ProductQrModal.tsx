'use client';
import { useState } from 'react';
import { QrCode, X, Copy, Check, Printer } from 'lucide-react';
import { Product } from '@/lib/data';

interface ProductQrModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductQrModal({ product, isOpen, onClose }: ProductQrModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/produto/${product.id}`
    : `https://wattnext.app/produto/${product.id}`;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(currentUrl)}`;

  function handleCopy() {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative border border-violet-100 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Fechar"
        >
          <X size={18} />
        </button>

        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-tr from-violet-600 to-indigo-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md shadow-violet-500/25">
            <QrCode size={24} />
          </div>
          <h3 className="font-extrabold text-gray-900 text-lg">QR Code do Aparelho</h3>
          <p className="text-xs text-gray-500 mt-1 mb-4">
            Aponte a câmera no app Watt Next? para ler os parâmetros energéticos deste produto.
          </p>

          <div className="bg-gradient-to-b from-violet-50/50 to-emerald-50/30 p-4 rounded-2xl border border-violet-100 inline-block shadow-inner mb-4">
            <img
              src={qrImageUrl}
              alt={`QR Code para ${product.name}`}
              className="w-52 h-52 object-contain rounded-lg"
              loading="eager"
            />
          </div>

          <div className="bg-violet-50/50 rounded-xl p-3 text-left mb-4 border border-violet-100/80">
            <div className="text-xs font-bold text-gray-900 line-clamp-1">{product.name}</div>
            <div className="text-[11px] text-violet-800 font-medium">
              {product.brand} · {product.model} · Classe {product.rating}
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-1">
              Consumo: {product.consumptionKwhMonth} kWh/mês
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {copied ? <Check size={14} className="text-violet-600" /> : <Copy size={14} />}
              {copied ? 'Link Copiado!' : 'Copiar Link'}
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-colors shadow-sm shadow-violet-500/20"
            >
              <Printer size={14} />
              Imprimir QR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
