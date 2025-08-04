import * as Yup from 'yup';

const commitmentRequestSchema = Yup.object().shape({
  requestType: Yup.string().required('Request type is required'),
  commitmentRequestNumber: Yup.string().nullable(),
  description: Yup.string().required('Description is required'),
  dateOfRequest: Yup.date().default(() => new Date()).required('Date of request is required'),
  notes: Yup.string().nullable(),
  supportingDocuments: Yup.mixed().required('Supporting documents are required'),
  financials: Yup.object().shape({
    compensation: Yup.number().required('Compensation is required').positive('Must be a positive number'),
    capex: Yup.number().required('Capex is required').positive('Must be a positive number'),
    goodsAndServices: Yup.number().required('Goods and services is required').positive('Must be a positive number'),
    total: Yup.number().nullable(),
  }).required('Financials are required'),
});

export default commitmentRequestSchema;