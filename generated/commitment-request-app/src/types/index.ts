export interface CommitmentRequest {
    requestType: string;
    commitmentRequestNumber: string;
    description: string;
    dateOfRequest: Date;
    notes: string;
    supportingDocuments: FileList | null;
    financials: {
        compensation: number;
        capex: number;
        goodsAndServices: number;
        total: number;
    };
}

export interface QueriedRequest {
    requestType: string;
    date: Date;
    total: number;
    status: 'started' | 'ongoing' | 'on-hold';
}

export interface CompletedRequest extends QueriedRequest {
    completionDate: Date;
}

export type RequestStatus = 'started' | 'ongoing' | 'on-hold' | 'completed';