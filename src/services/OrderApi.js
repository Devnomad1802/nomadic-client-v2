import { api } from "../utils/api";

// Define a service using a base URL and expected endpoints
const OrderApi = api.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    order: builder.mutation({
      query: ({ amount, currency, receipt }) => ({
        url: "/order",
        method: "POST",
        body: { amount, currency, receipt },
      }),
    }),
    validate: builder.mutation({
      query: ({ body }) => ({
        url: "/validate",
        method: "POST",
        body: { body },
      }),
    }),
    newBooking: builder.mutation({
      query: ({
        userId,
        bookingId,
        paymentDetail,
        cardData,
        selectedValue,
        paymentStatus,
        coupenDiscount,
      }) => ({
        url: "/newBooking",
        method: "POST",
        body: {
          userId,
          bookingId,
          paymentDetail,
          cardData,
          selectedValue,
          paymentStatus,
          coupenDiscount,
        },
      }),
    }),

    getPartialTrip: builder.mutation({
      query: ({ userId }) => ({
        url: "/getPartialPaymentBookings",
        method: "POST",
        body: { userId },
      }),
    }),
  }),
});

export const {
  useOrderMutation,
  useValidateMutation,
  useNewBookingMutation,
  useGetPartialTripMutation,
} = OrderApi;
