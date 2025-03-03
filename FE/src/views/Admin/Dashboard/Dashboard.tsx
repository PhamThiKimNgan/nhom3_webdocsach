import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Grid from "../../../components/Grid/Grid";
import Loading from "../../../components/Loading/Loading";
import { getAllUsers } from "../../../api/apiUser";
import { getNovels } from "../../../api/apiStory";
import {
  getAllBills,
  getAllComments,
  getAllRatings,
} from "../../../api/apiAdmin";

// Import dashboard styles
import "./dashboard.scss";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: 0,
    stories: 0,
    bills: 0,
    comments: 0,
    ratings: 0,
    totalRevenue: 0,
    dailyActiveUsers: 0,
    readingCount: 0,
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      user: "user123",
      action: "Đăng truyện mới",
      time: "15 phút trước",
    },
    {
      id: 2,
      user: "reader456",
      action: "Đăng bình luận",
      time: "32 phút trước",
    },
    { id: 3, user: "admin789", action: "Duyệt truyện", time: "45 phút trước" },
    {
      id: 4,
      user: "writer101",
      action: "Cập nhật chương mới",
      time: "1 giờ trước",
    },
    {
      id: 5,
      user: "mod202",
      action: "Xóa bình luận vi phạm",
      time: "2 giờ trước",
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [users, stories, bills, comments, ratings] = await Promise.all([
          getAllUsers(),
          getNovels({}),
          getAllBills(),
          getAllComments(),
          getAllRatings(),
        ]);
        // Calculate total revenue from bills
        const totalRevenue = bills.reduce(
          (sum, bill) => sum + (bill.amount || 0),
          0
        );

        // Mock data for additional metrics
        const dailyActiveUsers = Math.floor(users.length * 0.3); // Just a mock calculation
        const readingCount = stories.reduce(
          (sum, story) => sum + (story.viewCount || 0),
          0
        );

        setStats({
          users: users.length,
          stories: stories.length,
          bills: bills.length,
          comments: comments?.length || 0,
          ratings: ratings?.length || 0,
          totalRevenue,
          dailyActiveUsers,
          readingCount,
        });

        setLoading(false);
      } catch (error) {
        toast.error("Không thể tải dữ liệu thống kê");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="admin-dashboard">
      <div className="admin-card__header">
        <h2>Dashboard</h2>
      </div>

      <Grid col={4} mdCol={2} smCol={1} gap={20}>
        <div className="stats-card">
          <div className="stats-card__icon">
            <i className="bx bx-user"></i>
          </div>
          <div className="stats-card__value">{stats.users}</div>
          <div className="stats-card__title">Người dùng</div>
        </div>

        <div className="stats-card">
          <div className="stats-card__icon">
            <i className="bx bx-book"></i>
          </div>
          <div className="stats-card__value">{stats.stories}</div>
          <div className="stats-card__title">Truyện</div>
        </div>

        <div className="stats-card">
          <div className="stats-card__icon">
            <i className="bx bx-money"></i>
          </div>
          <div className="stats-card__value">
            {stats.totalRevenue.toLocaleString("vi-VN")}
          </div>
          <div className="stats-card__title">Doanh thu (VND)</div>
        </div>

        <div className="stats-card">
          <div className="stats-card__icon">
            <i className="bx bx-receipt"></i>
          </div>
          <div className="stats-card__value">{stats.bills}</div>
          <div className="stats-card__title">Giao dịch</div>
        </div>

        <div className="stats-card">
          <div className="stats-card__icon">
            <i className="bx bx-comment"></i>
          </div>
          <div className="stats-card__value">{stats.comments}</div>
          <div className="stats-card__title">Bình luận</div>
        </div>

        <div className="stats-card">
          <div className="stats-card__icon">
            <i className="bx bx-star"></i>
          </div>
          <div className="stats-card__value">{stats.ratings}</div>
          <div className="stats-card__title">Đánh giá</div>
        </div>

        <div className="stats-card">
          <div className="stats-card__icon">
            <i className="bx bx-user-check"></i>
          </div>
          <div className="stats-card__value">{stats.dailyActiveUsers}</div>
          <div className="stats-card__title">Người dùng hoạt động</div>
        </div>

        <div className="stats-card">
          <div className="stats-card__icon">
            <i className="bx bx-book-reader"></i>
          </div>
          <div className="stats-card__value">
            {stats.readingCount.toLocaleString()}
          </div>
          <div className="stats-card__title">Lượt đọc</div>
        </div>
      </Grid>

      <div className="dashboard-content">
        <Grid col={2} mdCol={1} smCol={1} gap={20}>
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Doanh thu theo thời gian</h3>
            </div>
            <div className="card-body">
              <div className="revenue">
                <span className="amount">
                  {stats.totalRevenue.toLocaleString()} VND (Tổng)
                </span>
                <span className="trend positive">
                  <i className="bx bx-up-arrow-alt"></i> 12.5%
                </span>
              </div>
              <div className="chart-placeholder">
                <div className="placeholder-chart">Biểu đồ doanh thu</div>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h3>Hoạt động gần đây</h3>
            </div>
            <div className="card-body">
              <ul className="activity-list">
                {recentActivity.map((activity) => (
                  <li key={activity.id} className="activity-item">
                    <div className="activity-icon">
                      <i className="bx bx-bell"></i>
                    </div>
                    <div className="activity-details">
                      <span className="user">{activity.user}</span>
                      <span className="action">{activity.action}</span>
                      <span className="time">{activity.time}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Grid>
      </div>
    </div>
  );
};

export default Dashboard;
