export interface Comment {
    id:string;
    name:string;
    image:string;
    content:string;
    nickname?:string;
    [x:string]:any;
}