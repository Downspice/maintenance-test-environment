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
// INVENTORY MODULE HOOKS
// ------------------------------------------------

type InventorySetupPayload = TParams & { id?: TId };
type InventoryPayload = TParams & { id?: TId };

// --- 1. Inventory Categories ---

export function useGetInventoryCategories<TData = TEntity[]>(
  options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>
) {
  return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
    queryKey: ["inventory-categories"],
    queryFn: async () => {
      const response = await dummyApiClient<ApiResponse<TData>>(
        buildUrl("/api/get-inventory-categories")
      );
      return response;
    },
    select: (response) => response.data as TData,
    staleTime: Infinity,
    ...options,
  });
}

export function useAddInventoryCategory() {
  return useBaseMutation<TEntity, InventorySetupPayload>(
    ["add-inventory-category"],
    () => "/api/add-inventory-category",
    'post',
    () => [['inventory-categories']]
  );
}

export function useUpdateInventoryCategory() {
  return useBaseMutation<TEntity, InventorySetupPayload & { id: TId }>(
    ["update-inventory-category"],
    (payload) => `/api/update-inventory-category/${payload.id}`,
    'put',
    () => [['inventory-categories']]
  );
}

export function useDeleteInventoryCategory() {
  return useBaseMutation<TEntity, { id: TId }>(
    ["delete-inventory-category"],
    (payload) => `/api/delete-inventory-category/${payload.id}`,
    'delete',
    () => [['inventory-categories']]
  );
}

// --- 2. Inventory Manufacturers ---

export function useGetInventoryManufacturers<TData = TEntity[]>(
  options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>
) {
  return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
    queryKey: ["inventory-manufacturers"],
    queryFn: async () => {
      const response = await dummyApiClient<ApiResponse<TData>>(
        buildUrl("/api/get-inventory-manufacturers")
      );
      return response;
    },
    select: (response) => response.data as TData,
    staleTime: Infinity,
    ...options,
  });
}

export function useAddInventoryManufacturer() {
  return useBaseMutation<TEntity, InventorySetupPayload>(
    ["add-inventory-manufacturer"],
    () => "/api/add-inventory-manufacturer",
    'post',
    () => [['inventory-manufacturers']]
  );
}

export function useUpdateInventoryManufacturer() {
  return useBaseMutation<TEntity, InventorySetupPayload & { id: TId }>(
    ["update-inventory-manufacturer"],
    (payload) => `/api/update-inventory-manufacturer/${payload.id}`,
    'put',
    () => [['inventory-manufacturers']]
  );
}

export function useDeleteInventoryManufacturer() {
  return useBaseMutation<TEntity, { id: TId }>(
    ["delete-inventory-manufacturer"],
    (payload) => `/api/delete-inventory-manufacturer/${payload.id}`,
    'delete',
    () => [['inventory-manufacturers']]
  );
}

// --- 3. Inventory Unit Types ---

export function useGetInventoryUnitTypes<TData = TEntity[]>(
  options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>
) {
  return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
    queryKey: ["inventory-unit-types"],
    queryFn: async () => {
      const response = await dummyApiClient<ApiResponse<TData>>(
        buildUrl("/api/get-inventory-unit-types")
      );
      return response;
    },
    select: (response) => response.data as TData,
    staleTime: Infinity,
    ...options,
  });
}

export function useAddInventoryUnitType() {
  return useBaseMutation<TEntity, InventorySetupPayload>(
    ["add-inventory-unit-type"],
    () => "/api/add-inventory-unit-type",
    'post',
    () => [['inventory-unit-types']]
  );
}

export function useUpdateInventoryUnitType() {
  return useBaseMutation<TEntity, InventorySetupPayload & { id: TId }>(
    ["update-inventory-unit-type"],
    (payload) => `/api/update-inventory-unit-type/${payload.id}`,
    'put',
    () => [['inventory-unit-types']]
  );
}

export function useDeleteInventoryUnitType() {
  return useBaseMutation<TEntity, { id: TId }>(
    ["delete-inventory-unit-type"],
    (payload) => `/api/delete-inventory-unit-type/${payload.id}`,
    'delete',
    () => [['inventory-unit-types']]
  );
}

// --- 4. Cost Centers ---

export function useGetCostCenters<TData = TEntity[]>(
  options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>
) {
  return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
    queryKey: ["cost-centers"],
    queryFn: async () => {
      const response = await dummyApiClient<ApiResponse<TData>>(
        buildUrl("/api/get-cost-centers")
      );
      return response;
    },
    select: (response) => response.data as TData,
    staleTime: Infinity,
    ...options,
  });
}

