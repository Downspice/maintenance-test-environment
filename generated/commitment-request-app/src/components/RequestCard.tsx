import React from 'react';

interface RequestCardProps {
    requestType: string;
    date: string;
    total: number;
    status: 'started' | 'ongoing' | 'on-hold' | 'completed';
}

const RequestCard: React.FC<RequestCardProps> = ({ requestType, date, total, status }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'started':
                return 'green';
            case 'ongoing':
                return 'blue';
            case 'on-hold':
                return 'orange';
            case 'completed':
                return 'gray';
            default:
                return 'black';
        }
    };

    return (
        <div className="request-card">
            <div className="request-card-header">
                <h3>{requestType}</h3>
                <span className="status-indicator" style={{ backgroundColor: getStatusColor(status) }}></span>
            </div>
            <div className="request-card-body">
                <p>Date: {date}</p>
                <p>Total: ${total.toFixed(2)}</p>
            </div>
        </div>
    );
};

export default RequestCard;