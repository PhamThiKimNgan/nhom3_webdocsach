export interface User {
    id:string;
    username:string;
    image:string;
    balance:number | 0;
    birthdate:string;
    roles:string[];
    tenhienthi?:string | '';
    [x:string]:any;
}