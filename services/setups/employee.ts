'use client'
import { useQuery, useMutation, useQueryClient, UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

// Assuming these relative imports are correctly configured for the project structure
import { dummyApiClient } from "@/lib/axios";
import { ApiError, ApiResponse } from "@/types/types";

// NOTE: We assume BASEURL is available globally or imported correctly.
const BASEURL = process.env.NEXT_PUBLIC_BASE_URL;

// --- Shared Type Definitions (Duplicated for file independence) ---
type TId = string | number;
type TEntity = unknown;
type TParams = Record<string, any>;

// --- Shared Helper Functions (Duplicated for file independence) ---

/**
 * Builds the full API URL for an endpoint.
 * @param path The relative path (e.g., /api/get-employees)
 */
// const buildUrl = (path: string) => `${BASEURL}${path}`;
const buildUrl = (path: string) => path;

/**
 * Base type for all mutation hooks.
 * NOTE: This is duplicated from other module files to keep this file self-contained.
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
            // Invalidate all related queries
            invalidateKeys(variables).forEach(key => {
                queryClient.invalidateQueries({ queryKey: key as any });
            });
            options?.onSuccess?.(data, variables, context);
        },
        ...options,
    });
};


// ------------------------------------------------
// EMPLOYEE MODULE HOOKS
// ------------------------------------------------

type EmployeeSetupPayload = TParams & { id?: TId };
type EmployeePayload = TParams & { id?: TId };
type EmployeeAttachmentPayload = { id: TId };


// --- Employee Type Setup Queries/Mutations ---

/**
 * Fetches the list of all Employee Types.
 */
export function useGetEmployeeTypes<TData = TEntity[]>(options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>) {
    return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
        queryKey: ["employee-types"],
        queryFn: async () => {
            const response = await dummyApiClient<ApiResponse<TData>>(buildUrl("/api/get-employee-types"));
            return response;
        },
        select: (response) => response.data as TData,
        staleTime: Infinity,
        ...options,
    });
}

/**
 * Adds a new Employee Type. Invalidates the 'employee-types' list.
 */
export function useAddEmployeeType() {
    return useBaseMutation<TEntity, EmployeeSetupPayload>(
        ["add-employee-type"],
        () => "/api/add-employee-type",
        'post',
        () => [['employee-types']]
    );
}

/**
 * Updates an existing Employee Type. Invalidates the 'employee-types' list.
 */
export function useUpdateEmployeeType() {
    return useBaseMutation<TEntity, EmployeeSetupPayload & { id: TId }>(
        ["update-employee-type"],
        (payload) => `/api/update-employee-type/${payload.id}`,
        'put',
        () => [['employee-types']]
    );
}

/**
 * Deletes an Employee Type. Invalidates the 'employee-types' list.
 */
export function useDeleteEmployeeType() {
    return useBaseMutation<TEntity, { id: TId }>(
        ["delete-employee-type"],
        (payload) => `/api/delete-employee-type/${payload.id}`,
        'delete',
        () => [['employee-types']]
    );
}


// --- Employee Status Setup Queries/Mutations ---

/**
 * Fetches the list of all Employee Statuses.
 */
export function useGetEmployeeStatuses<TData = TEntity[]>(options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>) {
    return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
        queryKey: ["employee-statuses"],
        queryFn: async () => {
            const response = await dummyApiClient<ApiResponse<TData>>(buildUrl("/api/get-employee-statuses"));
            return response;
        },
        select: (response) => response.data as TData,
        staleTime: Infinity,
        ...options,
    });
}

/**
 * Adds a new Employee Status. Invalidates the 'employee-statuses' list.
 */
export function useAddEmployeeStatus() {
    return useBaseMutation<TEntity, EmployeeSetupPayload>(
        ["add-employee-status"],
        () => "/api/add-employee-status",
        'post',
        () => [['employee-statuses']]
    );
}

/**
 * Updates an existing Employee Status. Invalidates the 'employee-statuses' list.
 */
export function useUpdateEmployeeStatus() {
    return useBaseMutation<TEntity, EmployeeSetupPayload & { id: TId }>(
        ["update-employee-status"],
        (payload) => `/api/update-employee-status/${payload.id}`,
        'put',
        () => [['employee-statuses']]
    );
}

/**
 * Deletes an Employee Status. Invalidates the 'employee-statuses' list.
 */
export function useDeleteEmployeeStatus() {
    return useBaseMutation<TEntity, { id: TId }>(
        ["delete-employee-status"],
        (payload) => `/api/delete-employee-status/${payload.id}`,
        'delete',
        () => [['employee-statuses']]
    );
}


// --- Employee Category Setup Queries/Mutations ---

/**
 * Fetches the list of all Employee Categories.
 */
export function useGetEmployeeCategories<TData = TEntity[]>(options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>) {
    return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
        queryKey: ["employee-categories"],
        queryFn: async () => {
            const response = await dummyApiClient<ApiResponse<TData>>(buildUrl("/api/get-employee-categories"));
            return response;
        },
        select: (response) => response.data as TData,
        staleTime: Infinity,
        ...options,
    });
}

/**
 * Adds a new Employee Category. Invalidates the 'employee-categories' list.
 */
