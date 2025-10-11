import { useQuery, useMutation, useQueryClient, UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
// Assuming these imports and environment variable are correctly configured
import { dummyApiClient } from "@/lib/axios";
import { ApiError, ApiResponse } from "@/types/types";

// NOTE: We assume BASEURL is available globally or imported correctly.
const BASEURL = process.env.NEXT_PUBLIC_BASE_URL;

// --- Type Definitions for better readability ---
// TEntity: The shape of the data item (e.g., Location, VendorType, Vendor)
// TParams: The shape of the data sent in POST/PUT requests
// TId: Type for item IDs, assumed to be string or number

type TId = string | number;
type TEntity = unknown; // Replace 'unknown' with your actual data type (e.g., Vendor, Location)
type TParams = Record<string, any>; // Replace with specific payload types

// --- Helper Functions and Hooks ---

/**
 * Builds the full API URL for an endpoint.
 * @param path The relative path (e.g., /api/get-vendors)
 */
const buildUrl = (path: string) => `${BASEURL}${path}`;

/**
 * Base type for all mutation hooks.
 * @param mutationKey Used for React Query tooling.
 * @param endpoint The API endpoint path.
 * @param method The HTTP method (post, put, delete).
 * @param invalidateKeys An array of query keys to invalidate on success.
 */
const useBaseMutation = <TResponse = TEntity, TPayload = TParams, TContext = unknown>(
    mutationKey: string[],
    endpoint: (payload: TPayload) => string,
    method: 'post' | 'put' | 'delete',
    invalidateKeys: (payload: TPayload) => unknown[], // Function to derive keys from payload
    options?: UseMutationOptions<TResponse, AxiosError<ApiError>, TPayload, TContext>
) => {
    const queryClient = useQueryClient();

    const mutationFn = async (payload: TPayload) => {
        const url = buildUrl(endpoint(payload));
        const { data } = await dummyApiClient[method]<ApiResponse<TResponse>>(url, method !== 'delete' ? payload : undefined);
        return data;
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

// --- QUERY HOOKS (GET) ---

/**
 * Fetches the list of all Vendor Types.
 */
export function useGetVendorTypes<TData = TEntity[]>(options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>) {
    return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
        queryKey: ["vendor-types"],
        queryFn: async () => {
            const { data } = await dummyApiClient<ApiResponse<TData>>(buildUrl("/api/get-vendor-types"));
            return data;
        },
        select: (data) => data.data as TData,
        staleTime: Infinity,
        ...options,
    });
}

/**
 * Fetches the list of all Locations.
 */
export function useGetLocations<TData = TEntity[]>(options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>) {
    return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
        queryKey: ["locations"],
        queryFn: async () => {
            const { data } = await dummyApiClient<ApiResponse<TData>>(buildUrl("/api/get-locations"));
            return data;
        },
        select: (data) => data.data as TData,
        staleTime: Infinity,
        ...options,
    });
}

/**
 * Fetches the list of all Purchase Order Terms.
 */
export function useGetPurchaseOrderTerms<TData = TEntity[]>(options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>) {
    return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
        queryKey: ["purchase-order-terms"],
        queryFn: async () => {
            const { data } = await dummyApiClient<ApiResponse<TData>>(buildUrl("/api/get-purchase-order-terms"));
            return data;
        },
        select: (data) => data.data as TData,
        staleTime: Infinity,
        ...options,
    });
}

/**
 * Fetches the list of all Status Ones.
 */
export function useGetStatusOnes<TData = TEntity[]>(options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>) {
    return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
        queryKey: ["status-ones"],
        queryFn: async () => {
            const { data } = await dummyApiClient<ApiResponse<TData>>(buildUrl("/api/get-status-one"));
            return data;
        },
        select: (data) => data.data as TData,
        staleTime: Infinity,
        ...options,
    });
}

/**
 * Fetches the list of all Vendors.
 */
export function useGetVendors<TData = TEntity[]>(options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>) {
    return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
        queryKey: ["vendors"],
        queryFn: async () => {
            const { data } = await dummyApiClient<ApiResponse<TData>>(buildUrl("/api/get-vendors"));
            return data;
        },
        select: (data) => data.data as TData,
        staleTime: Infinity,
        ...options,
    });
}

/**
 * Fetches a single Vendor by ID.
 * @param id The ID of the vendor to fetch.
 */
export function useGetVendor<TData = TEntity>(id: TId, options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>) {
    return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
        queryKey: ["vendor", id],
        queryFn: async () => {
            const { data } = await dummyApiClient<ApiResponse<TData>>(buildUrl(`/api/get-vendor/${id}`));
            return data;
        },
        select: (data) => data.data as TData,
        enabled: !!id,
        ...options,
    });
}

