"use client";

import { StarRatingProps } from "@/lib/types";
import { Star } from "lucide-react";
import { useState, useEffect } from "react";
import { fpost, fget } from "@/lib/api";

export default function StarRating({
  initialRating,
  movieId,
}: StarRatingProps) {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);

  // Fetch rating data when component mounts
  useEffect(() => {
    const fetchRating = async () => {
      try {
        const data = await fget({
          url: `/api/rating?movieId=${movieId}`,
          useCache: false,
        });
        setAverageRating(data.averageRating);
        setTotalRatings(data.totalRatings);
        if (data.userRating) {
          setRating(data.userRating);
        }
      } catch (error) {
        console.error("Failed to fetch rating:", error);
      }
    };

    if (movieId) {
      fetchRating();
    }
  }, [movieId]);

  const handleClick = async (ratingValue: number) => {
    setIsSubmitting(true);
    try {
      const data = await fpost({
        url: "/api/rating",
        data: { movieId, rating: ratingValue },
        useCache: false,
      });
      setRating(ratingValue);
      setAverageRating(data.averageRating);
      setTotalRatings(data.totalRatings);
    } catch (error) {
      console.error("Failed to submit rating:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-2">
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
              aria-label={`Rate ${ratingValue} stars`}
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
      {totalRatings > 0 && (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="font-semibold text-white">
            {averageRating.toFixed(1)}
          </span>
          <span>
            average from {totalRatings} rating{totalRatings !== 1 ? "s" : ""}
          </span>
        </div>
      )}
      {rating > 0 && (
        <p className="text-sm text-mxpink">Your rating: {rating} stars</p>
      )}
    </div>
  );
}
