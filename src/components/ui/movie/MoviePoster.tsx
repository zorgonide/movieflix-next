import Image from "next/image";
import CustomLink from "@/components/ui/CustomLink"; // Use the new CustomLink
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function MoviePoster({ movie }: { movie: any }) {
  return (
    <CustomLink href={`/movie/${movie.id}`} key={movie.id}>
      <div className="flex h-full cursor-pointer flex-col overflow-hidden rounded-sm bg-slate-800 transition-transform hover:scale-101">
        <div className="relative w-full aspect-[2/3]">
          <Image
            src={`https://image.tmdb.org/t/p/w500${
              movie.poster_path || movie.poster
            }`}
            alt={movie.title}
            className="object-cover"
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 17vw"
          />
        </div>
        <div className="flex flex-grow flex-col p-2">
          <h3 className="truncate text-sm font-semibold">{movie.title}</h3>
          <h3 className="mt-auto text-xs text-gray-400">
            {movie.release_date?.slice(0, 4)}
          </h3>
        </div>
      </div>
    </CustomLink>
  );
}