// --- MUTATION HOOKS (POST, PUT, DELETE) ---

// ------------------------------------------------
// 1. Vendor Type Mutations
// ------------------------------------------------

type VendorTypePayload = { name: string, id?: TId };

/**
 * Adds a new Vendor Type. Invalidates the 'vendor-types' list.
 */
export function useAddVendorType() {
    return useBaseMutation<TEntity, VendorTypePayload>(
        ["add-vendor-type"],
        () => "/api/add-vendor-type",
        'post',
        () => [['vendor-types']]
    );
}

/**
 * Updates an existing Vendor Type. Invalidates the 'vendor-types' list.
 * Expects a payload with an 'id' field.
 */
export function useUpdateVendorType() {
    return useBaseMutation<TEntity, VendorTypePayload & { id: TId }>(
        ["update-vendor-type"],
        (payload) => `/api/update-vendor-type/${payload.id}`,
        'put',
        () => [['vendor-types']]
    );
}

/**
 * Deletes a Vendor Type. Invalidates the 'vendor-types' list.
 * Expects a payload with an 'id' field.
 */
export function useDeleteVendorType() {
    return useBaseMutation<TEntity, { id: TId }>(
        ["delete-vendor-type"],
        (payload) => `/api/delete-vendor-type/${payload.id}`,
        'delete',
        () => [['vendor-types']]
    );
}

// ------------------------------------------------
// 2. Location Mutations
// ------------------------------------------------

type LocationPayload = TParams & { id?: TId };

/**
 * Adds a new Location. Invalidates the 'locations' list.
 */
export function useAddLocation() {
    return useBaseMutation<TEntity, LocationPayload>(
        ["add-location"],
        () => "/api/add-location",
        'post',
        () => [['locations']]
    );
}

/**
 * Updates an existing Location. Invalidates the 'locations' list.
 * Expects a payload with an 'id' field.
 */
export function useUpdateLocation() {
    return useBaseMutation<TEntity, LocationPayload & { id: TId }>(
        ["update-location"],
        (payload) => `/api/update-location/${payload.id}`,
        'put',
        () => [['locations']]
    );
}

/**
 * Deletes a Location. Invalidates the 'locations' list.
 * Expects a payload with an 'id' field.
 */
export function useDeleteLocation() {
    return useBaseMutation<TEntity, { id: TId }>(
        ["delete-location"],
        (payload) => `/api/delete-location/${payload.id}`,
        'delete',
        () => [['locations']]
    );
}

// ------------------------------------------------
// 3. Purchase Order Term Mutations
// ------------------------------------------------

type POTermPayload = TParams & { id?: TId };

/**
 * Adds a new Purchase Order Term. Invalidates the 'purchase-order-terms' list.
 */
export function useAddPurchaseOrderTerm() {
    return useBaseMutation<TEntity, POTermPayload>(
        ["add-purchase-order-term"],
        () => "/api/add-purchase-order-term",
        'post',
        () => [['purchase-order-terms']]
    );
}

/**
 * Updates an existing Purchase Order Term. Invalidates the 'purchase-order-terms' list.
 * Expects a payload with an 'id' field.
 */
export function useUpdatePurchaseOrderTerm() {
    return useBaseMutation<TEntity, POTermPayload & { id: TId }>(
        ["update-purchase-order-term"],
        (payload) => `/api/update-purchase-order-term/${payload.id}`,
        'put',
        () => [['purchase-order-terms']]
    );
}

/**
 * Deletes a Purchase Order Term. Invalidates the 'purchase-order-terms' list.
 * Expects a payload with an 'id' field.
 */
export function useDeletePurchaseOrderTerm() {
    return useBaseMutation<TEntity, { id: TId }>(
        ["delete-purchase-order-term"],
        (payload) => `/api/delete-purchase-order-term/${payload.id}`,
        'delete',
        () => [['purchase-order-terms']]
    );
}

// ------------------------------------------------
// 4. Status One Mutations
// ------------------------------------------------

type StatusOnePayload = TParams & { id?: TId };

/**
 * Adds a new Status One. Invalidates the 'status-ones' list.
 */
export function useAddStatusOne() {
    return useBaseMutation<TEntity, StatusOnePayload>(
        ["add-status-one"],
        () => "/api/add-status-one",
        'post',
        () => [['status-ones']]
    );
}

/**
 * Updates an existing Status One. Invalidates the 'status-ones' list.
 * Expects a payload with an 'id' field.
 */
