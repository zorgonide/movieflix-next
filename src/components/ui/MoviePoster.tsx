import Image from "next/image";
import Link from "next/link";
import { tmdbMovie } from "@/lib/types";

export default function MoviePoster({ movie }: { movie: tmdbMovie }) {
  return (
    <Link href={`/movie/${movie.id}`} key={movie.id}>
      <div className="flex h-full cursor-pointer flex-col overflow-hidden rounded-sm bg-mxpink transition-transform hover:scale-105 hover:bg-mxpink-hover">
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="h-auto w-full"
          width={500}
          height={750}
        />
        <div className="p-2">
          <h3 className="truncate text-sm text-center font-semibold">
            {movie.title}
          </h3>
        </div>
      </div>
    </Link>
  );
}
