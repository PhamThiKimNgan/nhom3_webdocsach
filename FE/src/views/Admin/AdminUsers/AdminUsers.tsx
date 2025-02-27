import React, { useState, useEffect } from "react";
import "./AdminUsers.scss";
import {
  getAllUsers,
  deleteUser,
  banUser,
  unbanUser,
  searchUsers,
} from "../../../api/apiUser";
import { toast } from "react-toastify";
import EditUserModal from "../../../components/Admin/EditUserModal/EditUserModal";

import { User as ModelUser } from "../../../models/User";
import { isAdmin } from "utils/getRoleAdmin";

interface User extends ModelUser {
  email: string;
  name: string;
  status: string;
  createdAt: string;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [usersPerPage] = useState<number>(10);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllUsers({
        page: currentPage,
        limit: usersPerPage,
        search: searchTerm,
      });

      const mappedUsers = response.map((user) => ({
        ...user,
        email: user.email || "",
        name: user.name || "",
        status: user.status || "Active",
        createdAt: user.createdAt || new Date().toISOString(),
        role: user.roles && isAdmin(user.roles) ? "ADMIN" : "USER",
      }));

      setUsers(mappedUsers);

      // Assume the API returns the total count in headers or response metadata
      // This is a placeholder - adjust based on your actual API response structure
      setTotalUsers(response.length); // Replace with actual count from API
      setTotalPages(Math.ceil(response.length / usersPerPage)); // Replace with calculation using actual count
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Không thể tải danh sách người dùng. Vui lòng thử lại sau.");
      toast.error("Có lỗi xảy ra khi tải dữ liệu người dùng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, usersPerPage]);

  // Handle search with API
  const handleSearch = async () => {
    setCurrentPage(1);
    if (searchTerm.trim()) {
      try {
        setLoading(true);
        const response = await searchUsers({ query: searchTerm });
        const mappedUsers = response.map((user) => ({
          ...user,
          email: user.email || "",
          name: user.name || "",
          status: user.status || "Active",
          createdAt: user.createdAt || new Date().toISOString(),
          role: user.role || "USER",
        }));

        setUsers(mappedUsers);
        setTotalUsers(response.length);
        setTotalPages(Math.ceil(response.length / usersPerPage));
      } catch (err) {
        console.error("Error searching users:", err);
        toast.error("Có lỗi xảy ra khi tìm kiếm người dùng.");
      } finally {
        setLoading(false);
      }
    } else {
      fetchUsers();
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Delete user
  const confirmDelete = (userId: number) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setActionLoading(true);
    try {
      await deleteUser(userToDelete.toString());
      toast.success("Người dùng đã được xóa thành công.");
      setUsers(users.filter((user) => Number(user.id) !== userToDelete));
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error("Có lỗi xảy ra khi xóa người dùng.");
    } finally {
      setActionLoading(false);
      setUserToDelete(null);
    }
  };

  // Toggle user status (ban/unban)
  const toggleUserStatus = async (userId: number, currentStatus: string) => {
    setActionLoading(true);
    try {
      if (currentStatus === "Active") {
        await banUser(userId.toString(), "Banned by admin");
        toast.success("Người dùng đã bị khóa thành công.");
      } else {
        await unbanUser(userId.toString());
        toast.success("Người dùng đã được mở khóa thành công.");
      }

      // Update user status in the local state
      setUsers(
        users.map((user) =>
          Number(user.id) === userId
            ? {
                ...user,
                status: currentStatus === "Active" ? "Inactive" : "Active",
              }
            : user
        )
      );
    } catch (err) {
      console.error("Error updating user status:", err);
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái người dùng.");
    } finally {
      setActionLoading(false);
    }
  };

  // Edit user
  const openEditModal = (user: User) => {
    setUserToEdit(user);
    setShowEditModal(true);
  };

  const handleUserUpdated = (updatedUser: User) => {
    // Update the user in the local state
    setUsers(
      users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
  };

  return (
    <div className="admin-users">
      <h1>Quản lý người dùng</h1>

      <div className="admin-users__actions">
        <form onSubmit={handleSearchSubmit} className="search-container">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <button type="submit" className="search-button">
            <i className="bx bx-search"></i>
          </button>
        </form>
      </div>

      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <div className="admin-users__table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên đăng nhập</th>
                  <th>Email</th>
                  <th>Tên hiển thị</th>
                  <th>Vai trò</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.name}</td>
                      <td>
                        <span
                          className={`badge ${
                            user.role === "ADMIN" ? "badge-admin" : "badge-user"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`status ${
                            user.status === "Active"
                              ? "status-active"
                              : "status-inactive"
                          }`}
                          onClick={() =>
                            toggleUserStatus(Number(user.id), user.status)
                          }
                          style={{ cursor: "pointer" }}
                          title={
                            user.status === "Active"
                              ? "Nhấp để khóa"
                              : "Nhấp để mở khóa"
                          }
                        >
                          {user.status}
                        </span>
                      </td>
                      <td>
                        {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="actions">
                        <button
                          className="btn-edit"
                          title="Chỉnh sửa"
                          onClick={() => openEditModal(user)}
                        >
                          <i className="bx bx-edit"></i>
                        </button>
                        <button
                          className="btn-delete"
                          title="Xóa"
                          onClick={() => confirmDelete(Number(user.id))}
                          disabled={actionLoading}
                        >
                          <i className="bx bx-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="no-data">
                      Không tìm thấy người dùng
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
              >
                <i className="bx bx-chevron-left"></i>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={pageNumber === currentPage ? "active" : ""}
                    disabled={loading}
                  >
                    {pageNumber}
                  </button>
                )
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
              >
                <i className="bx bx-chevron-right"></i>
              </button>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Xác nhận xóa</h3>
            <p>
              Bạn có chắc chắn muốn xóa người dùng này không? Hành động này
              không thể hoàn tác.
            </p>
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowDeleteModal(false)}
                disabled={actionLoading}
              >
                Hủy
              </button>
              <button
                className="btn-delete-confirm"
                onClick={handleDeleteUser}
                disabled={actionLoading}
              >
                {actionLoading ? "Đang xóa..." : "Xóa"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminUsers;
