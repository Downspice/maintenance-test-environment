import {
  useAddEmployeeCategory,
  useAddEmployeeRenewal,
  useAddEmployeeStatus,
  useAddEmployeeType,
  useGetEmployeeCategories,
  useGetEmployeeRenewals,
  useGetEmployeeStatuses,
  useGetEmployeeTypes,
} from "@/services/setups/employee";
import {
  useAddEquipmentColor,
  useAddEquipmentMake,
  useAddEquipmentMeterType,
  useAddEquipmentModel,
  useAddEquipmentRenewal,
  useAddEquipmentStatus,
  useAddEquipmentType,
  useAddExpenseType,
  useGetEquipmentColors,
  useGetEquipmentMakes,
  useGetEquipmentMeterTypes,
  useGetEquipmentModels,
  useGetEquipmentRenewals,
  useGetEquipmentStatuses,
  useGetEquipmentTypes,
  useGetExpenseTypes,
} from "@/services/setups/equipments";
import {
  useAddCostCenter,
  useAddInventoryCategory,
  useAddInventoryManufacturer,
  useAddInventoryUnitType,
  useGetCostCenters,
  useGetInventoryCategories,
  useGetInventoryManufacturers,
  useGetInventoryUnitTypes,
} from "@/services/setups/inventory";
import {
  useAddMaintenanceRepair,
  useAddMaintenanceRepairType,
  useAddMaintenanceTaskType,
  useGetMaintenanceRepairs,
  useGetMaintenanceRepairTypes,
  useGetMaintenanceTaskTypes,
} from "@/services/setups/maintenance";
import {
  useAddLocation,
  useAddPurchaseOrderTerm,
  useAddStatusOne,
  useAddVendorType,
  useGetLocations,
  useGetPurchaseOrderTerms,
  useGetStatusOnes,
  useGetVendorTypes,
} from "@/services/setups/lookups";
import {
  useAddPurchaseOrderShipVia,
  useGetPurchaseOrderShipVias,
} from "@/services/setups/purchaseOrder";
import {
  useAddWorkOrderType,
  useGetWorkOrderTypes,
} from "@/services/setups/workOrder";
import type { GenericObject } from "@/types/types";

export type ChoiceListGetHook = () => {
  data?: GenericObject[];
  isLoading: boolean;
  refetch: () => Promise<unknown>;
};

export type ChoiceListAddHook = () => {
  mutateAsync: (payload: { name: string }) => Promise<unknown>;
  isPending: boolean;
};

export type ChoiceListHookPair = {
  useGet: ChoiceListGetHook;
  useAdd: ChoiceListAddHook;
};

export const CHOICE_LIST_REGISTRY = {
  generalExpenseTypes: {
    useGet: useGetExpenseTypes,
    useAdd: useAddExpenseType,
  },
  "equipments:types": {
    useGet: useGetEquipmentTypes,
    useAdd: useAddEquipmentType,
  },
  "equipments:status": {
    useGet: useGetEquipmentStatuses,
    useAdd: useAddEquipmentStatus,
  },
  "equipments:renewals": {
    useGet: useGetEquipmentRenewals,
    useAdd: useAddEquipmentRenewal,
  },
  "equipments:models": {
    useGet: useGetEquipmentModels,
    useAdd: useAddEquipmentModel,
  },
  "equipments:meterTypes": {
    useGet: useGetEquipmentMeterTypes,
    useAdd: useAddEquipmentMeterType,
  },
  "equipments:colors": {
    useGet: useGetEquipmentColors,
    useAdd: useAddEquipmentColor,
  },
  "equipments:makes": {
    useGet: useGetEquipmentMakes,
    useAdd: useAddEquipmentMake,
  },
  "workOrders:types": {
    useGet: useGetWorkOrderTypes,
    useAdd: useAddWorkOrderType,
  },
  "purchaseOrders:terms": {
    useGet: useGetPurchaseOrderTerms,
    useAdd: useAddPurchaseOrderTerm,
  },
  "purchaseOrders:shippingMethods": {
    useGet: useGetPurchaseOrderShipVias,
    useAdd: useAddPurchaseOrderShipVia,
  },
  vendorTypes: {
    useGet: useGetVendorTypes,
    useAdd: useAddVendorType,
  },
  "employee:status": {
    useGet: useGetEmployeeStatuses,
    useAdd: useAddEmployeeStatus,
  },
  "employee:category": {
    useGet: useGetEmployeeCategories,
    useAdd: useAddEmployeeCategory,
  },
  "employee:types": {
    useGet: useGetEmployeeTypes,
    useAdd: useAddEmployeeType,
  },
  "employee:renewals": {
    useGet: useGetEmployeeRenewals,
    useAdd: useAddEmployeeRenewal,
  },
  costCentres: {
    useGet: useGetCostCenters,
    useAdd: useAddCostCenter,
  },
  "inventory:manufacturers": {
    useGet: useGetInventoryManufacturers,
    useAdd: useAddInventoryManufacturer,
  },
  "inventory:categories": {
    useGet: useGetInventoryCategories,
    useAdd: useAddInventoryCategory,
  },
  "inventory:unitTypes": {
    useGet: useGetInventoryUnitTypes,
    useAdd: useAddInventoryUnitType,
  },
  "maintenance:repairTypes": {
    useGet: useGetMaintenanceRepairs,
    useAdd: useAddMaintenanceRepair,
  },
  "maintenance:repairs": {
    useGet: useGetMaintenanceRepairTypes,
    useAdd: useAddMaintenanceRepairType,
  },
  "maintenance:taskTypes": {
    useGet: useGetMaintenanceTaskTypes,
    useAdd: useAddMaintenanceTaskType,
  },
  locations: {
    useGet: useGetLocations,
    useAdd: useAddLocation,
  },
  statusOnes: {
    useGet: useGetStatusOnes,
    useAdd: useAddStatusOne,
  },
} as const satisfies Record<string, ChoiceListHookPair>;

export type ChoiceListKey = keyof typeof CHOICE_LIST_REGISTRY;
