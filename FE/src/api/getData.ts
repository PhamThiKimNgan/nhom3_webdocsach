import { AxiosResponse } from "axios";

const getData = (response:AxiosResponse)=>{
    let result:any = response?.data;
    if(result){
        let result2 = result?.data;
        if(result2)
            return result2;
        return result
    }
        
    return response;
}
export default getData