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
  id: string;
  name: string;
}

export interface FluidOption {
  id: string;
  name: string;
}

export interface PartOption {
  id: string;
  name: string;
}

export interface FluidUnitOption {
  id: string;
  name: string;
}

export interface CostCentreOption {
  id: string;
  name: string;
}