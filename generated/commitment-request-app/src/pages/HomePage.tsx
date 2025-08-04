"use client"
import React, { useState } from 'react';
import CommitmentRequestForm from '../components/CommitmentRequestForm';
import QueriedRequestTab from '../components/QueriedRequestTab';
import CompletedRequestTab from '../components/CompletedRequestTab';
import Tabs from '../components/Tabs';

const HomePage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('commitment');

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    return (
        <div>
            <h1>Commitment Request Application</h1>
            <Tabs activeTab={activeTab} onTabChange={handleTabChange} />
            {activeTab === 'commitment' && <CommitmentRequestForm />}
            {activeTab === 'queried' && <QueriedRequestTab />}
            {activeTab === 'completed' && <CompletedRequestTab />}
        </div>
    );
};

export default HomePage;