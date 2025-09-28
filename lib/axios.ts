import { ApiError } from "@/types/types";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { getSession, signOut } from "next-auth/react";
import { toast } from "sonner";

// Define your base URLs
const baseURLADMIN =
  process.env.NEXT_PUBLIC_ADMIN_SERVICE_BASEURL ||
  "http://45.136.16.27:8061/api/v1/admin-service";

const baseURLREQUESTSERVICE =
  process.env.NEXT_PUBLIC_REQUEST_SERVICE ||
  "http://45.136.16.27:8061/api/v1/admin-REQUEST";


  const baseURLREPORT =
  process.env.NEXT_PUBLIC_REPORT_SERVICE ||
  "http://45.136.16.27:8061/api/v1/admin-REQUEST";

// Factory to create a client for a given baseURL
const createApiClient = (baseURL: string): AxiosInstance => {
  const client = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor
  client.interceptors.request.use(async (config) => {
    const session = await getSession();
    if (session?.user?.accessToken) {
      config.headers.Authorization = `Bearer ${session.user.accessToken}`;
    }
    return config;
  });

  // Response interceptor
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      handleApiError(error.response.data);

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        originalRequest.headers["Authorization"]
      ) {
        originalRequest._retry = true;
        try {
          const session = await getSession();
          if (session?.user?.accessToken) {
            originalRequest.headers.Authorization = `Bearer ${session.user.accessToken}`;
            return client(originalRequest);
          }
        } catch (refreshError) {
          console.error("Token refresh failed", refreshError);
          await signOut({ redirect: true, callbackUrl: "/" });
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  return client;
};

// Export clients for reuse
export const adminClient = createApiClient(baseURLADMIN);
export const requestClient = createApiClient(baseURLREQUESTSERVICE);
export const reportClient = createApiClient(baseURLREPORT);

// You can also make a dynamic client if needed
export const getCustomClient = (url: string) => createApiClient(url);

export const dummyApiClientToken = async <T>(
  url: string,
  token?: string, 
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await axios({
      url,
      headers: {
        ...(config?.headers || {}),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...config,
    });

    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "An error occurred";

    toast.error(message);
    throw error.response?.data || error.message;
  }
};

export const dummyApiClient = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await axios({
      url,
      ...config,
    });
    return response.data;
  } catch (error: any) {
    toast.error(JSON.stringify(error.response?.data.message));
    throw error.response?.data || error.message;
  }
};

export async function handleApiError(error: ApiError) {
  if (error.message == "[Keycloak Guard] Expired token") {
    await signOut({ redirect: true, callbackUrl: "/" });
  }
  if (error.message == "Unauthenticated") {
    await signOut({ redirect: true, callbackUrl: "/" });
  }
  const status = error?.status;
  const message = error?.message || "Something went wrong. Please try again.";
  console.log(error);
  toast(`Request failed with status ${status ?? "Unknown"}`, {
    description: message,
  });
}
