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

/**
 * Builds the full API URL for an endpoint.
 * @param path The relative path (e.g., /api/get-work-order-types)
 */
const buildUrl = (path: string) => path;

/**
 * Base type for all mutation hooks.
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
                queryClient.invalidateQueries({ queryKey: key as any, exact: false });
            });
            options?.onSuccess?.(data, variables, context);
        },
        ...options,
    });
};


// ------------------------------------------------
// WORK ORDER MODULE HOOKS
// ------------------------------------------------

type WorkOrderSetupPayload = TParams & { id?: TId };
type WorkOrderPayload = TParams & { id?: TId };
type WorkOrderAttachmentPayload = { id: TId };


// --- Work Order Queries/Mutations ---

/**
 * Fetches the list of all Work Orders.
 */
export function useGetWorkOrders<TData = TEntity[]>(options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>) {
    return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
        queryKey: ["work-orders"],
        queryFn: async () => {
            const response = await dummyApiClient<ApiResponse<TData>>(buildUrl("/api/get-work-orders"));
            return response;
        },
        select: (response) => response.data as TData,
        staleTime: Infinity,
        ...options,
    });
}

/**
 * Fetches a single Work Order by ID.
 * @param id The ID of the work order to fetch.
 */
export function useGetWorkOrder<TData = TEntity>(id: TId, options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>) {
    return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
        queryKey: ["work-order", id],
        queryFn: async () => {
            const response = await dummyApiClient<ApiResponse<TData>>(buildUrl(`/api/get-work-order/${id}`));
            return response;
        },
        select: (response) => response.data as TData,
        enabled: !!id,
        ...options,
    });
}

// Paginated work orders with server-side filters and search
type WorkOrderQuery = {
    search?: string;
    location_id?: string;
    status_id?: string;
    size?: number; // page size
    page?: number; // 1-based page index as required by API
    sort_by?: string;
    sort_order?: "asc" | "desc";
};

export function useGetWorkOrdersPaginated<TPaginated = any>(
    query: WorkOrderQuery,
    options?: UseQueryOptions<ApiResponse<TPaginated>, AxiosError<ApiError>, TPaginated>
) {
    return useQuery<ApiResponse<TPaginated>, AxiosError<ApiError>, TPaginated>({
        queryKey: ["work-orders", query],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (query.search && query.search.trim()) params.set("search", query.search.trim());
            if (query.location_id) params.set("location_id", query.location_id);
            if (query.status_id) params.set("status_id", query.status_id);
            if (typeof query.size === "number") params.set("size", String(query.size));
            if (typeof query.page === "number") params.set("page", String(query.page));
            if (query.sort_by) params.set("sort_by", query.sort_by);
            if (query.sort_order) params.set("sort_order", query.sort_order);
            const url = buildUrl(`/api/get-work-orders${params.toString() ? `?${params.toString()}` : ""}`);
            const response = await dummyApiClient<ApiResponse<TPaginated>>(url);
            return response;
        },
        select: (response) => response.data as TPaginated,
        ...options,
    });
}

/**
 * Adds a new Work Order. Invalidates the 'work-orders' list.
 */
export function useAddWorkOrder() {
    return useBaseMutation<TEntity, WorkOrderPayload>(
        ["add-work-order"],
        () => "/api/add-work-order",
        'post',
        () => [['work-orders']]
    );
}

/**
 * Updates an existing Work Order. Invalidates the 'work-orders' list and the specific 'work-order' detail query.
 */
export function useUpdateWorkOrder() {
    return useBaseMutation<TEntity, WorkOrderPayload & { id: TId }>(
        ["update-work-order"],
        (payload) => `/api/update-work-order/${payload.id}`,
        'put',
        // (payload) => [['work-orders'], ['work-order', payload.id]]
        (payload) => [['work-order', payload.id]]
    );
}

/**
 * Updates Work Order Assignees. Invalidates the 'work-orders' list and the specific 'work-order' detail query.
 */
export function useUpdateWorkOrderAssignee() {
    return useBaseMutation<TEntity, WorkOrderPayload & { id: TId }>(
        ["update-work-order-assignee"],
        (payload) => `/api/update-work-order-assignee/${payload.id}`,
        'put',
        (payload) => [['work-orders'], ['work-order', payload.id]]
    );
}

