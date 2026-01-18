'use client';

import { Star } from 'lucide-react';

// ===========================================
// STAR RATING COMPONENT
// ===========================================

interface StarRatingProps {
  rating: 1 | 2 | 3 | 4 | 5;
  maxStars?: number;
}

export function StarRating({ rating, maxStars = 5 }: StarRatingProps): React.ReactElement {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: maxStars }).map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${
            index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
}
