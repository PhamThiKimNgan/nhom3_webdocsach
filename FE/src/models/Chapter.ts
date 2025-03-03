export interface Chapter {
    _id: string;
    name:string;
    chapternumber:number;
    content?:string;
    [x:string]:any;
  }