/**
 * Updates Work Order Priority. Invalidates the 'work-orders' list and the specific 'work-order' detail query.
 */
export function useUpdateWorkOrderPriority() {
    return useBaseMutation<TEntity, WorkOrderPayload & { id: TId }>(
        ["update-work-order-priority"],
        (payload) => `/api/update-work-order-priority/${payload.id}`,
        'put',
        (payload) => [['work-orders'], ['work-order', payload.id]]
    );
}

/**
 * Updates Work Order Cost Center. Invalidates the 'work-orders' list and the specific 'work-order' detail query.
 */
export function useUpdateWorkOrderCostCenter() {
    return useBaseMutation<TEntity, WorkOrderPayload & { id: TId }>(
        ["update-work-order-cost-center"],
        (payload) => `/api/update-work-order-cost-center/${payload.id}`,
        'put',
        (payload) => [['work-orders'], ['work-order', payload.id]]
    );
}

/**
 * Updates Work Order Status. Invalidates the 'work-orders' list and the specific 'work-order' detail query.
 */
export function useUpdateWorkOrderCurrentStatus() {
    return useBaseMutation<TEntity, WorkOrderPayload & { id: TId }>(
        ["update-work-order-status"],
        (payload) => `/api/update-work-order-status/${payload.id}`,
        'put',
        (payload) => [['work-orders'], ['work-order', payload.id]]
    );
}

/**
 * Updates a Work Order Unit Labor. Invalidates the 'work-orders' list and the specific 'work-order' detail query.
 */
export function useUpdateWorkOrderUnitLabor() {
    return useBaseMutation<TEntity, WorkOrderPayload & { id: TId }>(
        ["update-work-order-unit-labor"],
        (payload) => `/api/update-work-order-unit-labor/${payload.id}`,
        'put',
        (payload) => [['work-order', (payload as any).work_order_id]]
    );
}

/**
 * Deletes a Work Order. Invalidates the 'work-orders' list and the specific 'work-order' detail query.
 */
export function useDeleteWorkOrder() {
    return useBaseMutation<TEntity, { id: TId }>(
        ["delete-work-order"],
        (payload) => `/api/delete-work-order/${payload.id}`,
        'delete',
        (payload) => [['work-orders'], ['work-order', payload.id]]
    );
}


// --- Work Order Unit Queries/Mutations ---

/**
 * Adds a Work Order Unit. Invalidates the 'work-orders' list and the specific 'work-order' detail query.
 */
export function useAddWorkOrderUnit() {
    return useBaseMutation<TEntity, WorkOrderPayload>(
        ["add-work-order-unit"],
        () => "/api/add-work-order-unit",
        'post',
        (payload) => [['work-orders'], ['work-order', (payload as any).work_order_id]]
    );
}

/**
 * Deletes a Work Order Unit. Invalidates the 'work-orders' list.
 */
export function useDeleteWorkOrderUnit() {
    return useBaseMutation<TEntity, { id: TId }>(
        ["delete-work-order-unit"],
        (payload) => `/api/delete-work-order-unit/${payload.id}`,
        'delete',
        () => [['work-orders']]
    );
}


// --- Work Order Unit Maintenance Queries/Mutations ---

/**
 * Adds a Work Order Unit Maintenance. Invalidates the 'work-orders' list and the specific 'work-order' detail query.
 */
export function useAddWorkOrderUnitMaintenance() {
    return useBaseMutation<TEntity, WorkOrderPayload>(
        ["add-work-order-unit-maintenance"],
        () => "/api/add-work-order-unit-maintenance",
        'post',
        (payload) => []
    );
}

/**
 * Updates a Work Order Unit Maintenance. Invalidates the 'work-orders' list and the specific 'work-order' detail query.
 */
export function useUpdateWorkOrderUnitMaintenance() {
    return useBaseMutation<TEntity, WorkOrderPayload & { id: TId }>(
        ["update-work-order-unit-maintenance"],
        (payload) => `/api/update-work-order-unit-maintenance/${payload.id}`,
        'put',
        (payload) => []
    );
}

/**
 * Deletes a Work Order Unit Maintenance. Invalidates the 'work-orders' list.
 */
