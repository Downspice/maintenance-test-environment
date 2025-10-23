import axios, { AxiosRequestConfig } from "axios";
 import { toast } from "sonner";

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