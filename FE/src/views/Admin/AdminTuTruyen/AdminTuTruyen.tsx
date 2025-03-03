import React, { useState, useEffect } from "react";
import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import "./AdminTuTruyen.scss";
import { Story } from "../../../models/Story";
import { Reading } from "../../../models/Reading";
import { getReadings } from "../../../api/apiStory";
import { getListSaved } from "../../../api/apiSaveStory";

interface StoryCardProps {
  id: number;
  title: string;
  author: string;
  coverImage: string;
  lastChapter: string;
  lastReadAt: string;
}

// Sub-components
const AdminTuTruyenReading = () => {
  const [stories, setStories] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        const data = await getReadings();
        console.log(data);
        setStories(data);
      } catch (error) {
        console.error("Error fetching reading list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReadings();
  }, []);

  return (
    <div className="admin-tu-truyen-section">
      <h2>Truyện đang đọc</h2>
      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <div className="stories-grid">
          {stories.length > 0 ? (
            stories.map((story) => (
              <div key={story.novelId.id} className="story-card">
                <div className="story-cover">
                  <img
                    src={
                      story.novelId?.image ||
                      "https://via.placeholder.com/100x150"
                    }
                    alt={story.novelId?.name || "Không có tiêu đề"}
                  />
                  <div className="story-badge">Đang đọc</div>
                </div>
                <div className="story-info">
                  <h3>{story.novelId?.name || "Không có tiêu đề"}</h3>
                  <p className="author">
                    {story.novelId?.author || "Chưa có tác giả"}
                  </p>
                  <p className="last-chapter">
                    Đã đọc: Chương {story.novelId.numberofchapter || "N/A"}
                  </p>
                  <p className="last-read">
                    Lần cuối:{" "}
                    {new Date(story.novelId.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="story-actions">
                  <button className="btn-continue">Tiếp tục đọc</button>
                  <button className="btn-remove">
                    <i className="bx bx-trash"></i>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-data">Không có truyện nào đang đọc</div>
          )}
        </div>
      )}
    </div>
  );
};

const AdminTuTruyenFollowing = () => {
  const [savedStories, setSavedStories] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedStories = async () => {
      try {
        const data = await getListSaved();
        setSavedStories(data);
      } catch (error) {
        console.error("Error fetching saved stories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedStories();
  }, []);

  return (
    <div className="admin-tu-truyen-section">
      <h2>Truyện đang theo dõi</h2>
      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <div className="stories-grid">
          {savedStories.length > 0 ? (
            savedStories.map((saved) => (
              <div key={saved.id} className="story-card">
                <div className="story-cover">
                  <img
                    src={
                      saved.novel.coverImage ||
                      "https://via.placeholder.com/100x150"
                    }
                    alt={saved.novel.title}
                  />
                  <div className="story-badge">Theo dõi</div>
                </div>
                <div className="story-info">
                  <h3>{saved.novel.title}</h3>
                  <p className="author">{saved.novel.author}</p>
                  <p className="latest-chapter">
                    Mới nhất: Chương{" "}
                    {saved.novel.newestChapter?.number || "N/A"}
                  </p>
                  <p className="updated-at">
                    Cập nhật:{" "}
                    {new Date(saved.novel.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="story-actions">
                  <button className="btn-read">Đọc truyện</button>
                  <button className="btn-unfollow">Bỏ theo dõi</button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-data">Không có truyện nào đang theo dõi</div>
          )}
        </div>
      )}
    </div>
  );
};

const AdminTuTruyen: React.FC = () => {
  return (
    <div className="admin-tu-truyen">
      <h1>Tủ truyện</h1>

      <div className="admin-tu-truyen__tabs">
        <NavLink
          to="/admin/tu-truyen/reading"
          className={({ isActive }) => (isActive ? "tab-active" : "")}
        >
          <i className="bx bx-book-open"></i>
          Truyện đang đọc
        </NavLink>
        <NavLink
          to="/admin/tu-truyen/following"
          className={({ isActive }) => (isActive ? "tab-active" : "")}
        >
          <i className="bx bx-bookmark"></i>
          Truyện theo dõi
        </NavLink>
      </div>

      <div className="admin-tu-truyen__content">
        <Routes>
          <Route path="/" element={<Navigate to="reading" replace />} />
          <Route path="reading" element={<AdminTuTruyenReading />} />
          <Route path="following" element={<AdminTuTruyenFollowing />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminTuTruyen;
