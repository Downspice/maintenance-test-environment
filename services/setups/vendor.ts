'use client';

import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { dummyApiClient } from '@/lib/api/axios';
import type { ApiError, ApiResponse } from '@/types/types';
import {
  buildUrl,
  useBaseMutation,
  type TEntity,
  type TId,
  type TParams,
} from './_helpers';

type VendorPayload = TParams & { id?: TId };
type AttachmentPayload = FormData & { id: TId };
type ContactPayload = TParams & { vendorId: TId; id?: TId };

type VendorQuery = {
  search?: string;
  location_id?: string;
  type_id?: string;
  size?: number;
  page?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
};

export function useGetVendors<TData = TEntity[]>(
  options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>,
) {
  return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
    queryKey: ['vendors'],
    queryFn: async () =>
      dummyApiClient<ApiResponse<TData>>(buildUrl('/api/get-vendors')),
    select: (response) => response.data as TData,
    staleTime: Infinity,
    ...options,
  });
}

export function useGetVendorsPaginated<TPaginated = unknown>(
  query: VendorQuery,
  options?: UseQueryOptions<
    ApiResponse<TPaginated>,
    AxiosError<ApiError>,
    TPaginated
  >,
) {
  return useQuery<ApiResponse<TPaginated>, AxiosError<ApiError>, TPaginated>({
    queryKey: ['vendors', query],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (query.search?.trim()) params.set('search', query.search.trim());
      if (query.location_id) params.set('location_id', query.location_id);
      if (query.type_id) params.set('type_id', query.type_id);
      if (typeof query.size === 'number') params.set('size', String(query.size));
      if (typeof query.page === 'number') params.set('page', String(query.page));
      if (query.sort_by) params.set('sort_by', query.sort_by);
      if (query.sort_order) params.set('sort_order', query.sort_order);
      const url = buildUrl(
        `/api/get-vendors${params.toString() ? `?${params.toString()}` : ''}`,
      );
      return dummyApiClient<ApiResponse<TPaginated>>(url);
    },
    select: (response) => response.data as TPaginated,
    ...options,
  });
}

export function useGetVendorOptions<TData = TEntity[]>(
  options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>,
) {
  return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
    queryKey: ['vendor-options'],
    queryFn: async () =>
      dummyApiClient<ApiResponse<TData>>(buildUrl('/api/get-vendor-options')),
    select: (response) => response.data as TData,
    staleTime: Infinity,
    ...options,
  });
}

export function useGetVendor<TData = TEntity>(
  id: TId,
  options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>,
) {
  return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
    queryKey: ['vendor', id],
    queryFn: async () =>
      dummyApiClient<ApiResponse<TData>>(buildUrl(`/api/get-vendor/${id}`)),
    select: (response) => response.data as TData,
    enabled: !!id,
    ...options,
  });
}

export function useAddVendor() {
  return useBaseMutation<TEntity, VendorPayload>(
    ['add-vendor'],
    () => '/api/add-vendor',
    'post',
    () => [['vendors']],
  );
}

export function useUpdateVendor() {
  return useBaseMutation<TEntity, VendorPayload & { id: TId }>(
    ['update-vendor'],
    (payload) => `/api/update-vendor/${payload.id}`,
    'put',
    (payload) => [['vendors'], ['vendor', payload.id]],
  );
}

export function useDeleteVendor() {
  return useBaseMutation<TEntity, { id: TId }>(
    ['delete-vendor'],
    (payload) => `/api/delete-vendor/${payload.id}`,
    'delete',
    (payload) => [['vendors'], ['vendor', payload.id]],
  );
}

export function usePatchVendorIsActive() {
  return useBaseMutation<TEntity, { id: TId; status_id: string }>(
    ['patch-vendor-is-active'],
    (payload) => `/api/vendor/${payload.id}/is-active`,
    'patch',
    () => [['vendors']],
  );
}

export function useAddVendorAttachment() {
  return useBaseMutation<TEntity, AttachmentPayload>(
    ['add-vendor-attachment'],
    (payload) => `/api/add-vendor-attachment/${payload.id}`,
    'post',
    (payload) => [['vendor', payload.id]],
  );
}

export function useDeleteVendorAttachment() {
  return useBaseMutation<TEntity, { id: TId }>(
    ['delete-vendor-attachment'],
    (payload) => `/api/delete-vendor-attachment/${payload.id}`,
    'delete',
    () => [['vendors']],
  );
}

export function useAddVendorContact() {
  return useBaseMutation<TEntity, ContactPayload & { id: TId }>(
    ['add-vendor-contact'],
    (payload) => `/api/add-vendor-contact/${payload.id}`,
    'post',
    (payload) => [['vendor', payload.id]],
  );
}

export function useUpdateVendorContact() {
  return useBaseMutation<TEntity, ContactPayload & { id: TId }>(
    ['update-vendor-contact'],
    (payload) => `/api/update-vendor-contact/${payload.id}`,
    'put',
    (payload) => [['vendor', payload.vendorId]],
  );
}
