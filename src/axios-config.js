import axios from "axios";
import { MEDIA_API_URL } from "@/config";

const API = axios.create({
  baseURL: MEDIA_API_URL, // твой бекенд
});

// Перехватчик запросов — добавляем access_token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Перехватчик ответов — обновляем токен, если 401
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        const res = await axios.post(MEDIA_API_URL + "/token/refresh/", {
          refresh: refreshToken,
        });

        localStorage.setItem("access_token", res.data.access);

        originalRequest.headers["Authorization"] = "Bearer " + res.data.access;
        return API(originalRequest); // повторяем запрос
      } catch (err) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;