export function useAddEmployeeCategory() {
    return useBaseMutation<TEntity, EmployeeSetupPayload>(
        ["add-employee-category"],
        () => "/api/add-employee-category",
        'post',
        () => [['employee-categories']]
    );
}

/**
 * Updates an existing Employee Category. Invalidates the 'employee-categories' list.
 */
export function useUpdateEmployeeCategory() {
    return useBaseMutation<TEntity, EmployeeSetupPayload & { id: TId }>(
        ["update-employee-category"],
        (payload) => `/api/update-employee-category/${payload.id}`,
        'put',
        () => [['employee-categories']]
    );
}

/**
 * Deletes an Employee Category. Invalidates the 'employee-categories' list.
 */
export function useDeleteEmployeeCategory() {
    return useBaseMutation<TEntity, { id: TId }>(
        ["delete-employee-category"],
        (payload) => `/api/delete-employee-category/${payload.id}`,
        'delete',
        () => [['employee-categories']]
    );
}


// --- Employee Renewals Setup Queries/Mutations ---

/**
 * Fetches the list of all Employee Renewals.
 */
export function useGetEmployeeRenewals<TData = TEntity[]>(options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>) {
    return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
        queryKey: ["employee-renewals"],
        queryFn: async () => {
            const response = await dummyApiClient<ApiResponse<TData>>(buildUrl("/api/get-employee-renewals"));
            return response;
        },
        select: (response) => response.data as TData,
        staleTime: Infinity,
        ...options,
    });
}

/**
 * Adds a new Employee Renewal. Invalidates the 'employee-renewals' list.
 */
export function useAddEmployeeRenewal() {
    return useBaseMutation<TEntity, EmployeeSetupPayload>(
        ["add-employee-renewal"],
        () => "/api/add-employee-renewal",
        'post',
        () => [['employee-renewals']]
    );
}

/**
 * Updates an existing Employee Renewal. Invalidates the 'employee-renewals' list.
 */
export function useUpdateEmployeeRenewal() {
    return useBaseMutation<TEntity, EmployeeSetupPayload & { id: TId }>(
        ["update-employee-renewal"],
        (payload) => `/api/update-employee-renewal/${payload.id}`,
        'put',
        () => [['employee-renewals']]
    );
}

/**
 * Deletes an Employee Renewal. Invalidates the 'employee-renewals' list.
 */
export function useDeleteEmployeeRenewal() {
    return useBaseMutation<TEntity, { id: TId }>(
        ["delete-employee-renewal"],
        (payload) => `/api/delete-employee-renewal/${payload.id}`,
        'delete',
        () => [['employee-renewals']]
    );
}

// --- Main Employee Queries/Mutations ---

/**
 * Fetches the list of all Employees.
 */
export function useGetEmployees<TData = TEntity[]>(options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>) {
    return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
        queryKey: ["employees"],
        queryFn: async () => {
            const response = await dummyApiClient<ApiResponse<TData>>(buildUrl("/api/get-employees"));
            return response;
        },
        select: (response) => response.data as TData,
        staleTime: Infinity,
        ...options,
    });
}

/**
 * Fetches a single Employee by ID.
 * @param id The ID of the employee to fetch.
 */
export function useGetEmployee<TData = TEntity>(id: TId, options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>) {
    return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
        queryKey: ["employee", id],
        queryFn: async () => {
            const response = await dummyApiClient<ApiResponse<TData>>(buildUrl(`/api/get-employee/${id}`));
            return response;
        },
        select: (response) => response.data as TData,
        enabled: !!id,
        ...options,
    });
}

/**
 * Adds a new Employee. Invalidates the 'employees' list.
 */
export function useAddEmployee() {
    return useBaseMutation<TEntity, EmployeePayload>(
        ["add-employee"],
        () => "/api/add-employee",
        'post',
        () => [['employees']]
    );
}

/**
 * Updates an existing Employee. Invalidates the 'employees' list and the specific 'employee' detail query.
 * Expects a payload with an 'id' field.
 */
export function useUpdateEmployee() {
    return useBaseMutation<TEntity, EmployeePayload & { id: TId }>(
        ["update-employee"],
        (payload) => `/api/update-employee/${payload.id}`,
        'put',
        (payload) => [['employees'], ['employee', payload.id]]
    );
}

/**
 * Deletes an Employee. Invalidates the 'employees' list and the specific 'employee' detail query.
 * Expects a payload with an 'id' field.
 */
export function useDeleteEmployee() {
    return useBaseMutation<TEntity, { id: TId }>(
        ["delete-employee"],
        (payload) => `/api/delete-employee/${payload.id}`,
        'delete',
        (payload) => [['employees'], ['employee', payload.id]]
    );
}

/**
 * Deletes an Employee Attachment. Invalidates the 'employees' list.
 * Note: Since we don't know the parent Employee ID, we invalidate the main list for safety.
 * @param id The ID of the attachment to delete.
 */
export function useDeleteEmployeeAttachment() {
    return useBaseMutation<TEntity, EmployeeAttachmentPayload>(
        ["delete-employee-attachment"],
        (payload) => `/api/delete-employee-attachment/${payload.id}`,
        'delete',
        () => [['employees']] 
    );
}