export function useAddCostCenter() {
  return useBaseMutation<TEntity, InventorySetupPayload>(
    ["add-cost-center"],
    () => "/api/add-cost-center",
    'post',
    () => [['cost-centers']]
  );
}

export function useUpdateCostCenter() {
  return useBaseMutation<TEntity, InventorySetupPayload & { id: TId }>(
    ["update-cost-center"],
    (payload) => `/api/update-cost-center/${payload.id}`,
    'put',
    () => [['cost-centers']]
  );
}

export function useDeleteCostCenter() {
  return useBaseMutation<TEntity, { id: TId }>(
    ["delete-cost-center"],
    (payload) => `/api/delete-cost-center/${payload.id}`,
    'delete',
    () => [['cost-centers']]
  );
}

// --- 5. Inventory Tracking Types ---

export function useGetInventoryTrackingTypes<TData = TEntity[]>(
  options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>
) {
  return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
    queryKey: ["inventory-tracking-types"],
    queryFn: async () => {
      const response = await dummyApiClient<ApiResponse<TData>>(
        buildUrl("/api/get-inventory-tracking-types")
      );
      return response;
    },
    select: (response) => response.data as TData,
    staleTime: Infinity,
    ...options,
  });
}

export function useAddInventoryTrackingType() {
  return useBaseMutation<TEntity, InventorySetupPayload>(
    ["add-inventory-tracking-type"],
    () => "/api/add-inventory-tracking-type",
    'post',
    () => [['inventory-tracking-types']]
  );
}

export function useUpdateInventoryTrackingType() {
  return useBaseMutation<TEntity, InventorySetupPayload & { id: TId }>(
    ["update-inventory-tracking-type"],
    (payload) => `/api/update-inventory-tracking-type/${payload.id}`,
    'put',
    () => [['inventory-tracking-types']]
  );
}

export function useDeleteInventoryTrackingType() {
  return useBaseMutation<TEntity, { id: TId }>(
    ["delete-inventory-tracking-type"],
    (payload) => `/api/delete-inventory-tracking-type/${payload.id}`,
    'delete',
    () => [['inventory-tracking-types']]
  );
}

// --- 6. Markup Types ---

export function useGetMarkupTypes<TData = TEntity[]>(
  options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>
) {
  return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
    queryKey: ["markup-types"],
    queryFn: async () => {
      const response = await dummyApiClient<ApiResponse<TData>>(
        buildUrl("/api/get-markup-types")
      );
      return response;
    },
    select: (response) => response.data as TData,
    staleTime: Infinity,
    ...options,
  });
}

export function useAddMarkupType() {
  return useBaseMutation<TEntity, InventorySetupPayload>(
    ["add-markup-type"],
    () => "/api/add-markup-type",
    'post',
    () => [['markup-types']]
  );
}

export function useUpdateMarkupType() {
  return useBaseMutation<TEntity, InventorySetupPayload & { id: TId }>(
    ["update-markup-type"],
    (payload) => `/api/update-markup-type/${payload.id}`,
    'put',
    () => [['markup-types']]
  );
}

export function useDeleteMarkupType() {
  return useBaseMutation<TEntity, { id: TId }>(
    ["delete-markup-type"],
    (payload) => `/api/delete-markup-type/${payload.id}`,
    'delete',
    () => [['markup-types']]
  );
}

// --- 7. Warehouses ---

export function useGetWarehouses<TData = TEntity[]>(
  options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>
) {
  return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
    queryKey: ["warehouses"],
    queryFn: async () => {
      const response = await dummyApiClient<ApiResponse<TData>>(
        buildUrl("/api/get-warehouses")
      );
      return response;
    },
    select: (response) => response.data as TData,
    staleTime: Infinity,
    ...options,
  });
}

export function useAddWarehouse() {
  return useBaseMutation<TEntity, InventorySetupPayload>(
    ["add-warehouse"],
    () => "/api/add-warehouse",
    'post',
    () => [['warehouses']]
  );
}

export function useUpdateWarehouse() {
  return useBaseMutation<TEntity, InventorySetupPayload & { id: TId }>(
    ["update-warehouse"],
    (payload) => `/api/update-warehouse/${payload.id}`,
    'put',
    () => [['warehouses']]
  );
}

export function useDeleteWarehouse() {
  return useBaseMutation<TEntity, { id: TId }>(
    ["delete-warehouse"],
    (payload) => `/api/delete-warehouse/${payload.id}`,
    'delete',
    () => [['warehouses']]
  );
}

