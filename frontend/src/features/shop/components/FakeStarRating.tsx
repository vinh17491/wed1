import { Star, StarHalf } from 'lucide-react';

interface FakeStarRatingProps {
  rating: number;
  className?: string;
}

export function FakeStarRating({ rating, className = '' }: FakeStarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="w-4 h-4 fill-amber-400 text-amber-400" />
      ))}
      {hasHalfStar && <StarHalf className="w-4 h-4 fill-amber-400 text-amber-400" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-600" />
      ))}
      <span className="text-xs text-slate-400 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}
