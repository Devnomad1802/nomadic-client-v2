import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// export const baseUrl = "http://localhost:5000/api";
// this si thesting for repo push
export const baseUrl = "https://nomadic-server-v2-production.up.railway.app/api/";
export const baseImage = "https://nomadic-server-v2-production.up.railway.app/api";

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
