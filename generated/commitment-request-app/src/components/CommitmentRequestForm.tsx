import React, { useState, useEffect } from 'react';

const CommitmentRequestForm = () => {
    const [requestType, setRequestType] = useState('');
    const [commitmentRequestNumber] = useState(''); // Disabled input
    const [description, setDescription] = useState('');
    const [dateOfRequest] = useState(new Date().toISOString().split('T')[0]); // Current date
    const [notes, setNotes] = useState('');
    const [compensation, setCompensation] = useState(0);
    const [capex, setCapex] = useState(0);
    const [goodsAndServices, setGoodsAndServices] = useState(0);
    const [total, setTotal] = useState(0);
    const [supportingDocuments, setSupportingDocuments] = useState(null);

    useEffect(() => {
        const calculatedTotal = compensation + capex + goodsAndServices;
        setTotal(calculatedTotal);
    }, [compensation, capex, goodsAndServices]);

    const handleFileChange = (event) => {
        setSupportingDocuments(event.target.files[0]);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission logic here
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Request Type:</label>
                <select value={requestType} onChange={(e) => setRequestType(e.target.value)}>
                    <option value="">Select Request Type</option>
                    <option value="Type1">Type 1</option>
                    <option value="Type2">Type 2</option>
                </select>
            </div>
            <div>
                <label>Commitment Request Number:</label>
                <input type="text" value={commitmentRequestNumber} disabled />
            </div>
            <div>
                <label>Description:</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div>
                <label>Date of Request:</label>
                <input type="date" value={dateOfRequest} readOnly />
            </div>
            <div>
                <label>Notes:</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <fieldset>
                <legend>Financials</legend>
                <div>
                    <label>Compensation:</label>
                    <input type="number" value={compensation} onChange={(e) => setCompensation(Number(e.target.value))} />
                </div>
                <div>
                    <label>Capex:</label>
                    <input type="number" value={capex} onChange={(e) => setCapex(Number(e.target.value))} />
                </div>
                <div>
                    <label>Goods and Services:</label>
                    <input type="number" value={goodsAndServices} onChange={(e) => setGoodsAndServices(Number(e.target.value))} />
                </div>
                <div>
                    <label>Total:</label>
                    <input type="number" value={total} disabled />
                </div>
            </fieldset>
            <div>
                <label>Supporting Documents:</label>
                <input type="file" onChange={handleFileChange} />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default CommitmentRequestForm;