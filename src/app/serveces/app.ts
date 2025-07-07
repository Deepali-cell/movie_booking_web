import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Shows"],
  endpoints: (builder) => ({
    getShowById: builder.query({
      query: (showId: string) => `getShowById?showId=${showId}`,
      providesTags: ["Shows"],
    }),
    updateShow: builder.mutation({
      query: ({ showId, ...data }) => ({
        url: `/owner/editShow?showId=${showId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Shows"],
    }),
    getShows: builder.query({
      query: (theaterId: string) => `getShowByTheaterId?theaterId=${theaterId}`,
      providesTags: ["Shows"],
    }),
    deleteShow: builder.mutation({
      query: (showId: string) => ({
        url: `owner/deleteShow?showId=${showId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Shows"],
    }),
    updateShowStatus: builder.mutation({
      query: ({ showId, newStatus }) => ({
        url: `owner/updateShowStatus`,
        method: "PATCH",
        body: { showId, newStatus },
      }),
      invalidatesTags: ["Shows"],
    }),
  }),
});

export const {
  useGetShowByIdQuery,
  useUpdateShowMutation,
  useGetShowsQuery,
  useDeleteShowMutation,
  useUpdateShowStatusMutation,
} = api;
