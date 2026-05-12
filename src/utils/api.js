import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// export const baseUrl = "http://localhost:5000/api";
// this si thesting for repo push
export const baseUrl = "http://168.144.119.114:5000/api";
export const baseImage = "http://168.144.119.114:5000";

export const api = createApi({
  reducerPath: "apis",

  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", token);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
});