export function useDeleteWorkOrderUnitMaintenance() {
    return useBaseMutation<TEntity, { id: TId }>(
        ["delete-work-order-unit-maintenance"],
        (payload) => `/api/delete-work-order-unit-maintenance/${payload.id}`,
        'delete',
        (payload) => [] // Invalidate work order detail too? Probably yes if it affects totals.
    );
}


// --- Work Order Unit Part Queries/Mutations ---

/**
 * Adds a Work Order Unit Part. Invalidates the 'work-orders' list and the specific 'work-order' detail query.
 */
export function useAddWorkOrderUnitPart() {
    return useBaseMutation<TEntity, WorkOrderPayload>(
        ["add-work-order-unit-part"],
        () => "/api/add-work-order-unit-part",
        'post',
        (payload) => []
    );
}

/**
 * Updates a Work Order Unit Part. Invalidates the 'work-orders' list and specific work order.
 */
export function useUpdateWorkOrderUnitPart() {
    return useBaseMutation<TEntity, WorkOrderPayload & { id: TId }>(
        ["update-work-order-unit-part"],
        (payload) => `/api/update-work-order-unit-part/${payload.id}`,
        'put',
        (payload) => []
    );
}

/**
 * Deletes a Work Order Unit Part. Invalidates the 'work-orders' list.
 */
export function useDeleteWorkOrderUnitPart() {
    return useBaseMutation<TEntity, { id: TId }>(
        ["delete-work-order-unit-part"],
        (payload) => `/api/delete-work-order-unit-part/${payload.id}`,
        'delete',
        (payload) => []
    );
}

/**
 * Adds a Work Order Unit Note. Invalidates the 'work-orders' list and specific work order.
 */
export function useAddWorkOrderUnitNote() {
    return useBaseMutation<TEntity, WorkOrderPayload>(
        ["add-work-order-unit-note"],
        () => "/api/add-work-order-unit-note",
        'post',
        (payload) => []
    );
}

/**
 * Updates a Work Order Unit Note. Invalidates the 'work-orders' list and specific work order.
 */
export function useUpdateWorkOrderUnitNote() {
    return useBaseMutation<TEntity, WorkOrderPayload & { id: TId }>(
        ["update-work-order-unit-note"],
        (payload) => `/api/update-work-order-unit-note/${payload.id}`,
        'put',
        (payload) => []
    );
}

/**
 * Deletes a Work Order Unit Note. Invalidates the 'work-orders' list.
 */
export function useDeleteWorkOrderUnitNote() {
    return useBaseMutation<TEntity, { id: TId }>(
        ["delete-work-order-unit-note"],
        (payload) => `/api/delete-work-order-unit-note/${payload.id}`,
        'delete',
        (payload) => []
    );
}


// --- Work Order Unit Labor Queries/Mutations ---

/**
 * Adds a Work Order Unit Labor. Invalidates the 'work-orders' list and the specific 'work-order' detail query.
 */
export function useAddWorkOrderUnitLabor() {
    return useBaseMutation<TEntity, WorkOrderPayload>(
        ["add-work-order-unit-labor"],
        () => "/api/add-work-order-unit-labor",
        'post',
        (payload) => []
    );
}

/**
 * Deletes a Work Order Unit Labor. Invalidates the 'work-orders' list.
 */
export function useDeleteWorkOrderUnitLabor() {
    return useBaseMutation<TEntity, { id: TId }>(
        ["delete-work-order-unit-labor"],
        (payload) => `/api/delete-work-order-unit-labor/${payload.id}`,
        'delete',
        (payload) => []
    );
}


// --- Work Order Unit Attachment Queries/Mutations ---

/**
 * Adds a Work Order Unit Attachment. Invalidates the 'work-orders' list and the specific 'work-order' detail query.
 */
export function useAddWorkOrderUnitAttachment() {
    return useBaseMutation<TEntity, WorkOrderPayload>(
        ["add-work-order-unit-attachment"],
        () => "/api/add-work-order-unit-attachment",
        'post',
        (payload) => [['work-orders'], ['work-order', (payload as any).work_order_id]]
    );
}

/**
 * Deletes a Work Order Unit Attachment. Invalidates the 'work-orders' list.
 */
export function useDeleteWorkOrderUnitAttachment() {
    return useBaseMutation<TEntity, { id: TId }>(
        ["delete-work-order-unit-attachment"],
        (payload) => `/api/delete-work-order-unit-attachment/${payload.id}`,
        'delete',
        () => [['work-orders']]
    );
}


