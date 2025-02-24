export interface Chapter {
    id: string;
    name:string;
    chapternumber:number;
    content?:string;
    [x:string]:any;
  }