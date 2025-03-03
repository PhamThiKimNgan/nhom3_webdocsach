import { User } from "models/User";
import { axiosClient, axiosClientWithToken } from "./axiosClient";
import getData from "./getData";

// Get all users (for admin)
export const getAllUsers = async (params?: any): Promise<User[]> => {
  const response = getData(
    await axiosClientWithToken.get("/admin/users", { params })
  );
  console.log(response);
  return response;
};

// Get user details by ID
export const getUserById = async (id: string): Promise<User> => {
  return getData(await axiosClientWithToken.get(`/admin/users/${id}`));
};

// Update user role (admin only)
export const updateUserRole = async (id: string, role: string) => {
  const roles = [role];
  return getData(
    await axiosClientWithToken.put(`/admin/role/updatetouser`, { id, roles })
  );
};

// Delete user (admin only)
export const deleteUser = async (id: string) => {
  return getData(await axiosClientWithToken.delete(`/admin/users/${id}`));
};

// Ban a user (admin only)
export const banUser = async (userId: string) => {
  return getData(
    await axiosClientWithToken.put(`/admin/user/inactive`, { userId })
  );
};

// Unban a user (admin only)
export const unbanUser = async (userId: string) => {
  return getData(
    await axiosClientWithToken.put(`/admin/user/active`, { userId })
  );
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
