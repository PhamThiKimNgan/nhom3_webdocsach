import { axiosClientWithToken } from "./axiosClient";
import getData from "./getData";

export const createChapter = async (params:any) => {
    const url = `/novels/novel/chuong/create`
    return getData(await axiosClientWithToken.post(url, params));
}
export const updateChapter = async (params:any) => {
    const url = `/novels/novel/chuong/edit`
   
    return getData(await axiosClientWithToken.put(url, params));
}

export const deleteChapter = async (params:any) => {
    const url = `/novels/novel/chuong`
    return getData(await axiosClientWithToken.delete(url, { params }));
}
