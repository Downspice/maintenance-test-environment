'use client'
import { useQuery, useMutation, useQueryClient, UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

// Assuming these relative imports are correctly configured for the project structure
import { dummyApiClient } from "@/lib/axios";
import { ApiError, ApiResponse } from "@/types/types";

// NOTE: We assume BASEURL is available globally or imported correctly.
const BASEURL = process.env.NEXT_PUBLIC_BASE_URL;

// --- Shared Type Definitions (Copied for file independence) ---
type TId = string | number;
type TEntity = unknown;
type TParams = Record<string, any>;

// --- Shared Helper Functions (Copied for file independence) ---

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
// INVOICE MODULE HOOKS
// ------------------------------------------------

type InvoiceSetupPayload = TParams & { id?: TId };
type InvoicePayload = TParams & { id?: TId };


// --- 1. Item Types Setup Queries/Mutations ---

/**
 * Fetches the list of all Item Types.
 */
export function useGetItemTypes<TData = TEntity[]>(options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>) {
    return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
        queryKey: ["item-types"],
        queryFn: async () => {
            const response = await dummyApiClient<ApiResponse<TData>>(buildUrl("/api/get-item-types"));
            return response;
        },
        select: (response) => response.data as TData,
        staleTime: Infinity,
        ...options,
    });
}

/**
 * Adds a new Item Type. Invalidates the 'item-types' list.
 */
export function useAddItemType() {
    return useBaseMutation<TEntity, InvoiceSetupPayload>(
        ["add-item-type"],
        () => "/api/add-item-type",
        'post',
        () => [['item-types']]
    );
}

/**
 * Updates an existing Item Type. Invalidates the 'item-types' list.
 */
export function useUpdateItemType() {
    return useBaseMutation<TEntity, InvoiceSetupPayload & { id: TId }>(
        ["update-item-type"],
        (payload) => `/api/update-item-type/${payload.id}`,
        'put',
        () => [['item-types']]
    );
}

/**
 * Deletes an Item Type. Invalidates the 'item-types' list.
 */
export function useDeleteItemType() {
    return useBaseMutation<TEntity, { id: TId }>(
        ["delete-item-type"],
        (payload) => `/api/delete-item-type/${payload.id}`,
        'delete',
        () => [['item-types']]
    );
}


// --- 2. Payment Methods Setup Queries/Mutations ---

/**
 * Fetches the list of all Payment Methods.
 */
export function useGetPaymentMethods<TData = TEntity[]>(options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>) {
    return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
        queryKey: ["payment-methods"],
        queryFn: async () => {
            const response = await dummyApiClient<ApiResponse<TData>>(buildUrl("/api/get-payment-methods"));
            return response;
        },
        select: (response) => response.data as TData,
        staleTime: Infinity,
        ...options,
    });
}

/**
 * Adds a new Payment Method. Invalidates the 'payment-methods' list.
 */
export function useAddPaymentMethod() {
    return useBaseMutation<TEntity, InvoiceSetupPayload>(
        ["add-payment-method"],
        () => "/api/add-payment-method",
        'post',
        () => [['payment-methods']]
    );
}

/**
 * Updates an existing Payment Method. Invalidates the 'payment-methods' list.
 */
export function useUpdatePaymentMethod() {
    return useBaseMutation<TEntity, InvoiceSetupPayload & { id: TId }>(
        ["update-payment-method"],
        (payload) => `/api/update-payment-method/${payload.id}`,
        'put',
        () => [['payment-methods']]
    );
}

/**
 * Deletes a Payment Method. Invalidates the 'payment-methods' list.
 */
export function useDeletePaymentMethod() {
    return useBaseMutation<TEntity, { id: TId }>(
        ["delete-payment-method"],
        (payload) => `/api/delete-payment-method/${payload.id}`,
        'delete',
        () => [['payment-methods']]
    );
}


// --- 3. Main Invoice Queries/Mutations ---

/**
 * Fetches the list of all Invoices.
 */
export function useGetInvoices<TData = TEntity[]>(options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>) {
    return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
        queryKey: ["invoices"],
        queryFn: async () => {
            const response = await dummyApiClient<ApiResponse<TData>>(buildUrl("/api/get-invoices"));
            return response;
        },
        select: (response) => response.data as TData,
        staleTime: Infinity,
        ...options,
    });
}

