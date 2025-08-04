import React, { useState } from 'react';
import RequestCard from './RequestCard';

const CompletedRequestTab = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const requestsPerPage = 5;

    const completedRequests = [
        // Sample data for completed requests
        { id: 1, type: 'Type A', date: '2023-10-01', total: 100, status: 'completed' },
        { id: 2, type: 'Type B', date: '2023-10-02', total: 200, status: 'completed' },
        // Add more sample requests as needed
    ];

    const filteredRequests = completedRequests.filter(request =>
        request.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastRequest = currentPage * requestsPerPage;
    const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
    const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);

    const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);

    return (
        <div>
            <input
                type="text"
                placeholder="Search completed requests"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div>
                {currentRequests.map(request => (
                    <RequestCard
                        key={request.id}
                        requestType={request.type}
                        date={request.date}
                        total={request.total}
                        status={request.status}
                    />
                ))}
            </div>
            <div>
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span> Page {currentPage} of {totalPages} </span>
                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default CompletedRequestTab;