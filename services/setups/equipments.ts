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
const buildUrl = (path: string) => path;

/**
 * Base mutation hook for all CRUD operations.
 */
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
// EQUIPMENT MODULE HOOKS
// ------------------------------------------------

type EquipmentSetupPayload = TParams & { id?: TId };
type EquipmentPayload = TParams & { id?: TId };

// --- 1. Equipment Colors ---

export function useGetEquipmentColors<TData = TEntity[]>(options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>) {
    return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
        queryKey: ["equipment-colors"],
        queryFn: async () => {
            const response = await dummyApiClient<ApiResponse<TData>>(buildUrl("/api/get-equipment-colors"));
            return response;
        },
        select: (response) => response.data as TData,
        staleTime: Infinity,
        ...options,
    });
}

export function useAddEquipmentColor() {
    return useBaseMutation<TEntity, EquipmentSetupPayload>(
        ["add-equipment-color"],
        () => "/api/add-equipment-color",
        'post',
        () => [['equipment-colors']]
    );
}

export function useUpdateEquipmentColor() {
    return useBaseMutation<TEntity, EquipmentSetupPayload & { id: TId }>(
        ["update-equipment-color"],
        (payload) => `/api/update-equipment-color/${payload.id}`,
        'put',
        () => [['equipment-colors']]
    );
}

export function useDeleteEquipmentColor() {
    return useBaseMutation<TEntity, { id: TId }>(
        ["delete-equipment-color"],
        (payload) => `/api/delete-equipment-color/${payload.id}`,
        'delete',
        () => [['equipment-colors']]
    );
}

// --- 2. Equipment Makes ---

export function useGetEquipmentMakes<TData = TEntity[]>(options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>) {
    return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
        queryKey: ["equipment-makes"],
        queryFn: async () => {
            const response = await dummyApiClient<ApiResponse<TData>>(buildUrl("/api/get-equipment-makes"));
            return response;
        },
        select: (response) => response.data as TData,
        staleTime: Infinity,
        ...options,
    });
}

export function useAddEquipmentMake() {
    return useBaseMutation<TEntity, EquipmentSetupPayload>(
        ["add-equipment-make"],
        () => "/api/add-equipment-make",
        'post',
        () => [['equipment-makes']]
    );
}

export function useUpdateEquipmentMake() {
    return useBaseMutation<TEntity, EquipmentSetupPayload & { id: TId }>(
        ["update-equipment-make"],
        (payload) => `/api/update-equipment-make/${payload.id}`,
        'put',
        () => [['equipment-makes']]
    );
}

export function useDeleteEquipmentMake() {
    return useBaseMutation<TEntity, { id: TId }>(
        ["delete-equipment-make"],
        (payload) => `/api/delete-equipment-make/${payload.id}`,
        'delete',
        () => [['equipment-makes']]
    );
}

// --- 3. Equipment Meter Types ---

export function useGetEquipmentMeterTypes<TData = TEntity[]>(options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>) {
    return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
        queryKey: ["equipment-meter-types"],
        queryFn: async () => {
            const response = await dummyApiClient<ApiResponse<TData>>(buildUrl("/api/get-equipment-meter-types"));
            return response;
        },
        select: (response) => response.data as TData,
        staleTime: Infinity,
        ...options,
    });
}

export function useAddEquipmentMeterType() {
    return useBaseMutation<TEntity, EquipmentSetupPayload>(
        ["add-equipment-meter-type"],
        () => "/api/add-equipment-meter-type",
        'post',
        () => [['equipment-meter-types']]
    );
}

export function useUpdateEquipmentMeterType() {
    return useBaseMutation<TEntity, EquipmentSetupPayload & { id: TId }>(
        ["update-equipment-meter-type"],
        (payload) => `/api/update-equipment-meter-type/${payload.id}`,
        'put',
        () => [['equipment-meter-types']]
    );
}

export function useDeleteEquipmentMeterType() {
    return useBaseMutation<TEntity, { id: TId }>(
        ["delete-equipment-meter-type"],
        (payload) => `/api/delete-equipment-meter-type/${payload.id}`,
        'delete',
        () => [['equipment-meter-types']]
    );
}

// --- 4. Equipment Models ---

export function useGetEquipmentModels<TData = TEntity[]>(options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>) {
    return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
        queryKey: ["equipment-models"],
        queryFn: async () => {
            const response = await dummyApiClient<ApiResponse<TData>>(buildUrl("/api/get-equipment-models"));
            return response;
        },
        select: (response) => response.data as TData,
        staleTime: Infinity,
        ...options,
    });
}

export function useAddEquipmentModel() {
    return useBaseMutation<TEntity, EquipmentSetupPayload>(
        ["add-equipment-model"],
        () => "/api/add-equipment-model",
        'post',
        () => [['equipment-models']]
    );
}

