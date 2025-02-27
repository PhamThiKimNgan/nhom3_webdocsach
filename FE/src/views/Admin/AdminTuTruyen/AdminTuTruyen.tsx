import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import './AdminTuTruyen.scss';
import { Story } from '../../../models/Story';

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
  const [stories, setStories] = useState<StoryCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockStories = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        title: `Truyện đang đọc ${i + 1}`,
        author: `Tác giả ${i + 1}`,
        coverImage: `https://via.placeholder.com/100x150`,
        lastChapter: `Chương ${Math.floor(Math.random() * 100) + 1}`,
        lastReadAt: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0]
      }));
      
      setStories(mockStories);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="admin-tu-truyen-section">
      <h2>Truyện đang đọc</h2>
      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <div className="stories-grid">
          {stories.length > 0 ? (
            stories.map(story => (
              <div key={story.id} className="story-card">
                <div className="story-cover">
                  <img src={story.coverImage} alt={story.title} />
                </div>
                <div className="story-info">
                  <h3>{story.title}</h3>
                  <p className="author">{story.author}</p>
                  <p className="last-chapter">Đã đọc: {story.lastChapter}</p>
                  <p className="last-read">Lần cuối: {story.lastReadAt}</p>
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
  const [stories, setStories] = useState<Array<{
      id: number;
      title: string;
      author: string;
      coverImage: string;
      latestChapter: string;
      updatedAt: string;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockStories = Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        title: `Truyện đang theo dõi ${i + 1}`,
        author: `Tác giả ${i + 1}`,
        coverImage: `https://via.placeholder.com/100x150`,
        latestChapter: `Chương ${Math.floor(Math.random() * 100) + 1}`,
        updatedAt: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0]
      }));
      
      setStories(mockStories);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="admin-tu-truyen-section">
      <h2>Truyện đang theo dõi</h2>
      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <div className="stories-grid">
          {stories.length > 0 ? (
            stories.map(story => (
              <div key={story.id} className="story-card">
                <div className="story-cover">
                  <img src={story.coverImage} alt={story.title} />
                </div>
                <div className="story-info">
                  <h3>{story.title}</h3>
                  <p className="author">{story.author}</p>
                  <p className="latest-chapter">Mới nhất: {story.latestChapter}</p>
                  <p className="updated-at">Cập nhật: {story.updatedAt}</p>
                </div>
                <div className="story-actions">
                  <button className="btn-read">Đọc truyện</button>
                  <button className="btn-unfollow">
                    Bỏ theo dõi
                  </button>
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
          className={({ isActive }) => isActive ? "tab-active" : ""}
        >
          <i className="bx bx-book-open"></i>
          Truyện đang đọc
        </NavLink>
        <NavLink 
          to="/admin/tu-truyen/following" 
          className={({ isActive }) => isActive ? "tab-active" : ""}
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
