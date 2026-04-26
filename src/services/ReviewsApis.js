import { api } from "../utils/api";

// Define a service using a base URL and expected endpoints
const ReviewsApis = api.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getAllReviews: builder.query({
      query: () => ({
        url: "/getAllReviews",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetAllReviewsQuery } = ReviewsApis;
