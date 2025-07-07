import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const foodCourtApi = createApi({
  reducerPath: "foodCourtApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["FoodCourts"],
  endpoints: (builder) => ({
    // GET all food courts for theater (optional block)
    getFoodCourts: builder.query({
      query: ({ theaterId, block }) =>
        block
          ? `owner/fetchFoodCourtList?theaterId=${theaterId}&block=${block}`
          : `owner/fetchFoodCourtList?theaterId=${theaterId}`,
      providesTags: ["FoodCourts"],
    }),

    // GET single food court by ID
    getFoodCourtById: builder.query({
      query: (foodCourtId) => `fetchFoodCourtById?foodCourtId=${foodCourtId}`,
      providesTags: ["FoodCourts"],
    }),

    // UPDATE food court
    updateFoodCourt: builder.mutation({
      query: ({ foodCourtId, ...data }) => ({
        url: `/owner/editFoodCourt?foodCourtId=${foodCourtId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["FoodCourts"],
    }),

    // DELETE food court
    deleteFoodCourt: builder.mutation({
      query: (foodCourtId) => ({
        url: `/owner/deleteFoodCourt?foodCourtId=${foodCourtId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["FoodCourts"],
    }),
    getFoodItem: builder.query({
      query: ({ foodCourtId, itemName }) =>
        `owner/fetchFoodItem?foodCourtId=${foodCourtId}&itemName=${encodeURIComponent(
          itemName
        )}`,
    }),
    editFoodItem: builder.mutation({
      query: ({ foodCourtId, originalName, updatedItem }) => ({
        url: `/owner/editFoodItem`,
        method: "PUT",
        body: { foodCourtId, originalName, updatedItem },
      }),
      invalidatesTags: ["FoodCourts"],
    }),

    // DELETE food item
    deleteFoodItem: builder.mutation({
      query: ({ foodCourtId, itemName }) => ({
        url: `/owner/deleteFoodItem?foodCourtId=${foodCourtId}&itemName=${encodeURIComponent(
          itemName
        )}`,
        method: "DELETE",
      }),
      invalidatesTags: ["FoodCourts"],
    }),
  }),
});

export const {
  useGetFoodCourtsQuery,
  useGetFoodCourtByIdQuery,
  useGetFoodItemQuery,
  useEditFoodItemMutation,
  useUpdateFoodCourtMutation,
  useDeleteFoodCourtMutation,
  useDeleteFoodItemMutation,
} = foodCourtApi;
