import { User } from "models/User";
import { axiosClient, axiosClientWithToken } from "./axiosClient";
import getData from "./getData";

// Get all users (for admin)
export const getAllUsers = async (params?: any): Promise<User[]> => {
  const response = getData(await axiosClientWithToken.get("/admin/users", { params }));
  console.log(response);
  return response;
};

// Get user details by ID
export const getUserById = async (id: string): Promise<User> => {
  return getData(await axiosClientWithToken.get(`/admin/users/${id}`));
};

// Update user role (admin only)
export const updateUserRole = async (id: string, role: string) => {
  return getData(
    await axiosClientWithToken.put(`/admin/users/${id}/role`, { role })
  );
};



// Delete user (admin only)
export const deleteUser = async (id: string) => {
  return getData(await axiosClientWithToken.delete(`/admin/users/${id}`));
};

// Ban a user (admin only)
export const banUser = async (id: string, reason: string) => {
  return getData(
    await axiosClientWithToken.post(`/admin/users/${id}/ban`, { reason })
  );
};

// Unban a user (admin only)
export const unbanUser = async (id: string) => {
  return getData(await axiosClientWithToken.post(`/admin/users/${id}/unban`));
};

// Get user statistics (admin only)
export const getUserStats = async () => {
  return getData(await axiosClientWithToken.get("/admin/stats/users"));
};

// Search users by username, email, etc.
export const searchUsers = async (params: any): Promise<User[]> => {
  return getData(
    await axiosClientWithToken.get("/admin/users/search", { params })
  );
};
