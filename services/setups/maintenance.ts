"use client";
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

// Assuming these relative imports are correctly configured for the project structure
import { dummyApiClient } from "@/lib/api/axios";
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
const useBaseMutation = <
  TResponse = TEntity,
  TPayload = TParams,
  TContext = unknown,
>(
  mutationKey: string[],
  endpoint: (payload: TPayload) => string,
  method: "post" | "put" | "delete" | "patch",
  invalidateKeys: (payload: TPayload) => unknown[],
  options?: UseMutationOptions<
    TResponse,
    AxiosError<ApiError>,
    TPayload,
    TContext
  >
) => {
  const queryClient = useQueryClient();

  const mutationFn = async (payload: TPayload) => {
    const url = buildUrl(endpoint(payload));

    const response = await dummyApiClient<ApiResponse<TResponse>>(url, {
      method: method,
      // Only pass the payload (data) for POST/PUT/PATCH. DELETE requests typically send data via URL/params.
      data:
        method === "post" || method === "put" || method === "patch"
          ? payload
          : undefined,
    });

    return response.data as TResponse;
  };

  return useMutation<TResponse, AxiosError<ApiError>, TPayload, TContext>({
    mutationFn,
    mutationKey,
    onSuccess: (data, variables, context) => {
      // Invalidate all related queries
      invalidateKeys(variables).forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key as any });
      });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

// ------------------------------------------------
// MAINTENANCE MODULE HOOKS
// ------------------------------------------------

type MaintenanceRepairSetupPayload = TParams & { id?: TId };

type MaintenanceRepairTypeSetupPayload = TParams & { id?: TId };
type MaintenanceTaskTypeSetupPayload = TParams & { id?: TId };

// --- Maintenance Repair Setup Queries/Mutations ---

/**
 * Fetches the list of all Maintenance Repairs.
 */
export function useGetMaintenanceRepairs<TData = TEntity[]>(
  options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>
) {
  return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
    queryKey: ["maintenance-repairs"],
    queryFn: async () => {
      const response = await dummyApiClient<ApiResponse<TData>>(
        buildUrl("/api/get-maintenance-repairs")
      );
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
  return useBaseMutation<TEntity, MaintenanceRepairSetupPayload>(
    ["add-maintenance-repair"],
    () => "/api/add-maintenance-repair",
    "post",
    () => [["maintenance-repairs"]]
  );
}

/**
 * Updates an existing Maintenance Repair. Invalidates the 'maintenance-repairs' list.
 */
export function useUpdateMaintenanceRepair() {
  return useBaseMutation<TEntity, MaintenanceRepairSetupPayload & { id: TId }>(
    ["update-maintenance-repair"],
    (payload) => `/api/update-maintenance-repair/${payload.id}`,
    "put",
    () => [["maintenance-repairs"]]
  );
}

/**
 * Deletes a Maintenance Repair. Invalidates the 'maintenance-repairs' list.
 */
export function useDeleteMaintenanceRepair() {
  return useBaseMutation<TEntity, { id: TId }>(
    ["delete-maintenance-repair"],
    (payload) => `/api/delete-maintenance-repair/${payload.id}`,
    "delete",
    () => [["maintenance-repairs"]]
  );
}

// --- Maintenance Repair Types Setup Queries/Mutations ---

/**
 * Fetches the list of all Maintenance Repair Types.
 */
export function useGetMaintenanceRepairTypes<TData = TEntity[]>(
  options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>
) {
  return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
    queryKey: ["maintenance-repair-types"],
    queryFn: async () => {
      const response = await dummyApiClient<ApiResponse<TData>>(
        buildUrl("/api/get-maintenance-repair-types")
      );
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
  return useBaseMutation<TEntity, MaintenanceRepairTypeSetupPayload>(
    ["add-maintenance-repair-type"],
    () => "/api/add-maintenance-repair-type",
    "post",
    () => [["maintenance-repair-types"]]
  );
}

/**
 * Updates an existing Maintenance Repair Type. Invalidates the 'maintenance-repair-types' list.
 */
export function useUpdateMaintenanceRepairType() {
  return useBaseMutation<
    TEntity,
    MaintenanceRepairTypeSetupPayload & { id: TId }
  >(
    ["update-maintenance-repair-type"],
    (payload) => `/api/update-maintenance-repair-type/${payload.id}`,
    "put",
    () => [["maintenance-repair-types"]]
  );
}

/**
 * Deletes a Maintenance Repair Type. Invalidates the 'maintenance-repair-types' list.
 */
export function useDeleteMaintenanceRepairType() {
  return useBaseMutation<TEntity, { id: TId }>(
    ["delete-maintenance-repair-type"],
    (payload) => `/api/delete-maintenance-repair-type/${payload.id}`,
    "delete",
    () => [["maintenance-repair-types"]]
  );
}

// --- Maintenance Task Types Setup Queries/Mutations ---

/**
 * Fetches the list of all Maintenance Task Types.
 */
export function useGetMaintenanceTaskTypes<TData = TEntity[]>(
  options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>, TData>
) {
  return useQuery<ApiResponse<TData>, AxiosError<ApiError>, TData>({
    queryKey: ["maintenance-task-types"],
    queryFn: async () => {
      const response = await dummyApiClient<ApiResponse<TData>>(
        buildUrl("/api/get-maintenance-task-types")
      );
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
  return useBaseMutation<TEntity, MaintenanceTaskTypeSetupPayload>(
    ["add-maintenance-task-type"],
    () => "/api/add-maintenance-task-type",
    "post",
    () => [["maintenance-task-types"]]
  );
}

/**
 * Updates an existing Maintenance Task Type. Invalidates the 'maintenance-task-types' list.
 */
export function useUpdateMaintenanceTaskType() {
  return useBaseMutation<
    TEntity,
    MaintenanceTaskTypeSetupPayload & { id: TId }
  >(
    ["update-maintenance-task-type"],
    (payload) => `/api/update-maintenance-task-type/${payload.id}`,
    "put",
    () => [["maintenance-task-types"]]
  );
}

/**
 * Deletes a Maintenance Task Type. Invalidates the 'maintenance-task-types' list.
 */
export function useDeleteMaintenanceTaskType() {
  return useBaseMutation<TEntity, { id: TId }>(
    ["delete-maintenance-task-type"],
    (payload) => `/api/delete-maintenance-task-type/${payload.id}`,
    "delete",
    () => [["maintenance-task-types"]]
  );
}
