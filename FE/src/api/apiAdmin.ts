import { axiosClientWithToken } from "./axiosClient";
import getData from "./getData";
import { Bill } from "models/Bill";
import { Rating } from "models/Rating";


// Admin API endpoints
export const getAllComments = async (params?: any): Promise<Comment[]> => {
    return getData(await axiosClientWithToken.get(`/comment/getlistcomments`, { params }));
  };

// Get all bills (admin only)
export const getAllBills = async (params?: any): Promise<Bill[]> => {
  return getData(await axiosClientWithToken.get("/admin/bills/getbills", { params }));
};

// Get all ratings (admin only)
export const getAllRatings = async (params?: any): Promise<Rating[]> => {
  return getData(await axiosClientWithToken.get("rating/all", { params }));
};

// Delete rating (admin only)
export const deleteRatingById = async (id: string) => {
  return getData(
    await axiosClientWithToken.delete("/admin/rating", { params: { id } })
  );
};

// Get site statistics
export const getSiteStatistics = async () => {
  return getData(await axiosClientWithToken.get("/admin/stats"));
};

// Get novel statistics
export const getNovelStatistics = async () => {
  return getData(await axiosClientWithToken.get("/admin/stats/novels"));
};

// Get financial statistics
export const getFinancialStatistics = async (params?: any) => {
  return getData(
    await axiosClientWithToken.get("/admin/stats/financial", { params })
  );
};
