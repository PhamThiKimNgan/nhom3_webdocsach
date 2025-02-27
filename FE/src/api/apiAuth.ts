import { Story } from "models/Story";
import { axiosClient, axiosClientWithToken } from "./axiosClient";
import getData from "./getData";
import { User } from "models/User";
import { ChangePasswordParams } from "types/params";
import { Bill } from "models/Bill";

export const login =async (params:any) => {
    const res = await axiosClient.post('/auth/login', params)
    return res.data;
}
export const register= async (params:any) => {
    const res = await axiosClient.post('/auth/register', params)
    return res.data;
}
export const forgetPassword= async (params:any) => {
    const res = await axiosClient.post<never>('/auth/forgetpassword', params)
    return getData(res);
}
export const reActive= async (params:any) => {
    const res = await axiosClient.post<never>('/auth/reactive', params)
    return getData(res);
}

export const getUserInfo=async () => {
    return (await axiosClientWithToken.get('/user/info')).data;
}

export const activeAccount=async (params:any) => {
    const res = await axiosClient.get(`/auth/active`, { params: params });
    return res.data;
}

export const updateUserInfo = async ( params:any):Promise<User> => {
    return getData(await axiosClientWithToken.put('/user/info', params )).userInfo;
}

export const ChangePassword = async (params:ChangePasswordParams) => {
    return getData(await axiosClientWithToken.put('/user/info/password', params));
}

export const updateTraffic= async () => {
    return getData(await axiosClientWithToken.post(`/traffic`));
}

export const checkUsername=async (params:any) => {
    const res = getData(await axiosClient.post('/auth/check-username', params))
    return res;
}
export const checkEmail=async (params:any) => {
    const res = getData(await axiosClient.post('/auth/check-email', params))
    return res;
}

export const getBillByUser = async ():Promise<Bill[]> => {
    const url = 'statistic/get-bill-byuser'
    return getData(await axiosClientWithToken.get(url));
}