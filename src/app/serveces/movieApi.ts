import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const movieApi = createApi({
  reducerPath: "movieApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Movies"],
  endpoints: (builder) => ({
    getMoviesByTheater: builder.query({
      query: (theaterId: string) =>
        `/owner/fetchMovieList?theaterId=${theaterId}`,
      providesTags: ["Movies"],
    }),
    addMovie: builder.mutation({
      query: (movieData) => ({
        url: `/owner/addNewMovie`,
        method: "POST",
        body: movieData,
      }),
      invalidatesTags: ["Movies"],
    }),
    editMovie: builder.mutation({
      query: ({ movieId, ...data }) => ({
        url: `/owner/editMovie?movieId=${movieId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Movies"],
    }),
    deleteMovie: builder.mutation({
      query: (movieId) => ({
        url: `/owner/deleteMovie?movieId=${movieId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Movies"],
    }),
  }),
});

export const {
  useGetMoviesByTheaterQuery,
  useAddMovieMutation,
  useEditMovieMutation,
  useDeleteMovieMutation,
} = movieApi;
