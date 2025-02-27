import { axiosClientWithToken } from "./axiosClient";
import getData from "./getData";

/**
 * Get all ratings (admin only)
 */
export const getListRating = async () => {
  const res = await axiosClientWithToken.get("/admin/rating/getlistratings");
  return getData(res);
};

/**
 * Delete a rating by ID (admin only)
 */
export const deleteRating = async (params: { id: string }) => {
  const res = await axiosClientWithToken.delete("/admin/rating", { params });
  return getData(res);
};

/**
 * Get all ratings for a specific novel by novelId (admin only)
 */
export const getListRatingByNovelId = async (novelId: string) => {
  const res = await axiosClientWithToken.get(`/admin/ratings/novel/${novelId}`);
  return getData(res);
};
