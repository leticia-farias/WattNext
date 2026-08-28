'use client';
import { 
  Snowflake, 
  Wind, 
  Tv, 
  Waves, 
  Droplets, 
  Laptop, 
  Sparkles 
} from 'lucide-react';

interface CategoryIconProps {
  category: string;
  size?: number;
  className?: string;
}

export function CategoryIcon({ category, size = 16, className = '' }: CategoryIconProps) {
  switch (category) {
    case 'geladeira':
      return <Snowflake size={size} className={className || 'text-cyan-600'} />;
    case 'ar_condicionado':
      return <Wind size={size} className={className || 'text-sky-600'} />;
    case 'tv':
      return <Tv size={size} className={className || 'text-violet-600'} />;
    case 'maquina_lavar':
      return <Waves size={size} className={className || 'text-blue-600'} />;
    case 'chuveiro':
      return <Droplets size={size} className={className || 'text-indigo-600'} />;
    case 'computador':
      return <Laptop size={size} className={className || 'text-purple-600'} />;
    default:
      return <Sparkles size={size} className={className || 'text-violet-600'} />;
  }
}
