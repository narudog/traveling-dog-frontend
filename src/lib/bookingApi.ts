// src/lib/bookingApi.ts
import axios from "axios";

const bookingApi = axios.create({
  baseURL: "https://booking-com15.p.rapidapi.com/api/v1",
  headers: {
    "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY || "",
    "X-RapidAPI-Host": "booking-com15.p.rapidapi.com",
  },
  timeout: 20000,
});

export default bookingApi;