// --- Work Order Unit Note Queries/Mutations ---

/**
 * Adds a Work Order Unit Note. Invalidates the 'work-orders' list and the specific 'work-order' detail query.
 */

// --- Work Order Type Setup Queries/Mutations ---

/**
 * Fetches the list of all Work Order Types.
 */
export function useGetWorkOrderTypes<TData = TEntity[]>(options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>) {
    return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
        queryKey: ["work-order-types"],
        queryFn: async () => {
            const response = await dummyApiClient<ApiResponse<TData>>(buildUrl("/api/get-work-order-types"));
            return response;
        },
        select: (response) => response.data as TData,
        staleTime: Infinity,
        ...options,
    });
}

/**
 * Adds a new Work Order Type. Invalidates the 'work-order-types' list.
 */
export function useAddWorkOrderType() {
    return useBaseMutation<TEntity, WorkOrderSetupPayload>(
        ["add-work-order-type"],
        () => "/api/add-work-order-type",
        'post',
        () => [['work-order-types']]
    );
}

/**
 * Updates an existing Work Order Type. Invalidates the 'work-order-types' list.
 */
export function useUpdateWorkOrderType() {
    return useBaseMutation<TEntity, WorkOrderSetupPayload & { id: TId }>(
        ["update-work-order-type"],
        (payload) => `/api/update-work-order-type/${payload.id}`,
        'put',
        () => [['work-order-types']]
    );
}

/**
 * Deletes a Work Order Type. Invalidates the 'work-order-types' list.
 */
export function useDeleteWorkOrderType() {
    return useBaseMutation<TEntity, { id: TId }>(
        ["delete-work-order-type"],
        (payload) => `/api/delete-work-order-type/${payload.id}`,
        'delete',
        () => [['work-order-types']]
    );
}


// --- Priority Setup Queries/Mutations ---

/**
 * Fetches the list of all Priorities.
 */
export function useGetPriorities<TData = TEntity[]>(options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>) {
    return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
        queryKey: ["priorities"],
        queryFn: async () => {
            const response = await dummyApiClient<ApiResponse<TData>>(buildUrl("/api/get-priorities"));
            return response;
        },
        select: (response) => response.data as TData,
        staleTime: Infinity,
        ...options,
    });
}

/**
 * Adds a new Priority. Invalidates the 'priorities' list.
 */
export function useAddPriority() {
    return useBaseMutation<TEntity, WorkOrderSetupPayload>(
        ["add-priority"],
        () => "/api/add-priority",
        'post',
        () => [['priorities']]
    );
}

/**
 * Updates an existing Priority. Invalidates the 'priorities' list.
 */
export function useUpdatePriority() {
    return useBaseMutation<TEntity, WorkOrderSetupPayload & { id: TId }>(
        ["update-priority"],
        (payload) => `/api/update-priority/${payload.id}`,
        'put',
        () => [['priorities']]
    );
}

/**
 * Deletes a Priority. Invalidates the 'priorities' list.
 */
export function useDeletePriority() {
    return useBaseMutation<TEntity, { id: TId }>(
        ["delete-priority"],
        (payload) => `/api/delete-priority/${payload.id}`,
        'delete',
        () => [['priorities']]
    );
}


// --- Work Order Status Setup Queries/Mutations ---

/**
 * Fetches the list of all Work Order Statuses.
 */
export function useGetWorkOrderStatuses<TData = TEntity[]>(options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>) {
    return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
        queryKey: ["work-order-statuses"],
        queryFn: async () => {
            const response = await dummyApiClient<ApiResponse<TData>>(buildUrl("/api/get-work-order-statuses"));
            return response;
        },
        select: (response) => response.data as TData,
        staleTime: Infinity,
        ...options,
    });
}

/**
 * Adds a new Work Order Status. Invalidates the 'work-order-statuses' list.
 */
export function useAddWorkOrderStatus() {
    return useBaseMutation<TEntity, WorkOrderSetupPayload>(
        ["add-work-order-status"],
        () => "/api/add-work-order-status",
        'post',
        () => [['work-order-statuses']]
    );
}

/**
 * Updates an existing Work Order Status. Invalidates the 'work-order-statuses' list.
 */
