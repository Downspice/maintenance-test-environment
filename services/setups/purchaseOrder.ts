'use client'

import { useQuery, useMutation, useQueryClient, UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { dummyApiClient } from "@/lib/axios";
import { ApiError, ApiResponse } from "@/types/types";

const BASEURL = process.env.NEXT_PUBLIC_BASE_URL;

// --- Shared Type Definitions ---
type TId = string | number;
type TEntity = unknown;
type TParams = Record<string, any>;

// --- Shared Helper Functions ---
// const buildUrl = (path: string) => `${BASEURL}${path}`;
const buildUrl = (path: string) => path;

const useBaseMutation = <TResponse = TEntity, TPayload = TParams, TContext = unknown>(
  mutationKey: string[],
  endpoint: (payload: TPayload) => string,
  method: 'post' | 'put' | 'delete',
  invalidateKeys: (payload: TPayload) => unknown[],
  options?: UseMutationOptions<TResponse, AxiosError<ApiError>, TPayload, TContext>
) => {
  const queryClient = useQueryClient();
  const mutationFn = async (payload: TPayload) => {
    const url = buildUrl(endpoint(payload));
    const response = await dummyApiClient<ApiResponse<TResponse>>(url, {
      method: method,
      data: (method === 'post' || method === 'put') ? payload : undefined,
    });
    return response.data as TResponse;
  };
  return useMutation<TResponse, AxiosError<ApiError>, TPayload, TContext>({
    mutationFn,
    mutationKey,
    onSuccess: (data, variables, context) => {
      invalidateKeys(variables).forEach(key => {
        queryClient.invalidateQueries({ queryKey: key as any });
      });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

// ------------------------------------------------
// PURCHASE ORDER MODULE HOOKS
// ------------------------------------------------

type PurchaseOrderSetupPayload = TParams & { id?: TId };
type PurchaseOrderPayload = TParams & { id?: TId };

// --- 1. Purchase Order Statuses ---

export function useGetPurchaseOrderStatuses<TData = TEntity[]>(
  options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>
) {
  return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
    queryKey: ["purchase-order-statuses"],
    queryFn: async () => {
      const response = await dummyApiClient<ApiResponse<TData>>(
        buildUrl("/api/get-purchase-order-statuses")
      );
      return response;
    },
    select: (response) => response.data as TData,
    staleTime: Infinity,
    ...options,
  });
}

export function useAddPurchaseOrderStatus() {
  return useBaseMutation<TEntity, PurchaseOrderSetupPayload>(
    ["add-purchase-order-status"],
    () => "/api/add-purchase-order-status",
    'post',
    () => [['purchase-order-statuses']]
  );
}

export function useUpdatePurchaseOrderStatus() {
  return useBaseMutation<TEntity, PurchaseOrderSetupPayload & { id: TId }>(
    ["update-purchase-order-status"],
    (payload) => `/api/update-purchase-order-status/${payload.id}`,
    'put',
    () => [['purchase-order-statuses']]
  );
}

export function useDeletePurchaseOrderStatus() {
  return useBaseMutation<TEntity, { id: TId }>(
    ["delete-purchase-order-status"],
    (payload) => `/api/delete-purchase-order-status/${payload.id}`,
    'delete',
    () => [['purchase-order-statuses']]
  );
}

// --- 2. Purchase Order Ship Via ---

export function useGetPurchaseOrderShipVias<TData = TEntity[]>(
  options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>
) {
  return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
    queryKey: ["purchase-order-ship-vias"],
    queryFn: async () => {
      const response = await dummyApiClient<ApiResponse<TData>>(
        buildUrl("/api/get-purchase-order-ship-vias")
      );
      return response;
    },
    select: (response) => response.data as TData,
    staleTime: Infinity,
    ...options,
  });
}

export function useAddPurchaseOrderShipVia() {
  return useBaseMutation<TEntity, PurchaseOrderSetupPayload>(
    ["add-purchase-order-ship-via"],
    () => "/api/add-purchase-order-ship-via",
    'post',
    () => [['purchase-order-ship-vias']]
  );
}

export function useUpdatePurchaseOrderShipVia() {
  return useBaseMutation<TEntity, PurchaseOrderSetupPayload & { id: TId }>(
    ["update-purchase-order-ship-via"],
    (payload) => `/api/update-purchase-order-ship-via/${payload.id}`,
    'put',
    () => [['purchase-order-ship-vias']]
  );
}

export function useDeletePurchaseOrderShipVia() {
  return useBaseMutation<TEntity, { id: TId }>(
    ["delete-purchase-order-ship-via"],
    (payload) => `/api/delete-purchase-order-ship-via/${payload.id}`,
    'delete',
    () => [['purchase-order-ship-vias']]
  );
}

// --- 3. Main Purchase Order Queries/Mutations ---

export function useGetPurchaseOrders<TData = TEntity[]>(
  options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>
) {
  return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
    queryKey: ["purchase-orders"],
    queryFn: async () => {
      const response = await dummyApiClient<ApiResponse<TData>>(
        buildUrl("/api/get-purchase-orders")
      );
      return response;
    },
    select: (response) => response.data as TData,
    staleTime: Infinity,
    ...options,
  });
}

export function useGetPurchaseOrder<TData = TEntity>(
  id: TId,
  options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>
) {
  return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
    queryKey: ["purchase-order", id],
    queryFn: async () => {
      const response = await dummyApiClient<ApiResponse<TData>>(
        buildUrl(`/api/get-purchase-order/${id}`)
      );
      return response;
    },
    select: (response) => response.data as TData,
    enabled: !!id,
    ...options,
  });
}

export function useAddPurchaseOrder() {
  return useBaseMutation<TEntity, PurchaseOrderPayload>(
    ["add-purchase-order"],
    () => "/api/add-purchase-order",
    'post',
    () => [['purchase-orders']]
  );
}

export function useUpdatePurchaseOrder() {
  return useBaseMutation<TEntity, PurchaseOrderPayload & { id: TId }>(
    ["update-purchase-order"],
    (payload) => `/api/update-purchase-order/${payload.id}`,
    'put',
    (payload) => [['purchase-orders'], ['purchase-order', payload.id]]
  );
}

export function useDeletePurchaseOrder() {
  return useBaseMutation<TEntity, { id: TId }>(
    ["delete-purchase-order"],
    (payload) => `/api/delete-purchase-order/${payload.id}`,
    'delete',
    (payload) => [['purchase-orders'], ['purchase-order', payload.id]]
  );
}