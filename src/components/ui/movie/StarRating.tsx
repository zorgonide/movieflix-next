"use client";

import { StarRatingProps } from "@/lib/types";
import { Star } from "lucide-react";
import { useState } from "react";

export default function StarRating({ initialRating, onRate }: StarRatingProps) {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClick = async (ratingValue: number) => {
    setIsSubmitting(true);
    await onRate(ratingValue);
    setRating(ratingValue);
    setIsSubmitting(false);
  };

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <button
            key={ratingValue}
            onClick={() => handleClick(ratingValue)}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(0)}
            disabled={isSubmitting}
            className="cursor-pointer transition-transform duration-150 hover:scale-115 disabled:cursor-not-allowed"
          >
            <Star
              size={28}
              className={`
                ${
                  ratingValue <= (hover || rating)
                    ? "text-mxpink"
                    : "text-gray-500"
                }
                transition-colors duration-150
              `}
              fill={
                ratingValue <= (hover || rating)
                  ? "currentColor"
                  : "transparent"
              }
            />
          </button>
        );
      })}
    </div>
  );
}
