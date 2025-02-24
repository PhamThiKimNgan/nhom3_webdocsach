export interface Rating {
    id:string;
    name:string;
    rating:number;
    content:string;
    nickname?:string;
    [x:string]:any;
}