export function useUpdateWorkOrderStatus() {
    return useBaseMutation<TEntity, WorkOrderSetupPayload & { id: TId }>(
        ["update-work-order-status"],
        (payload) => `/api/update-work-order-status/${payload.id}`,
        'put',
        () => [['work-order-statuses']]
    );
}

/**
 * Deletes a Work Order Status. Invalidates the 'work-order-statuses' list.
 */
export function useDeleteWorkOrderStatus() {
    return useBaseMutation<TEntity, { id: TId }>(
        ["delete-work-order-status"],
        (payload) => `/api/delete-work-order-status/${payload.id}`,
        'delete',
        () => [['work-order-statuses']]
    );
}


// --- Preventive Maintenance Service Queries/Mutations ---

/**
 * Fetches the list of all PM Services.
 */
export function useGetPMServices<TData = TEntity[]>(options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>) {
    return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
        queryKey: ["pm-services"],
        queryFn: async () => {
            const response = await dummyApiClient<ApiResponse<TData>>(buildUrl("/api/get-pm-services"));
            return response;
        },
        select: (response) => response.data as TData,
        staleTime: Infinity,
        ...options,
    });
}

/**
 * Fetches a single PM Service by ID.
 * @param id The ID of the PM service to fetch.
 */
export function useGetPMService<TData = TEntity>(id: TId, options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>) {
    return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
        queryKey: ["pm-service", id],
        queryFn: async () => {
            const response = await dummyApiClient<ApiResponse<TData>>(buildUrl(`/api/get-pm-service/${id}`));
            return response;
        },
        select: (response) => response.data as TData,
        enabled: !!id,
        ...options,
    });
}

/**
 * Adds a new PM Service. Invalidates the 'pm-services' list.
 */
export function useAddPMService() {
    return useBaseMutation<TEntity, WorkOrderPayload>(
        ["add-pm-service"],
        () => "/api/add-pm-service",
        'post',
        () => [['pm-services']]
    );
}

/**
 * Updates an existing PM Service. Invalidates the 'pm-services' list and the specific 'pm-service' detail query.
 */
export function useUpdatePMService() {
    return useBaseMutation<TEntity, WorkOrderPayload & { id: TId }>(
        ["update-pm-service"],
        (payload) => `/api/update-pm-service/${payload.id}`,
        'put',
        (payload) => [['pm-services'], ['pm-service', payload.id]]
    );
}

/**
 * Deletes a PM Service. Invalidates the 'pm-services' list and the specific 'pm-service' detail query.
 */
export function useDeletePMService() {
    return useBaseMutation<TEntity, { id: TId }>(
        ["delete-pm-service"],
        (payload) => `/api/delete-pm-service/${payload.id}`,
        'delete',
        (payload) => [['pm-services'], ['pm-service', payload.id]]
    );
}

/**
 * Deletes a PM Service Part. Invalidates the 'pm-services' list.
 */
export function useDeletePMServicePart() {
    return useBaseMutation<TEntity, WorkOrderAttachmentPayload>(
        ["delete-pm-service-part"],
        (payload) => `/api/delete-pm-service-part/${payload.id}`,
        'delete',
        () => [['pm-services']]
    );
}

/**
 * Deletes a PM Service Equipment. Invalidates the 'pm-services' list.
 */
export function useDeletePMServiceEquipment() {
    return useBaseMutation<TEntity, WorkOrderAttachmentPayload>(
        ["delete-pm-service-equipment"],
        (payload) => `/api/delete-pm-service-equipment/${payload.id}`,
        'delete',
        () => [['pm-services']]
    );
}


// --- Maintenance Repairs Queries/Mutations ---

/**
 * Fetches the list of all Maintenance Repairs.
 */
export function useGetMaintenanceRepairs<TData = TEntity[]>(options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>) {
    return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
        queryKey: ["maintenance-repairs"],
        queryFn: async () => {
            const response = await dummyApiClient<ApiResponse<TData>>(buildUrl("/api/get-maintenance-repairs"));
            return response;
        },
        select: (response) => response.data as TData,
        staleTime: Infinity,
        ...options,
    });
}

/**
 * Adds a new Maintenance Repair. Invalidates the 'maintenance-repairs' list.
 */
