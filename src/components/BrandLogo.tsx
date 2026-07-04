import { useState } from 'react';
import { BookOpen } from 'lucide-react';

type BrandLogoProps = {
  className?: string;
  alt?: string;
  src?: string;
};

export default function BrandLogo({ className = '', alt = 'Soma365 logo', src = '/logo.svg' }: BrandLogoProps) {
  const [hasError, setHasError] = useState(false);

  return !hasError ? (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  ) : (
    <div className={`${className} bg-brand flex items-center justify-center`}>
      <BookOpen className="text-white" size={18} />
    </div>
  );
}
