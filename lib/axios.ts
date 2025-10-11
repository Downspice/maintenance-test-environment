import { ApiError } from "@/types/types";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
 import { toast } from "sonner";

 

// // Factory to create a client for a given baseURL
// const createApiClient = (baseURL: string): AxiosInstance => {
//   const client = axios.create({
//     baseURL,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   // Request interceptor
//   client.interceptors.request.use(async (config) => {
//     const session = await getSession();
//     if (session?.user?.accessToken) {
//       config.headers.Authorization = `Bearer ${session.user.accessToken}`;
//     }
//     return config;
//   });

//   // Response interceptor
//   client.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//       const originalRequest = error.config;
//       handleApiError(error.response.data);

//       if (
//         error.response?.status === 401 &&
//         !originalRequest._retry &&
//         originalRequest.headers["Authorization"]
//       ) {
//         originalRequest._retry = true;
//         try {
//           const session = await getSession();
//           if (session?.user?.accessToken) {
//             originalRequest.headers.Authorization = `Bearer ${session.user.accessToken}`;
//             return client(originalRequest);
//           }
//         } catch (refreshError) {
//           console.error("Token refresh failed", refreshError);
//           await signOut({ redirect: true, callbackUrl: "/" });
//           return Promise.reject(refreshError);
//         }
//       }
//       return Promise.reject(error);
//     }
//   );

//   return client;
// };

// Export clients for reuse
// export const adminClient = createApiClient(baseURLADMIN);

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
 