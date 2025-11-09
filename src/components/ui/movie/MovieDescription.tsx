import { Movie } from "@prisma/client";
import StarRating from "./StarRating";
import Comments from "./Comments";

export function MovieDescription({ movie }: { movie: Movie }) {
  return (
    <div>
      <div className="flex flex-row justify-between items-center">
        <div>
          <h1 className="text-4xl font-semibold">{movie.title}</h1>
          <h3 className="text-3xl text-gray-300">{movie.year}</h3>
        </div>
        <h3 className="text-4xl bg-slate-800 p-3 rounded-sm text-white">
          {movie.imdbRating?.toFixed(1)}
        </h3>
      </div>
      <div className="mt-4">
        <h2 className="text-lg text-gray-300 font-semibold mb-2">
          Your Rating
        </h2>
        <StarRating initialRating={0} movieId={movie.id} />
      </div>
      <div className="mt-4">
        <h2 className="text-lg text-gray-300 font-semibold">Description</h2>
        <p className="mt-2 text-lg text-white">{movie.description}</p>
      </div>

      <Comments movieId={movie.id} />
    </div>
  );
}