// --- 8. Main Inventory Queries/Mutations ---

export function useGetInventories<TData = TEntity[]>(
  options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>
) {
  return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
    queryKey: ["inventories"],
    queryFn: async () => {
      const response = await dummyApiClient<ApiResponse<TData>>(
        buildUrl("/api/get-inventories")
      );
      return response;
    },
    select: (response) => response.data as TData,
    staleTime: Infinity,
    ...options,
  });
}

// Paginated inventories with server-side filters and search
type InventoryQuery = {
  search?: string;
  location_id?: string;
  category_id?: string;
  low_stock?: number;
  out_of_stock?: number;
  po_assigned?: number;
  size?: number; // page size
  page?: number; // 1-based page index as required by API
  sort_by?: string;
  sort_order?: "asc" | "desc";
};

export function useGetInventoriesPaginated<TPaginated = any>(
  query: InventoryQuery,
  options?: UseQueryOptions<ApiResponse<TPaginated>, AxiosError<ApiError>, TPaginated>
) {
  return useQuery<ApiResponse<TPaginated>, AxiosError<ApiError>, TPaginated>({
    queryKey: ["inventories", query],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (query.search && query.search.trim()) params.set("search", query.search.trim());
      if (query.location_id) params.set("location_id", query.location_id);
      if (query.category_id) params.set("category_id", query.category_id);
      if (query.low_stock) params.set("low_stock", String(query.low_stock));
      if (query.out_of_stock) params.set("out_of_stock", String(query.out_of_stock));
      if (query.po_assigned) params.set("po_assigned", String(query.po_assigned));
      if (typeof query.size === "number") params.set("size", String(query.size));
      if (typeof query.page === "number") params.set("page", String(query.page));
      if (query.sort_by) params.set("sort_by", query.sort_by);
      if (query.sort_order) params.set("sort_order", query.sort_order);
      const url = buildUrl(`/api/get-inventories${params.toString() ? `?${params.toString()}` : ""}`);
      const response = await dummyApiClient<ApiResponse<TPaginated>>(url);
      return response;
    },
    select: (response) => response.data as TPaginated,
    ...options,
  });
}

export function useGetInventory<TData = TEntity>(
  id: TId,
  options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>
) {
  return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
    queryKey: ["inventory", id],
    queryFn: async () => {
      const response = await dummyApiClient<ApiResponse<TData>>(
        buildUrl(`/api/get-inventory/${id}`)
      );
      return response;
    },
    select: (response) => response.data as TData,
    enabled: !!id,
    ...options,
  });
}

export function useAddInventory() {
  return useBaseMutation<TEntity, InventoryPayload>(
    ["add-inventory"],
    () => "/api/add-inventory",
    'post',
    () => [['inventories']]
  );
}

export function useUpdateInventory() {
  return useBaseMutation<TEntity, InventoryPayload & { id: TId }>(
    ["update-inventory"],
    (payload) => `/api/update-inventory/${payload.id}`,
    'put',
    (payload) => [['inventories'], ['inventory', payload.id]]
  );
}

export function useUpdateInventoryCategoryForItem() {
  return useBaseMutation<TEntity, InventoryPayload & { id: TId }>(
    ["update-inventory-category-for-item"],
    (payload) => `/api/update-inventory-category/${payload.id}`,
    'put',
    (payload) => [['inventories'], ['inventory', payload.id]]
  );
}

export function useUpdateInventoryMarkup() {
  return useBaseMutation<TEntity, InventoryPayload & { id: TId }>(
    ["update-inventory-markup"],
    (payload) => `/api/update-inventory-markup/${payload.id}`,
    'put',
    (payload) => [['inventories'], ['inventory', payload.id]]
  );
}

export function useEnableInventoryTracking() {
  return useBaseMutation<TEntity, { id: TId }>(
    ["enable-inventory-tracking"],
    (payload) => `/api/enable-inventory-traking/${payload.id}`,
    'put',
    (payload) => [['inventories'], ['inventory', payload.id]]
  );
}

export function useDeleteInventoryAttachment() {
  return useBaseMutation<TEntity, { id: TId }>(
    ["delete-inventory-attachment"],
    (payload) => `/api/delete-inventory-attachment/${payload.id}`,
    'delete',
    (payload) => [['inventories'], ['inventory', payload.id]]
  );
}

export function useDeleteInventory() {
  return useBaseMutation<TEntity, { id: TId }>(
    ["delete-inventory"],
    (payload) => `/api/delete-inventory/${payload.id}`,
    'delete',
    (payload) => [['inventories'], ['inventory', payload.id]]
  );
}