export function useAddMaintenanceRepair() {
    return useBaseMutation<TEntity, WorkOrderPayload>(
        ["add-maintenance-repair"],
        () => "/api/add-maintenance-repair",
        'post',
        () => [['maintenance-repairs']]
    );
}

/**
 * Updates an existing Maintenance Repair. Invalidates the 'maintenance-repairs' list.
 */
export function useUpdateMaintenanceRepair() {
    return useBaseMutation<TEntity, WorkOrderPayload & { id: TId }>(
        ["update-maintenance-repair"],
        (payload) => `/api/update-maintenance-repair/${payload.id}`,
        'put',
        () => [['maintenance-repairs']]
    );
}

/**
 * Deletes a Maintenance Repair. Invalidates the 'maintenance-repairs' list.
 */
export function useDeleteMaintenanceRepair() {
    return useBaseMutation<TEntity, { id: TId }>(
        ["delete-maintenance-repair"],
        (payload) => `/api/delete-maintenance-repair/${payload.id}`,
        'delete',
        () => [['maintenance-repairs']]
    );
}


// --- Maintenance Repair Types Queries/Mutations ---

/**
 * Fetches the list of all Maintenance Repair Types.
 */
export function useGetMaintenanceRepairTypes<TData = TEntity[]>(options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>) {
    return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
        queryKey: ["maintenance-repair-types"],
        queryFn: async () => {
            const response = await dummyApiClient<ApiResponse<TData>>(buildUrl("/api/get-maintenance-repair-types"));
            return response;
        },
        select: (response) => response.data as TData,
        staleTime: Infinity,
        ...options,
    });
}

/**
 * Adds a new Maintenance Repair Type. Invalidates the 'maintenance-repair-types' list.
 */
export function useAddMaintenanceRepairType() {
    return useBaseMutation<TEntity, WorkOrderSetupPayload>(
        ["add-maintenance-repair-type"],
        () => "/api/add-maintenance-repair-type",
        'post',
        () => [['maintenance-repair-types']]
    );
}

/**
 * Updates an existing Maintenance Repair Type. Invalidates the 'maintenance-repair-types' list.
 */
export function useUpdateMaintenanceRepairType() {
    return useBaseMutation<TEntity, WorkOrderSetupPayload & { id: TId }>(
        ["update-maintenance-repair-type"],
        (payload) => `/api/update-maintenance-repair-type/${payload.id}`,
        'put',
        () => [['maintenance-repair-types']]
    );
}

/**
 * Deletes a Maintenance Repair Type. Invalidates the 'maintenance-repair-types' list.
 */
export function useDeleteMaintenanceRepairType() {
    return useBaseMutation<TEntity, { id: TId }>(
        ["delete-maintenance-repair-type"],
        (payload) => `/api/delete-maintenance-repair-type/${payload.id}`,
        'delete',
        () => [['maintenance-repair-types']]
    );
}


// --- Maintenance Task Type Queries/Mutations ---

/**
 * Fetches the list of all Maintenance Task Types.
 */
export function useGetMaintenanceTaskTypes<TData = TEntity[]>(options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>) {
    return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
        queryKey: ["maintenance-task-types"],
        queryFn: async () => {
            const response = await dummyApiClient<ApiResponse<TData>>(buildUrl("/api/get-maintenance-task-types"));
            return response;
        },
        select: (response) => response.data as TData,
        staleTime: Infinity,
        ...options,
    });
}

/**
 * Adds a new Maintenance Task Type. Invalidates the 'maintenance-task-types' list.
 */
export function useAddMaintenanceTaskType() {
    return useBaseMutation<TEntity, WorkOrderSetupPayload>(
        ["add-maintenance-task-type"],
        () => "/api/add-maintenance-task-type",
        'post',
        () => [['maintenance-task-types']]
    );
}

/**
 * Updates an existing Maintenance Task Type. Invalidates the 'maintenance-task-types' list.
 */
export function useUpdateMaintenanceTaskType() {
    return useBaseMutation<TEntity, WorkOrderSetupPayload & { id: TId }>(
        ["update-maintenance-task-type"],
        (payload) => `/api/update-maintenance-task-type/${payload.id}`,
        'put',
        () => [['maintenance-task-types']]
    );
}

/**
 * Deletes a Maintenance Task Type. Invalidates the 'maintenance-task-types' list.
 */
