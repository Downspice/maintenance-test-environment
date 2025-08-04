import React, { useState } from 'react';
import RequestCard from './RequestCard';

const QueriedRequestTab = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [requests, setRequests] = useState([
        // Sample data structure for requests
        { id: 1, type: 'Type A', date: '2023-10-01', total: 100, status: 'started' },
        { id: 2, type: 'Type B', date: '2023-10-02', total: 200, status: 'ongoing' },
        { id: 3, type: 'Type C', date: '2023-10-03', total: 150, status: 'on-hold' },
    ]);

    const filteredRequests = requests.filter(request =>
        request.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <input
                type="text"
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div>
                {filteredRequests.map(request => (
                    <RequestCard
                        key={request.id}
                        requestType={request.type}
                        date={request.date}
                        total={request.total}
                        status={request.status}
                    />
                ))}
            </div>
        </div>
    );
};

export default QueriedRequestTab;