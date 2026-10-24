"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { dummyApiClient } from "@/lib/api/axios";
import type { ApiError, ApiResponse } from "@/types/types";
import {
  buildUrl,
  useBaseMutation,
  type TEntity,
  type TId,
  type TParams,
} from "./_helpers";

type CustomerPayload = TParams & { id?: TId };
type CustomerDiscountPayload = TParams & { id?: TId };
type SettingPayload = TParams & { id?: TId };

type CustomerQuery = {
  search?: string;
  location_id?: string;
  type_id?: string;
  size?: number;
  page?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
};

export function useGetCustomers<TData = TEntity[]>(
  options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>
) {
  return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
    queryKey: ["customers"],
    queryFn: async () =>
      dummyApiClient<ApiResponse<TData>>(buildUrl("/api/get-customers")),
    select: (response) => response.data as TData,
    staleTime: Infinity,
    ...options,
  });
}

export function useGetCustomersPaginated<TPaginated = unknown>(
  query: CustomerQuery,
  options?: UseQueryOptions<
    ApiResponse<TPaginated>,
    AxiosError<ApiError>,
    TPaginated
  >
) {
  return useQuery<ApiResponse<TPaginated>, AxiosError<ApiError>, TPaginated>({
    queryKey: ["customers", query],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (query.search?.trim()) params.set("search", query.search.trim());
      if (query.location_id) params.set("location_id", query.location_id);
      if (query.type_id) params.set("type_id", query.type_id);
      if (typeof query.size === "number")
        params.set("size", String(query.size));
      if (typeof query.page === "number")
        params.set("page", String(query.page));
      if (query.sort_by) params.set("sort_by", query.sort_by);
      if (query.sort_order) params.set("sort_order", query.sort_order);
      const url = buildUrl(
        `/api/get-customers${params.toString() ? `?${params.toString()}` : ""}`
      );
      return dummyApiClient<ApiResponse<TPaginated>>(url);
    },
    select: (response) => response.data as TPaginated,
    ...options,
  });
}

export function useGetCustomer<TData = TEntity>(
  id: TId,
  options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>
) {
  return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
    queryKey: ["customer", id],
    queryFn: async () =>
      dummyApiClient<ApiResponse<TData>>(buildUrl(`/api/get-customer/${id}`)),
    select: (response) => response.data as TData,
    enabled: !!id,
    ...options,
  });
}

export function useGetCustomerDiscounts<TData = TEntity[]>(
  options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>
) {
  return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
    queryKey: ["customer-discounts"],
    queryFn: async () =>
      dummyApiClient<ApiResponse<TData>>(
        buildUrl("/api/get-customer-discounts")
      ),
    select: (response) => response.data as TData,
    staleTime: Infinity,
    ...options,
  });
}

export function useGetSettings<TData = TEntity[]>(
  options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>
) {
  return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
    queryKey: ["settings"],
    queryFn: async () =>
      dummyApiClient<ApiResponse<TData>>(buildUrl("/api/get-settings")),
    select: (response) => response.data as TData,
    staleTime: Infinity,
    ...options,
  });
}

export function useAddCustomer() {
  return useBaseMutation<TEntity, CustomerPayload>(
    ["add-customer"],
    () => "/api/add-customer",
    "post",
    () => [["customers"]]
  );
}

export function useUpdateCustomer() {
  return useBaseMutation<TEntity, CustomerPayload & { id: TId }>(
    ["update-customer"],
    (payload) => `/api/update-customer/${payload.id}`,
    "put",
    (payload) => [["customers"], ["customer", payload.id]]
  );
}

export function useDeleteCustomer() {
  return useBaseMutation<TEntity, { id: TId }>(
    ["delete-customer"],
    (payload) => `/api/delete-customer/${payload.id}`,
    "delete",
    (payload) => [["customers"], ["customer", payload.id]]
  );
}

export function usePatchCustomerIsActive() {
  return useBaseMutation<TEntity, { id: TId; is_active: boolean }>(
    ["patch-customer-is-active"],
    (payload) => `/api/customer/${payload.id}/is-active`,
    "patch",
    () => [["customers"]]
  );
}

export function useAddCustomerDiscount() {
  return useBaseMutation<TEntity, CustomerDiscountPayload>(
    ["add-customer-discount"],
    () => "/api/add-customer-discount",
    "post",
    () => [["customer-discounts"]]
  );
}

export function useUpdateCustomerDiscount() {
  return useBaseMutation<TEntity, CustomerDiscountPayload & { id: TId }>(
    ["update-customer-discount"],
    (payload) => `/api/update-customer-discount/${payload.id}`,
    "put",
    () => [["customer-discounts"]]
  );
}

export function useDeleteCustomerDiscount() {
  return useBaseMutation<TEntity, { id: TId }>(
    ["delete-customer-discount"],
    (payload) => `/api/delete-customer-discount/${payload.id}`,
    "delete",
    () => [["customer-discounts"]]
  );
}

export function useAddSetting() {
  return useBaseMutation<TEntity, SettingPayload>(
    ["add-setting"],
    () => "/api/add-setting",
    "post",
    () => [["settings"]]
  );
}

export function useDeleteSetting() {
  return useBaseMutation<TEntity, { id: TId }>(
    ["delete-setting"],
    (payload) => `/api/delete-setting/${payload.id}`,
    "delete",
    () => [["settings"]]
  );
}
