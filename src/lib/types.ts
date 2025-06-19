export interface Booking {
  _id: string;
  user: { name: string };
  show: Show;
  amount: number;
  bookedSeats: string[];
  isPaid: boolean;
}

export interface Trailer {
  image: string;
  videoUrl: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Cast {
  name: string;
  profile_path: string;
}

export interface Movie {
  _id: string;
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  genres: Genre[];
  tagline: string;
  original_language: string;
  casts: Cast[];
  release_date: string;
  vote_average: number;
  vote_count: number;
  runtime: number;
}
export interface Show {
  _id?: string;
  movie: Movie;
  showDateTime?: string;
  movieDateTime?: string; // used in admin
  showPrice?: number;
  moviePrice?: number;
  occupiedSeats?: Record<string, string | undefined>;
}
export interface MovieForm {
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  genres: number[];
  casts: { name: string; profile_path: string }[];
  release_date: string;
  original_language: string;
  tagline: string;
  vote_average: string; // input as string
  vote_count: string;
  runtime: string;
}

export type ShowTimeSlot = {
  time: string; // ISO date string
  showId: string; // Unique show identifier
};
export type ShowDateTime = {
  [date: string]: ShowTimeSlot[];
};
