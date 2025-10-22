import axios, { AxiosRequestConfig } from "axios";
import { toast } from "sonner";

export const dummyApiClient = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    // Route all requests through the secure proxy
    const proxiedUrl = `/api/proxy?path=${url}`;
    
    const response = await axios({
      url: proxiedUrl,
      ...config,
    });

    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "An unexpected error occurred";
    toast.error(message);
    throw error.response?.data || error.message;
  }
};
