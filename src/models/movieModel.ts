import mongoose from "mongoose";

export const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    overview: { type: String, required: true },
    poster_path: { type: String, required: true },
    backdrop_path: { type: String, required: true },
    tagline: { type: String, required: true },
    genres: { type: [{ id: Number, name: String }], default: [] },
    casts: { type: [{ name: String, profile_path: String }], default: [] },
    original_language: { type: String, required: true },
    release_date: { type: String, required: true },
    vote_average: { type: Number, required: true },
    vote_count: { type: Number, required: true },
    runtime: { type: Number, required: true },
    shorts: { type: [{ type: String }], default: [] },
    movieReview: {
      type: [
        {
          userId: String,
          userName: String,
          comment: String,
          rating: Number,
          createdAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const Movie = mongoose.models.Movie || mongoose.model("Movie", movieSchema);
export default Movie;
