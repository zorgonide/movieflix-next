/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { Prisma } from "@prisma/client";

export type User = Prisma.UserGetPayload<{}>;

export type PublicUser = Omit<User, "passwordHash" | "createdAt">;

export type Movie = Prisma.MovieGetPayload<{}>;
export type Comment = Prisma.CommentGetPayload<{}>;
export type Rating = Prisma.RatingGetPayload<{}>;
export type WatchList = Prisma.WatchListGetPayload<{}>;

// Composite example: Movie with comments + avg rating
export type MovieWithDetails = Prisma.MovieGetPayload<{
  include: {
    Comment: { include: { user: true } };
    Rating: true;
  };
}>;

export type FetchArgs = {
  url: string;
  data?: any;
  tmdb?: boolean;
  useCache?: boolean;
};
export type Genre = {
  id: number;
  name: string;
};
export type tmdbMovie = {
  id: number;
  title: string;
  poster_path: string;
};
