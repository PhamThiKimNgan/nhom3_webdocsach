import { axiosClientWithToken } from "./axiosClient";
import getData from "./getData";

export const checkSaved = async (url:string) => {
    return getData(await axiosClientWithToken.get(`/saved/${url}`));
}
export const savedStory = async (params:any) => {
    return getData(await axiosClientWithToken.post(`/saved/`, params));
}
export const unsavedStory = async (params:any) => {
    return getData(await axiosClientWithToken.delete(`/saved`, { data: params }));
}
export const getListSaved = async () => {
    const url = `/saved`
    return getData(await axiosClientWithToken.get(url));
}