import { api } from "../utils";

// Define a service using a base URL and expected endpoints
const HostApi = api.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    // ------------- Get All Hosts  ---------------
    getAllHosts: builder.query({
      query: () => ({
        url: "/host",
        method: "GET",
      }),
      providesTags: ["Hosts"],
    }),

    // ------------- Get Host by ID  ---------------
    getHostById: builder.query({
      query: (hostId) => ({
        url: `/host/${hostId}`,
        method: "GET",
      }),
      providesTags: ["Hosts"],
    }),

    // ------------- Get Host Details  ---------------
    getHostDetails: builder.query({
      query: (hostId) => ({
        url: `/host/${hostId}`,
        method: "GET",
      }),
      providesTags: ["Hosts"],
    }),

    // ------------- Get Host Trips  ---------------
    getHostTrips: builder.query({
      query: (hostId) => ({
        url: `/host/${hostId}/trips`,
        method: "GET",
      }),
      providesTags: ["Hosts", "Trips"],
    }),

    // ------------- Get Host Reviews  ---------------
    getHostReviews: builder.query({
      query: (hostId) => ({
        url: `/host/${hostId}/reviews`,
        method: "GET",
      }),
      providesTags: ["Hosts", "Reviews"],
    }),
  }),
});

export const {
  useGetAllHostsQuery,
  useGetHostByIdQuery,
  useGetHostDetailsQuery,
  useGetHostTripsQuery,
  useGetHostReviewsQuery,
} = HostApi;
