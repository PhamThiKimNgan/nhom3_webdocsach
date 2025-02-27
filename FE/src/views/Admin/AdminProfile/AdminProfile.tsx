import React, { useState, useEffect } from 'react';
import { userStore } from 'store/userStore';
import './AdminProfile.scss';

const AdminProfile: React.FC = () => {
  const user = userStore(state => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    nickname: '',
    name: '',
    phone: '',
    image: ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || '',
        email: user.email || '',
        nickname: user.nickname || '',
        name: user.name || '',
        phone: user.phone || '',
        image: user.image || ''
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle profile update API call here
    console.log('Profile data to update:', profileData);
    setIsEditing(false);
  };

  return (
    <div className="admin-profile">
      <div className="admin-profile__header">
        <h1>Thông tin cá nhân</h1>
        <button 
          className="btn btn-primary" 
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Hủy' : 'Chỉnh sửa'}
        </button>
      </div>

      <div className="admin-profile__content">
        <div className="admin-profile__avatar">
          <img 
            src={profileData.image || 'https://via.placeholder.com/150'} 
            alt="Profile avatar" 
          />
          {isEditing && (
            <div className="avatar-upload">
              <label htmlFor="image-upload">Đổi ảnh đại diện</label>
              <input 
                id="image-upload" 
                type="file" 
                accept="image/*" 
                style={{ display: 'none' }}
              />
            </div>
          )}
        </div>

        <form className="admin-profile__form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên đăng nhập</label>
            <input 
              type="text" 
              name="username" 
              value={profileData.username} 
              readOnly
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email" 
              value={profileData.email} 
              onChange={handleInputChange} 
              readOnly={!isEditing}
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label>Tên hiển thị</label>
            <input 
              type="text" 
              name="nickname" 
              value={profileData.nickname} 
              onChange={handleInputChange} 
              readOnly={!isEditing}
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label>Họ và tên</label>
            <input 
              type="text" 
              name="name" 
              value={profileData.name} 
              onChange={handleInputChange} 
              readOnly={!isEditing}
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label>Số điện thoại</label>
            <input 
              type="tel" 
              name="phone" 
              value={profileData.phone} 
              onChange={handleInputChange} 
              readOnly={!isEditing}
              className="form-control"
            />
          </div>
          
          {isEditing && (
            <div className="form-actions">
              <button type="submit" className="btn btn-success">Lưu thay đổi</button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminProfile;