export function useUpdateEquipmentModel() {
    return useBaseMutation<TEntity, EquipmentSetupPayload & { id: TId }>(
        ["update-equipment-model"],
        (payload) => `/api/update-equipment-model/${payload.id}`,
        'put',
        () => [['equipment-models']]
    );
}

export function useDeleteEquipmentModel() {
    return useBaseMutation<TEntity, { id: TId }>(
        ["delete-equipment-model"],
        (payload) => `/api/delete-equipment-model/${payload.id}`,
        'delete',
        () => [['equipment-models']]
    );
}

// --- 5. Equipment Renewals ---

export function useGetEquipmentRenewals<TData = TEntity[]>(options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>) {
    return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
        queryKey: ["equipment-renewals"],
        queryFn: async () => {
            const response = await dummyApiClient<ApiResponse<TData>>(buildUrl("/api/get-equipment-renewals"));
            return response;
        },
        select: (response) => response.data as TData,
        staleTime: Infinity,
        ...options,
    });
}

export function useAddEquipmentRenewal() {
    return useBaseMutation<TEntity, EquipmentSetupPayload>(
        ["add-equipment-renewal"],
        () => "/api/add-equipment-renewal",
        'post',
        () => [['equipment-renewals']]
    );
}

export function useUpdateEquipmentRenewal() {
    return useBaseMutation<TEntity, EquipmentSetupPayload & { id: TId }>(
        ["update-equipment-renewal"],
        (payload) => `/api/update-equipment-renewal/${payload.id}`,
        'put',
        () => [['equipment-renewals']]
    );
}

export function useDeleteEquipmentRenewal() {
    return useBaseMutation<TEntity, { id: TId }>(
        ["delete-equipment-renewal"],
        (payload) => `/api/delete-equipment-renewal/${payload.id}`,
        'delete',
        () => [['equipment-renewals']]
    );
}

// --- 6. Equipment Statuses ---

export function useGetEquipmentStatuses<TData = TEntity[]>(options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>) {
    return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
        queryKey: ["equipment-statuses"],
        queryFn: async () => {
            const response = await dummyApiClient<ApiResponse<TData>>(buildUrl("/api/get-equipment-statuses"));
            return response;
        },
        select: (response) => response.data as TData,
        staleTime: Infinity,
        ...options,
    });
}

export function useAddEquipmentStatus() {
    return useBaseMutation<TEntity, EquipmentSetupPayload>(
        ["add-equipment-status"],
        () => "/api/add-equipment-status",
        'post',
        () => [['equipment-statuses']]
    );
}

export function useUpdateEquipmentStatus() {
    return useBaseMutation<TEntity, EquipmentSetupPayload & { id: TId }>(
        ["update-equipment-status"],
        (payload) => `/api/update-equipment-status/${payload.id}`,
        'put',
        () => [['equipment-statuses']]
    );
}

export function useDeleteEquipmentStatus() {
    return useBaseMutation<TEntity, { id: TId }>(
        ["delete-equipment-status"],
        (payload) => `/api/delete-equipment-status/${payload.id}`,
        'delete',
        () => [['equipment-statuses']]
    );
}

// --- 7. Equipment Types ---

export function useGetEquipmentTypes<TData = TEntity[]>(options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>) {
    return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
        queryKey: ["equipment-types"],
        queryFn: async () => {
            const response = await dummyApiClient<ApiResponse<TData>>(buildUrl("/api/get-equipment-types"));
            return response;
        },
        select: (response) => response.data as TData,
        staleTime: Infinity,
        ...options,
    });
}

export function useAddEquipmentType() {
    return useBaseMutation<TEntity, EquipmentSetupPayload>(
        ["add-equipment-type"],
        () => "/api/add-equipment-type",
        'post',
        () => [['equipment-types']]
    );
}

export function useUpdateEquipmentType() {
    return useBaseMutation<TEntity, EquipmentSetupPayload & { id: TId }>(
        ["update-equipment-type"],
        (payload) => `/api/update-equipment-type/${payload.id}`,
        'put',
        () => [['equipment-types']]
    );
}

export function useDeleteEquipmentType() {
    return useBaseMutation<TEntity, { id: TId }>(
        ["delete-equipment-type"],
        (payload) => `/api/delete-equipment-type/${payload.id}`,
        'delete',
        () => [['equipment-types']]
    );
}

// --- 8. Equipment Ownerships ---

export function useGetEquipmentOwnerships<TData = TEntity[]>(options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>) {
    return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
        queryKey: ["equipment-ownerships"],
        queryFn: async () => {
            const response = await dummyApiClient<ApiResponse<TData>>(buildUrl("/api/get-equipment-ownerships"));
            return response;
        },
        select: (response) => response.data as TData,
        staleTime: Infinity,
        ...options,
    });
}

export function useAddEquipmentOwnership() {
    return useBaseMutation<TEntity, EquipmentSetupPayload>(
        ["add-equipment-ownership"],
        () => "/api/add-equipment-ownership",
        'post',
        () => [['equipment-ownerships']]
    );
}