export function useDeleteMaintenanceTaskType() {
    return useBaseMutation<TEntity, { id: TId }>(
        ["delete-maintenance-task-type"],
        (payload) => `/api/delete-maintenance-task-type/${payload.id}`,
        'delete',
        () => [['maintenance-task-types']]
    );
}


// --- Part Kits Queries/Mutations ---

/**
 * Fetches the list of all Part Kits.
 */
export function useGetPartKits<TData = TEntity[]>(options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>) {
    return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
        queryKey: ["part-kits"],
        queryFn: async () => {
            const response = await dummyApiClient<ApiResponse<TData>>(buildUrl("/api/get-part-kits"));
            return response;
        },
        select: (response) => response.data as TData,
        staleTime: Infinity,
        ...options,
    });
}

/**
 * Adds a new Part Kit. Invalidates the 'part-kits' list.
 */
export function useAddPartKit() {
    return useBaseMutation<TEntity, WorkOrderPayload>(
        ["add-part-kit"],
        () => "/api/add-part-kit",
        'post',
        () => [['part-kits']]
    );
}

/**
 * Updates an existing Part Kit. Invalidates the 'part-kits' list.
 */
export function useUpdatePartKit() {
    return useBaseMutation<TEntity, WorkOrderPayload & { id: TId }>(
        ["update-part-kit"],
        (payload) => `/api/update-part-kit/${payload.id}`,
        'put',
        () => [['part-kits']]
    );
}

/**
 * Deletes a Part Kit. Invalidates the 'part-kits' list.
 */
export function useDeletePartKit() {
    return useBaseMutation<TEntity, { id: TId }>(
        ["delete-part-kit"],
        (payload) => `/api/delete-part-kit/${payload.id}`,
        'delete',
        () => [['part-kits']]
    );
}


// --- Part Kit Parts Queries/Mutations ---


/**
 * Fetches the list of all Part Kit Parts.
 */
export function useGetPartKitParts<TData = TEntity[]>(options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>) {
    return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
        queryKey: ["part-kit-parts"],
        queryFn: async () => {
            const response = await dummyApiClient<ApiResponse<TData>>(buildUrl("/api/get-part-kit-parts"));
            return response;
        },
        select: (response) => response.data as TData,
        staleTime: Infinity,
        ...options,
    });
}

/**
 * Fetches the next available Work Order Number.
 */
export function useGetNextWorkOrderNumber(options?: UseQueryOptions<ApiResponse<number>, AxiosError<ApiError>, number>) {
    return useQuery<ApiResponse<number>, AxiosError<ApiError>, number>({
        queryKey: ["get-next-work-order-number"],
        queryFn: async () => {
            const response = await dummyApiClient<ApiResponse<number>>(buildUrl("/api/get-next-work-order-number"));
            return response;
        },
        select: (response) => response.data,
        staleTime: 0, // Always fetch fresh
        ...options,
    });
}

// return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
//     queryKey: ["part-kit-parts"],
//     queryFn: async () => {
//         const response = await dummyApiClient<ApiResponse<TData>>(buildUrl("/api/get-part-kit-parts"));
//         return response;
//     },
//     select: (response) => response.data as TData,
//     staleTime: Infinity,
//     ...options,
// });
// }

/**
 * Adds a new Part Kit Part. Invalidates the 'part-kit-parts' list.
 */
export function useAddPartKitPart() {
    return useBaseMutation<TEntity, WorkOrderPayload>(
        ["add-part-kit-part"],
        () => "/api/add-part-kit-part",
        'post',
        () => [['part-kit-parts']]
    );
}

/**
 * Updates an existing Part Kit Part. Invalidates the 'part-kit-parts' list.
 */
export function useUpdatePartKitPart() {
    return useBaseMutation<TEntity, WorkOrderPayload & { id: TId }>(
        ["update-part-kit-part"],
        (payload) => `/api/update-part-kit-part/${payload.id}`,
        'put',
        () => [['part-kit-parts']]
    );
}

/**
 * Deletes a Part Kit Part. Invalidates the 'part-kit-parts' list.
 */
export function useDeletePartKitPart() {
    return useBaseMutation<TEntity, { id: TId }>(
        ["delete-part-kit-part"],
        (payload) => `/api/delete-part-kit-part/${payload.id}`,
        'delete',
        () => [['part-kit-parts']]
    );
}