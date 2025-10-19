export interface FluidConsumedFormValues {
  equipment: string;
  date: string; // ISO date string
  hours: number;
  fluid: string;
  part: string;
  quantity: number;
  unit_cost: number;
  fluidUnits: string;
  total: number;
  costCentre: string;
  notes: string;
}

export interface EquipmentOption {
  value: string;
  label: string;
}

export interface FluidOption {
  value: string;
  label: string;
}

export interface PartOption {
  value: string;
  label: string;
}

export interface FluidUnitOption {
  value: string;
  label: string;
}

export interface CostCentreOption {
  value: string;
  label: string;
}