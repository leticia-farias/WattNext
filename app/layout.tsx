import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Watt Next? — Eficiência Energética e Consumo Inteligente',
  description: 'Descubra quanto seu eletrodoméstico gasta em R$/mês, escaneie etiquetas via QR Code e economize na conta de luz',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  )
}
