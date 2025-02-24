import { axiosClientWithToken } from "./axiosClient";
import getData from "./getData";

export const makePaymentMomo = async (params:any) => {
  const res = await axiosClientWithToken.post("/payment/create-payment", params);
  return res.data;
};
export const makePaymentVNPay = async (params:any) => {
  const res = await axiosClientWithToken.post("/payment/create-vnp-payment", params);
  return res.data;
};

export const getInfoWithBalance = async () => {
  const res = getData(await axiosClientWithToken.post("/user/info-balance", {}));
  return res;
};
export const unlockChapter = async (params:any) => {
  const res = getData(await axiosClientWithToken.post("/novels/chuong/unlock", params));
  return res;
};
