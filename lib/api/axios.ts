import axios, { type AxiosRequestConfig } from "axios";
import { toast } from "sonner";

export interface ApiClientConfig extends AxiosRequestConfig {
  suppressToast?: boolean;
}

export function extractErrorMessage(error: any): string {
  if (!error) {
    return "An unexpected error occurred. Please try again.";
  }

  if (typeof error === "string") {
    const trimmed = error.trim();
    return trimmed.length > 0 ? trimmed : "An unexpected error occurred.";
  }

  const responseData = error.response?.data;
  const status = error.response?.status;
  const statusText = error.response?.statusText;

  if (responseData !== undefined && responseData !== null) {
    if (typeof responseData === "string") {
      const trimmed = responseData.trim();
      if (trimmed.startsWith("<")) {
        if (status === 404) return "Requested resource was not found (404).";
        if (status === 500)
          return "Internal server error (500). Please try again.";
        if (status === 401) return "Unauthorized (401). Please log in again.";
        if (status === 403) return "Access denied (403).";
        return statusText
          ? `${statusText} (${status})`
          : `Request failed with status ${status}.`;
      }
      if (trimmed.length > 0) {
        return trimmed;
      }
    }

    if (responseData.message) {
      if (
        typeof responseData.message === "string" &&
        responseData.message.trim().length > 0
      ) {
        return responseData.message;
      }
      if (
        Array.isArray(responseData.message) &&
        responseData.message.length > 0
      ) {
        return responseData.message
          .map((m: any) =>
            typeof m === "string" ? m : m?.message || JSON.stringify(m)
          )
          .join(", ");
      }
      if (typeof responseData.message === "object") {
        if (typeof responseData.message.message === "string") {
          return responseData.message.message;
        }
        return JSON.stringify(responseData.message);
      }
    }

    if (responseData.error) {
      if (
        typeof responseData.error === "string" &&
        responseData.error.trim().length > 0
      ) {
        return responseData.error;
      }
      if (typeof responseData.error === "object") {
        if (typeof responseData.error.message === "string") {
          return responseData.error.message;
        }
        return JSON.stringify(responseData.error);
      }
    }

    if (responseData.errors) {
      if (
        Array.isArray(responseData.errors) &&
        responseData.errors.length > 0
      ) {
        return responseData.errors
          .map((e: any) =>
            typeof e === "string" ? e : e?.message || JSON.stringify(e)
          )
          .join(", ");
      }
      if (typeof responseData.errors === "object") {
        const messages = Object.entries(responseData.errors)
          .map(([field, err]: [string, any]) => {
            if (Array.isArray(err)) return err.join(", ");
            if (typeof err === "string") return `${field}: ${err}`;
            if (err?.message) return `${field}: ${err.message}`;
            return `${field}: ${JSON.stringify(err)}`;
          })
          .filter(Boolean);
        if (messages.length > 0) {
          return messages.join("; ");
        }
      }
    }

    if (responseData.detail) {
      if (
        typeof responseData.detail === "string" &&
        responseData.detail.trim().length > 0
      ) {
        return responseData.detail;
      }
      if (
        Array.isArray(responseData.detail) &&
        responseData.detail.length > 0
      ) {
        return responseData.detail
          .map((d: any) => d?.msg || d?.message || JSON.stringify(d))
          .join(", ");
      }
    }

    if (
      typeof responseData.msg === "string" &&
      responseData.msg.trim().length > 0
    ) {
      return responseData.msg;
    }
  }

  if (statusText && status) {
    return `${statusText} (${status})`;
  }

  if (
    error.code === "ECONNABORTED" ||
    error.message?.toLowerCase().includes("timeout")
  ) {
    return "Request timed out. Please try again.";
  }

  if (error.message === "Network Error") {
    return "Network error. Please check your internet connection.";
  }

  if (
    error.message &&
    typeof error.message === "string" &&
    error.message.trim().length > 0
  ) {
    return error.message;
  }

  return "An unexpected error occurred. Please try again.";
}

export const dummyApiClient = async <T>(
  url: string,
  config?: ApiClientConfig
): Promise<T> => {
  try {
    const response = await axios({
      url,
      ...config,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage = extractErrorMessage(error);
    if (!config?.suppressToast) {
      toast.error(errorMessage);
    }

    if (error && typeof error === "object") {
      error.message = errorMessage;
      if (error.response?.data && typeof error.response.data === "object") {
        if (!error.response.data.message) {
          error.response.data.message = errorMessage;
        }
      }
      throw error;
    }

    throw new Error(errorMessage);
  }
};
