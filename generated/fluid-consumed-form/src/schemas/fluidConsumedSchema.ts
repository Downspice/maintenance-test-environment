import * as Yup from 'yup';

const fluidConsumedSchema = Yup.object().shape({
  equipment: Yup.string().required('Equipment is required'),
  date: Yup.date().required('Date is required'),
  hours: Yup.number().required('Hours are required').positive().integer(),
  fluid: Yup.string().required('Fluid is required'),
  part: Yup.string().required('Part is required'),
  quantity: Yup.number().required('Quantity is required').positive(),
  unit_cost: Yup.number().required('Unit cost is required').positive(),
  fluidUnits: Yup.string().required('Fluid units are required'),
  costCentre: Yup.string().required('Cost centre is required'),
  notes: Yup.string().optional(),
}).defined();

export default fluidConsumedSchema;