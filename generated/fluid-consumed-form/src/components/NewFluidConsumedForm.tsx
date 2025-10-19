import React, { useState } from 'react';
import { useFormik } from 'formik';
import { fluidConsumedSchema } from '../schemas/fluidConsumedSchema';

const NewFluidConsumedForm: React.FC = () => {
    const [total, setTotal] = useState(0);

    const formik = useFormik({
        initialValues: {
            equipment: '',
            date: '',
            hours: 0,
            fluid: '',
            part: '',
            quantity: 0,
            unit_cost: 0,
            fluidUnits: '',
            costCentre: '',
            notes: ''
        },
        validationSchema: fluidConsumedSchema,
        onSubmit: (values) => {
            // Handle form submission
            console.log(values);
        },
    });

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const quantity = parseFloat(e.target.value);
        const unit_cost = parseFloat(formik.values.unit_cost);
        setTotal(quantity * unit_cost);
        formik.setFieldValue('quantity', quantity);
    };

    const handleunit_costChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const unit_cost = parseFloat(e.target.value);
        const quantity = parseFloat(formik.values.quantity);
        setTotal(quantity * unit_cost);
        formik.setFieldValue('unit_cost', unit_cost);
    };

    return (
        <form onSubmit={formik.handleSubmit}>
            <div>
                <label htmlFor="equipment">Equipment</label>
                <select
                    id="equipment"
                    name="equipment"
                    onChange={formik.handleChange}
                    value={formik.values.equipment}
                >
                    {/* Options for equipment */}
                </select>
            </div>
            <div>
                <label htmlFor="date">Date</label>
                <input
                    type="date"
                    id="date"
                    name="date"
                    onChange={formik.handleChange}
                    value={formik.values.date}
                />
            </div>
            <div>
                <label htmlFor="hours">Hours</label>
                <input
                    type="number"
                    id="hours"
                    name="hours"
                    onChange={formik.handleChange}
                    value={formik.values.hours}
                />
            </div>
            <div>
                <label htmlFor="fluid">Fluid</label>
                <select
                    id="fluid"
                    name="fluid"
                    onChange={formik.handleChange}
                    value={formik.values.fluid}
                >
                    {/* Options for fluid */}
                </select>
            </div>
            <div>
                <label htmlFor="part">Part</label>
                <select
                    id="part"
                    name="part"
                    onChange={formik.handleChange}
                    value={formik.values.part}
                >
                    {/* Options for part */}
                </select>
            </div>
            <div>
                <label htmlFor="quantity">Quantity</label>
                <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    onChange={handleQuantityChange}
                    value={formik.values.quantity}
                />
            </div>
            <div>
                <label htmlFor="unit_cost">Unit Cost</label>
                <input
                    type="number"
                    id="unit_cost"
                    name="unit_cost"
                    onChange={handleunit_costChange}
                    value={formik.values.unit_cost}
                />
            </div>
            <div>
                <label htmlFor="fluidUnits">Fluid Units</label>
                <select
                    id="fluidUnits"
                    name="fluidUnits"
                    onChange={formik.handleChange}
                    value={formik.values.fluidUnits}
                >
                    {/* Options for fluid units */}
                </select>
            </div>
            <div>
                <label htmlFor="total">Total</label>
                <input
                    type="text"
                    id="total"
                    name="total"
                    value={total}
                    disabled
                />
            </div>
            <div>
                <label htmlFor="costCentre">Cost Centre</label>
                <select
                    id="costCentre"
                    name="costCentre"
                    onChange={formik.handleChange}
                    value={formik.values.costCentre}
                >
                    {/* Options for cost centre */}
                </select>
            </div>
            <div>
                <label htmlFor="notes">Notes</label>
                <textarea
                    id="notes"
                    name="notes"
                    onChange={formik.handleChange}
                    value={formik.values.notes}
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default NewFluidConsumedForm;