export function useUpdateStatusOne() {
    return useBaseMutation<TEntity, StatusOnePayload & { id: TId }>(
        ["update-status-one"],
        (payload) => `/api/update-status-one/${payload.id}`,
        'put',
        () => [['status-ones']]
    );
}

/**
 * Deletes a Status One. Invalidates the 'status-ones' list.
 * Expects a payload with an 'id' field.
 */
export function useDeleteStatusOne() {
    return useBaseMutation<TEntity, { id: TId }>(
        ["delete-status-one"],
        (payload) => `/api/delete-status-one/${payload.id}`,
        'delete',
        () => [['status-ones']]
    );
}

// ------------------------------------------------
// 5. Vendor/Contact/Attachment Mutations
// ------------------------------------------------

type VendorPayload = TParams & { id?: TId };
type AttachmentPayload = FormData & { id: TId }; // Assuming attachments use FormData
type ContactPayload = TParams & { id: TId, contactId?: TId }; // 'id' is vendorId, 'contactId' is contact ID for PUT

/**
 * Adds a new Vendor. Invalidates the 'vendors' list.
 */
export function useAddVendor() {
    return useBaseMutation<TEntity, VendorPayload>(
        ["add-vendor"],
        () => "/api/add-vendor",
        'post',
        () => [['vendors']]
    );
}

/**
 * Updates an existing Vendor. Invalidates the 'vendors' list and the specific 'vendor' detail query.
 * Expects a payload with an 'id' field.
 */
export function useUpdateVendor() {
    return useBaseMutation<TEntity, VendorPayload & { id: TId }>(
        ["update-vendor"],
        (payload) => `/api/update-vendor/${payload.id}`,
        'put',
        (payload) => [['vendors'], ['vendor', payload.id]]
    );
}

/**
 * Deletes a Vendor. Invalidates the 'vendors' list and the specific 'vendor' detail query.
 * Expects a payload with an 'id' field.
 */
export function useDeleteVendor() {
    return useBaseMutation<TEntity, { id: TId }>(
        ["delete-vendor"],
        (payload) => `/api/delete-vendor/${payload.id}`,
        'delete',
        (payload) => [['vendors'], ['vendor', payload.id]]
    );
}

// --- Attachments ---

/**
 * Adds a Vendor Attachment. Invalidates the specific 'vendor' detail query.
 * 'id' in payload refers to the Vendor ID.
 */
export function useAddVendorAttachment() {
    return useBaseMutation<TEntity, AttachmentPayload>(
        ["add-vendor-attachment"],
        (payload) => `/api/add-vendor-attachment/${payload.id}`,
        'post',
        (payload) => [['vendor', payload.id]]
    );
}

/**
 * Deletes a Vendor Attachment. Invalidates the specific 'vendor' detail query.
 * 'id' in payload refers to the Attachment ID being deleted.
 */
export function useDeleteVendorAttachment() {
    return useBaseMutation<TEntity, { id: TId }>(
        ["delete-vendor-attachment"],
        (payload) => `/api/delete-vendor-attachment/${payload.id}`,
        'delete',
        () => [['vendor']] // Invalidate all vendor detail queries to refresh attachments
    );
}

// --- Contacts ---

/**
 * Adds a Vendor Contact. Invalidates the specific 'vendor' detail query.
 * 'id' in payload refers to the Vendor ID.
 */
export function useAddVendorContact() {
    return useBaseMutation<TEntity, ContactPayload>(
        ["add-vendor-contact"],
        (payload) => `/api/add-vendor-contact/${payload.id}`,
        'post',
        (payload) => [['vendor', payload.id]]
    );
}

/**
 * Updates an existing Vendor Contact. Invalidates the specific 'vendor' detail query.
 * 'id' in payload refers to the Contact ID.
 */
export function useUpdateVendorContact() {
    // Assuming the URL /api/update-vendor-contact/{id} takes the CONTACT ID, not the vendor ID.
    // If the API structure is different (e.g., /vendor/{vendorId}/contact/{contactId}), adjust accordingly.
    return useBaseMutation<TEntity, ContactPayload & { id: TId }>(
        ["update-vendor-contact"],
        (payload) => `/api/update-vendor-contact/${payload.id}`, // Assuming payload.id is the contact ID
        'put',
        // NOTE: Without the vendorId, we must invalidate all vendor queries or rely on the caller to pass vendorId.
        // For robustness, we will assume the mutation is related to a specific vendor's ID which must be available in the payload.
        (payload) => [['vendor']] // Invalidate all vendor details if the vendorId is not easily available
    );
}