/**
 * Fetches a single Invoice by ID.
 * @param id The ID of the invoice to fetch.
 */
export function useGetInvoice<TData = TEntity>(id: TId, options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>) {
    return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
        queryKey: ["invoice", id],
        queryFn: async () => {
            const response = await dummyApiClient<ApiResponse<TData>>(buildUrl(`/api/get-invoice/${id}`));
            return response;
        },
        select: (response) => response.data as TData,
        enabled: !!id,
        ...options,
    });
}

/**
 * Adds a new Invoice. Invalidates the 'invoices' list.
 */
export function useAddInvoice() {
    return useBaseMutation<TEntity, InvoicePayload>(
        ["add-invoice"],
        () => "/api/add-invoice",
        'post',
        () => [['invoices']]
    );
}

/**
 * Updates an existing Invoice. Invalidates the 'invoices' list and the specific 'invoice' detail query.
 * Expects a payload with an 'id' field.
 */
export function useUpdateInvoice() {
    return useBaseMutation<TEntity, InvoicePayload & { id: TId }>(
        ["update-invoice"],
        (payload) => `/api/update-invoice/${payload.id}`,
        'put',
        (payload) => [['invoices'], ['invoice', payload.id]]
    );
}

/**
 * Deletes an Invoice. Invalidates the 'invoices' list and the specific 'invoice' detail query.
 * Expects a payload with an 'id' field.
 */
export function useDeleteInvoice() {
    return useBaseMutation<TEntity, { id: TId }>(
        ["delete-invoice"],
        (payload) => `/api/delete-invoice/${payload.id}`,
        'delete',
        (payload) => [['invoices'], ['invoice', payload.id]]
    );
}


// --- 4. Invoice Payment Queries/Mutations ---

type InvoicePaymentPayload = TParams & { id?: TId };

/**
 * Fetches the list of all Invoice Payments.
 */
export function useGetInvoicePayments<TData = TEntity[]>(options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>) {
    return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
        queryKey: ["invoice-payments"],
        queryFn: async () => {
            const response = await dummyApiClient<ApiResponse<TData>>(buildUrl("/api/get-invoice-payments"));
            return response;
        },
        select: (response) => response.data as TData,
        staleTime: Infinity,
        ...options,
    });
}

/**
 * Fetches a single Invoice Payment by ID.
 * @param id The ID of the invoice payment to fetch.
 */
export function useGetInvoicePayment<TData = TEntity>(id: TId, options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>) {
    return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
        queryKey: ["invoice-payment", id],
        queryFn: async () => {
            const response = await dummyApiClient<ApiResponse<TData>>(buildUrl(`/api/get-invoice-payment/${id}`));
            return response;
        },
        select: (response) => response.data as TData,
        enabled: !!id,
        ...options,
    });
}

/**
 * Adds a new Invoice Payment. Invalidates the 'invoice-payments' list.
 */
export function useAddInvoicePayment() {
    return useBaseMutation<TEntity, InvoicePaymentPayload>(
        ["add-invoice-payment"],
        () => "/api/add-invoice-payment",
        'post',
        () => [['invoice-payments']]
    );
}

/**
 * Updates an existing Invoice Payment. Invalidates the 'invoice-payments' list and the specific 'invoice-payment' detail query.
 * Expects a payload with an 'id' field.
 */
export function useUpdateInvoicePayment() {
    return useBaseMutation<TEntity, InvoicePaymentPayload & { id: TId }>(
        ["update-invoice-payment"],
        (payload) => `/api/update-invoice-payment/${payload.id}`,
        'put',
        (payload) => [['invoice-payments'], ['invoice-payment', payload.id]]
    );
}

/**
 * Deletes an Invoice Payment. Invalidates the 'invoice-payments' list and the specific 'invoice-payment' detail query.
 * Expects a payload with an 'id' field.
 */
export function useDeleteInvoicePayment() {
    return useBaseMutation<TEntity, { id: TId }>(
        ["delete-invoice-payment"],
        (payload) => `/api/delete-invoice-payment/${payload.id}`,
        'delete',
        (payload) => [['invoice-payments'], ['invoice-payment', payload.id]]
    );
}
