export interface Reading {
    name: string;
    image: string;
    sochap: number | 0;
    url: string | '';
    chapternumber: number | '';
    dadoc?:number;
    [x: string]: any;
}