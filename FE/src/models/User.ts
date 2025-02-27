import { Role } from "./Role";

export interface User {
    id:string;
    username:string;
    image:string;
    balance:number | 0;
    birthdate:string;
    roles:Role[];
    tenhienthi?:string | '';
    [x:string]:any;
}