export function useUpdateEquipmentOwnership() {
    return useBaseMutation<TEntity, EquipmentSetupPayload & { id: TId }>(
        ["update-equipment-ownership"],
        (payload) => `/api/update-equipment-ownership/${payload.id}`,
        'put',
        () => [['equipment-ownerships']]
    );
}

export function useDeleteEquipmentOwnership() {
    return useBaseMutation<TEntity, { id: TId }>(
        ["delete-equipment-ownership"],
        (payload) => `/api/delete-equipment-ownership/${payload.id}`,
        'delete',
        () => [['equipment-ownerships']]
    );
}

// --- 9. General Expense Types ---

export function useGetExpenseTypes<TData = TEntity[]>(options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>) {
    return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
        queryKey: ["expense-types"],
        queryFn: async () => {
            const response = await dummyApiClient<ApiResponse<TData>>(buildUrl("/api/get-expense-types"));
            return response;
        },
        select: (response) => response.data as TData,
        staleTime: Infinity,
        ...options,
    });
}

export function useAddExpenseType() {
    return useBaseMutation<TEntity, EquipmentSetupPayload>(
        ["add-expense-type"],
        () => "/api/add-expense-type",
        'post',
        () => [['expense-types']]
    );
}

export function useUpdateExpenseType() {
    return useBaseMutation<TEntity, EquipmentSetupPayload & { id: TId }>(
        ["update-expense-type"],
        (payload) => `/api/update-expense-type/${payload.id}`,
        'put',
        () => [['expense-types']]
    );
}

export function useDeleteExpenseType() {
    return useBaseMutation<TEntity, { id: TId }>(
        ["delete-expense-type"],
        (payload) => `/api/delete-expense-type/${payload.id}`,
        'delete',
        () => [['expense-types']]
    );
}

// --- 10. Main Equipment CRUD ---

export function useGetEquipments<TData = TEntity[]>(options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>) {
    return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
        queryKey: ["equipments"],
        queryFn: async () => {
            const response = await dummyApiClient<ApiResponse<TData>>(buildUrl("/api/get-equipments"));
            return response;
        },
        select: (response) => response.data as TData,
        staleTime: Infinity,
        ...options,
    });
}

type PaginationParams = {
    search?: string;
    location_id?: string;
    page?: number;
    size?: number;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
};

export function useGetEquipmentsPaginated<TData = any>(
    params: PaginationParams = {},
    options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>
) {
    const queryParams = new URLSearchParams();

    if (params.search) queryParams.set('search', params.search);
    if (params.location_id) queryParams.set('location_id', params.location_id);
    if (params.page) queryParams.set('page', String(params.page));
    if (params.size) queryParams.set('size', String(params.size));
    if (params.sort_by) queryParams.set('sort_by', params.sort_by);
    if (params.sort_order) queryParams.set('sort_order', params.sort_order);

    const queryString = queryParams.toString();
    const url = queryString ? `/api/get-equipments?${queryString}` : '/api/get-equipments';

    return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
        queryKey: ["equipments-paginated", params],
        queryFn: async () => {
            const response = await dummyApiClient<ApiResponse<TData>>(buildUrl(url));
            return response;
        },
        staleTime: 0,
        ...options,
    });
}

export function useGetEquipment<TData = TEntity>(id: TId, options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>) {
    return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
        queryKey: ["equipment", id],
        queryFn: async () => {
            const response = await dummyApiClient<ApiResponse<TData>>(buildUrl(`/api/get-equipment/${id}`));
            return response;
        },
        select: (response) => response.data as TData,
        enabled: !!id,
        ...options,
    });
}

export function useAddEquipment() {
    return useBaseMutation<TEntity, EquipmentPayload>(
        ["add-equipment"],
        () => "/api/add-equipment",
        'post',
        () => [['equipments'], ['equipments-paginated']]
    );
}

export function useUpdateEquipment() {
    return useBaseMutation<TEntity, EquipmentPayload & { id: TId }>(
        ["update-equipment"],
        (payload) => `/api/update-equipment/${payload.id}`,
        'put',
        (payload) => [['equipments'], ['equipment', payload.id]]
    );
}

export function useDeleteEquipment() {
    return useBaseMutation<TEntity, { id: TId }>(
        ["delete-equipment"],
        (payload) => `/api/delete-equipment/${payload.id}`,
        'delete',
        (payload) => [['equipments'], ['equipment', payload.id]]
    );
}

export function useDeleteEquipmentAttachment() {
    return useBaseMutation<TEntity, { id: TId; equipmentId?: TId }>(
        ["delete-equipment-attachment"],
        (payload) => `/api/delete-equipment-attachment/${payload.id}`,
        'delete',
        (payload) => payload.equipmentId
            ? [['equipments'], ['equipment', payload.equipmentId]]
            : [['equipments']]
    );
}