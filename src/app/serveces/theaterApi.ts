import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { TheaterType } from "@/lib/types";

export const theaterApi = createApi({
  reducerPath: "theaterApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Theaters"],
  endpoints: (builder) => ({
    getTheaters: builder.query<{ theaters: TheaterType[] }, void>({
      query: () => `/owner/fetchTheatersList`,
      providesTags: ["Theaters"],
    }),
    addTheater: builder.mutation({
      query: (newData) => ({
        url: `/owner/addNewTheater`,
        method: "POST",
        body: newData,
      }),
      invalidatesTags: ["Theaters"],
    }),
    editTheater: builder.mutation({
      query: ({ theaterId, ...data }) => ({
        url: `/owner/editTheater?theaterId=${theaterId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Theaters"],
    }),
    deleteTheater: builder.mutation({
      query: (theaterId) => ({
        url: `/owner/deleteTheater?theaterId=${theaterId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Theaters"],
    }),
    addBlock: builder.mutation({
      query: (blockData) => ({
        url: `/owner/addNewBlock`,
        method: "POST",
        body: blockData,
      }),
      invalidatesTags: ["Theaters"],
    }),
  }),
});

export const {
  useGetTheatersQuery,
  useAddTheaterMutation,
  useEditTheaterMutation,
  useDeleteTheaterMutation,
  useAddBlockMutation,
} = theaterApi;
