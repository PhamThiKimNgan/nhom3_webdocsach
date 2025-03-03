import React, { useState, useEffect } from "react";
import "./AdminUsers.scss";
import {
  getAllUsers,
  deleteUser,
  banUser,
  unbanUser,
  searchUsers,
  updateUserRole,
} from "../../../api/apiUser";
import { toast } from "react-toastify";
import EditUserModal from "../../../components/Admin/EditUserModal/EditUserModal";

import { User as ModelUser } from "../../../models/User";
import { isAdmin } from "utils/getRoleAdmin";

interface User extends ModelUser {
  email: string;
  name: string;
  active: boolean;
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
  // New state for role modal
  const [showRoleModal, setShowRoleModal] = useState<boolean>(false);
  const [userToChangeRole, setUserToChangeRole] = useState<User | null>(null);
  // Section view state
  const [activeSection, setActiveSection] = useState<string>("active");

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
        active: user.active,
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
          active: user.active,
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
  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    setActionLoading(true);
    try {
      if (currentStatus) {
        await banUser(userId.toString());
        toast.success("Người dùng đã bị khóa thành công.");
      } else {
        await unbanUser(userId.toString());
        toast.success("Người dùng đã được mở khóa thành công.");
      }

      // Update user status in the local state
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, active: !currentStatus } : user
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

  // Open role modal
  const openRoleModal = (user: User) => {
    setUserToChangeRole(user);
    setShowRoleModal(true);
  };

  // Handle role change
  const handleRoleChange = async (newRole: string) => {
    if (!userToChangeRole) return;

    setActionLoading(true);
    try {
      // Here you would call your API to change the user's role
      // For example: await changeUserRole(userToChangeRole._id, newRole);
      await updateUserRole(userToChangeRole._id, newRole);

      // Update the user in local state
      setUsers(
        users.map((user) =>
          user._id === userToChangeRole._id ? { ...user, role: newRole } : user
        )
      );

      toast.success("Vai trò người dùng đã được cập nhật thành công.");
      setShowRoleModal(false);
    } catch (err) {
      console.error("Error updating user role:", err);
      toast.error("Có lỗi xảy ra khi cập nhật vai trò người dùng.");
    } finally {
      setActionLoading(false);
      setUserToChangeRole(null);
    }
  };

  // Toggle section view
  const toggleSectionView = (section: string) => {
    setActiveSection(section);
  };

  // Separate users into active and inactive
  const activeUsers = users.filter((user) => user.active);
  const inactiveUsers = users.filter((user) => !user.active);

  // Render user table
  const renderUserTable = (userList: User[]) => (
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
          </tr>
        </thead>
        <tbody>
          {userList.length > 0 ? (
            userList.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.nickname}</td>
                <td>
                  <span
                    className={`badge ${
                      user.role === "ADMIN" ? "badge-admin" : "badge-user"
                    }`}
                    onClick={() => openRoleModal(user)}
                    style={{ cursor: "pointer" }}
                    title="Nhấp để thay đổi vai trò"
                  >
                    {user.role}
                  </span>
                </td>
                <td>
                  <span
                    className={`status ${
                      user.active ? "status-active" : "status-inactive"
                    }`}
                    onClick={() => toggleUserStatus(user._id, user.active)}
                    style={{ cursor: "pointer" }}
                    title={user.active ? "Nhấp để khóa" : "Nhấp để mở khóa"}
                  >
                    {user.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString("vi-VN")}</td>
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
  );

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
          <div className="section-tabs">
            <button
              className={`section-tab ${
                activeSection === "active" ? "active" : ""
              }`}
              onClick={() => toggleSectionView("active")}
            >
              Người dùng hoạt động ({activeUsers.length})
            </button>
            <button
              className={`section-tab ${
                activeSection === "inactive" ? "active" : ""
              }`}
              onClick={() => toggleSectionView("inactive")}
            >
              Người dùng bị khóa ({inactiveUsers.length})
            </button>
          </div>

          {activeSection === "active" ? (
            <div className="section-content">
              <h2>Người dùng hoạt động</h2>
              {renderUserTable(activeUsers)}
            </div>
          ) : (
            <div className="section-content">
              <h2>Người dùng bị khóa</h2>
              {renderUserTable(inactiveUsers)}
            </div>
          )}

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

      {/* Role Change Modal */}
      {showRoleModal && userToChangeRole && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Thay đổi vai trò người dùng</h3>
            <p>
              Thay đổi vai trò cho người dùng{" "}
              <strong>{userToChangeRole.username}</strong>
            </p>
            <div className="role-options">
              <button
                className={`role-option ${
                  userToChangeRole.role === "USER" ? "selected" : ""
                }`}
                onClick={() => handleRoleChange("USER")}
                disabled={actionLoading || userToChangeRole.role === "USER"}
              >
                <span className="role-name">User</span>
                <span className="role-desc">Quyền người dùng cơ bản</span>
              </button>

              <button
                className={`role-option ${
                  userToChangeRole.role === "ADMIN" ? "selected" : ""
                }`}
                onClick={() => handleRoleChange("ADMIN")}
                disabled={actionLoading || userToChangeRole.role === "ADMIN"}
              >
                <span className="role-name">Admin</span>
                <span className="role-desc">Quyền quản trị viên</span>
              </button>
            </div>
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowRoleModal(false)}
                disabled={actionLoading}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
