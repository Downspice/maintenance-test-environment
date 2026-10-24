"use client";

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { dummyApiClient } from "@/lib/api/axios";
import type { ApiError, ApiResponse } from "@/types/types";

export type TId = string | number;
export type TEntity = unknown;
export type TParams = Record<string, unknown>;

export const buildUrl = (path: string) => path;

export const useBaseMutation = <
  TResponse = TEntity,
  TPayload = TParams,
  TContext = unknown,
>(
  mutationKey: string[],
  endpoint: (payload: TPayload) => string,
  method: "post" | "put" | "delete" | "patch",
  invalidateKeys: (payload: TPayload) => unknown[],
  options?: UseMutationOptions<
    TResponse,
    AxiosError<ApiError>,
    TPayload,
    TContext
  >
) => {
  const queryClient = useQueryClient();

  const mutationFn = async (payload: TPayload) => {
    const url = buildUrl(endpoint(payload));
    const response = await dummyApiClient<ApiResponse<TResponse>>(url, {
      method,
      data:
        method === "post" || method === "put" || method === "patch"
          ? payload
          : undefined,
    });

    return response.data as TResponse;
  };

  return useMutation<TResponse, AxiosError<ApiError>, TPayload, TContext>({
    mutationFn,
    mutationKey,
    onSuccess: (data, variables, context) => {
      invalidateKeys(variables).forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key as never });
      });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};
