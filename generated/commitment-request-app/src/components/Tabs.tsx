import React, { useState } from 'react';
import CommitmentRequestForm from './CommitmentRequestForm';
import QueriedRequestTab from './QueriedRequestTab';
import CompletedRequestTab from './CompletedRequestTab';

const Tabs = () => {
    const [activeTab, setActiveTab] = useState('commitment');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'commitment':
                return <CommitmentRequestForm />;
            case 'queried':
                return <QueriedRequestTab />;
            case 'completed':
                return <CompletedRequestTab />;
            default:
                return null;
        }
    };

    return (
        <div>
            <div className="tab-navigation">
                <button onClick={() => setActiveTab('commitment')}>Commitment Request</button>
                <button onClick={() => setActiveTab('queried')}>Queried Request</button>
                <button onClick={() => setActiveTab('completed')}>Completed Request</button>
            </div>
            <div className="tab-content">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default Tabs;