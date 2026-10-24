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

type VendorTypePayload = { name: string; id?: TId };
type LocationPayload = TParams & { id?: TId };
type POTermPayload = TParams & { id?: TId };
type StatusOnePayload = TParams & { id?: TId };

export function useGetVendorTypes<TData = TEntity[]>(
  options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>
) {
  return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
    queryKey: ["vendor-types"],
    queryFn: async () =>
      dummyApiClient<ApiResponse<TData>>(buildUrl("/api/get-vendor-types")),
    select: (response) => response.data as TData,
    staleTime: Infinity,
    ...options,
  });
}

export function useGetLocations<TData = TEntity[]>(
  options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>
) {
  return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
    queryKey: ["locations"],
    queryFn: async () =>
      dummyApiClient<ApiResponse<TData>>(buildUrl("/api/get-locations")),
    select: (response) => response.data as TData,
    staleTime: Infinity,
    ...options,
  });
}

export function useGetPurchaseOrderTerms<TData = TEntity[]>(
  options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>
) {
  return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
    queryKey: ["purchase-order-terms"],
    queryFn: async () =>
      dummyApiClient<ApiResponse<TData>>(
        buildUrl("/api/get-purchase-order-terms")
      ),
    select: (response) => response.data as TData,
    staleTime: Infinity,
    ...options,
  });
}

export function useGetStatusOnes<TData = TEntity[]>(
  options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>
) {
  return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
    queryKey: ["status-ones"],
    queryFn: async () =>
      dummyApiClient<ApiResponse<TData>>(buildUrl("/api/get-status-one")),
    select: (response) => response.data as TData,
    staleTime: Infinity,
    ...options,
  });
}

export function useAddVendorType() {
  return useBaseMutation<TEntity, VendorTypePayload>(
    ["add-vendor-type"],
    () => "/api/add-vendor-type",
    "post",
    () => [["vendor-types"]]
  );
}

export function useUpdateVendorType() {
  return useBaseMutation<TEntity, VendorTypePayload & { id: TId }>(
    ["update-vendor-type"],
    (payload) => `/api/update-vendor-type/${payload.id}`,
    "put",
    () => [["vendor-types"]]
  );
}

export function useDeleteVendorType() {
  return useBaseMutation<TEntity, { id: TId }>(
    ["delete-vendor-type"],
    (payload) => `/api/delete-vendor-type/${payload.id}`,
    "delete",
    () => [["vendor-types"]]
  );
}

export function useAddLocation() {
  return useBaseMutation<TEntity, LocationPayload>(
    ["add-location"],
    () => "/api/add-location",
    "post",
    () => [["locations"]]
  );
}

export function useUpdateLocation() {
  return useBaseMutation<TEntity, LocationPayload & { id: TId }>(
    ["update-location"],
    (payload) => `/api/update-location/${payload.id}`,
    "put",
    () => [["locations"]]
  );
}

export function useDeleteLocation() {
  return useBaseMutation<TEntity, { id: TId }>(
    ["delete-location"],
    (payload) => `/api/delete-location/${payload.id}`,
    "delete",
    () => [["locations"]]
  );
}

export function useAddPurchaseOrderTerm() {
  return useBaseMutation<TEntity, POTermPayload>(
    ["add-purchase-order-term"],
    () => "/api/add-purchase-order-term",
    "post",
    () => [["purchase-order-terms"]]
  );
}

export function useUpdatePurchaseOrderTerm() {
  return useBaseMutation<TEntity, POTermPayload & { id: TId }>(
    ["update-purchase-order-term"],
    (payload) => `/api/update-purchase-order-term/${payload.id}`,
    "put",
    () => [["purchase-order-terms"]]
  );
}

export function useDeletePurchaseOrderTerm() {
  return useBaseMutation<TEntity, { id: TId }>(
    ["delete-purchase-order-term"],
    (payload) => `/api/delete-purchase-order-term/${payload.id}`,
    "delete",
    () => [["purchase-order-terms"]]
  );
}

export function useAddStatusOne() {
  return useBaseMutation<TEntity, StatusOnePayload>(
    ["add-status-one"],
    () => "/api/add-status-one",
    "post",
    () => [["status-ones"]]
  );
}

export function useUpdateStatusOne() {
  return useBaseMutation<TEntity, StatusOnePayload & { id: TId }>(
    ["update-status-one"],
    (payload) => `/api/update-status-one/${payload.id}`,
    "put",
    () => [["status-ones"]]
  );
}

export function useDeleteStatusOne() {
  return useBaseMutation<TEntity, { id: TId }>(
    ["delete-status-one"],
    (payload) => `/api/delete-status-one/${payload.id}`,
    "delete",
    () => [["status-ones"]]
  );
}
