export interface Bill {
    id:string;
    description:string;
    amount:number | 0;
    status:string;
    updatedAt:string;
    [x:string]:any;
}