import React from "react";
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import Header from "components/Header/Header";
import "./AdminLayout.scss";

// Import các views
import Dashboard from "../Dashboard/Dashboard";
import StoryManagement from "../StoryManagement/StoryManagement";
import BillManagement from "../BillManagement/BillManagement";
import CommentManagement from "../CommentManagement/CommentManagement";
import RatingManagement from "../RatingManagement/RatingManagement";
import StoryDetail from "../StoryDetail/StoryDetail";
import AdminCreateStory from "../AdminCreateStory/AdminCreateStory";
import AdminUsers from "../AdminUsers/AdminUsers";
import AdminProfile from "../AdminProfile/AdminProfile";
import AdminChangePassword from "../AdminChangePassword/AdminChangePassword";
import AdminSetting from "../AdminSetting/AdminSetting";
import AdminTuTruyen from "../AdminTuTruyen/AdminTuTruyen";
import AdminEditStory from "../AdminEditStory/AdminEditStory";

const AdminLayout: React.FC = () => {
  const location = useLocation();

  const sidebarItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: "bx bx-tachometer" },
    { path: "/admin/profile", label: "Hồ sơ", icon: "bx bx-user" },
    {
      path: "/admin/change-password",
      label: "Đổi mật khẩu",
      icon: "bx bxs-key",
    },
    { path: "/admin/users", label: "Quản lý người dùng", icon: "bx bx-group" },
    { path: "/admin/stories", label: "Quản lý truyện", icon: "bx bx-book" },
    {
      path: "/admin/stories/create",
      label: "Tạo truyện mới",
      icon: "bx bx-plus-circle",
    },
    { path: "/admin/bills", label: "Quản lý thanh toán", icon: "bx bx-money" },
    {
      path: "/admin/comments",
      label: "Quản lý bình luận",
      icon: "bx bx-comment",
    },
    { path: "/admin/ratings", label: "Quản lý đánh giá", icon: "bx bx-star" },
    {
      path: "/admin/tu-truyen/reading",
      label: "Tủ truyện",
      icon: "bx bx-library",
    },
    { path: "/admin/setting", label: "Cài đặt", icon: "bx bx-cog" },
  ];

  return (
    <div className="admin-layout">
      <Header />
      <div className="admin-layout__container">
        <aside className="admin-layout__sidebar">
          <div className="sidebar-header">
            <h2>Admin Panel</h2>
          </div>
          <nav className="sidebar-nav">
            <ul>
              {sidebarItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className={location.pathname === item.path ? "active" : ""}
                  >
                    <i className={item.icon}></i>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <main className="admin-layout__content">
          <Routes>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<AdminProfile />} />
            <Route path="/change-password" element={<AdminChangePassword />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/stories" element={<StoryManagement />} />
            <Route path="/stories/create" element={<AdminCreateStory />} />{" "}
            <Route path="/stories/edit/:id" element={<AdminEditStory />} />
            <Route path="/stories/:id" element={<StoryDetail />} />
            <Route path="/tu-truyen/*" element={<AdminTuTruyen />} />
            <Route path="/bills" element={<BillManagement />} />
            <Route path="/comments" element={<CommentManagement />} />
            <Route path="/ratings" element={<RatingManagement />} />
            <Route path="/setting" element={<AdminSetting />} />
            <Route
              path="/*"
              element={<Navigate to="/admin/dashboard" replace />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
