export interface News{
    id: string;
    title: string;
    description: string;
    date: Date;
    status: NewsStatus;
}

export enum NewsStatus {
    CREATED = 'CREATED',
    PUBLISHED = 'PUBLISHED'
}