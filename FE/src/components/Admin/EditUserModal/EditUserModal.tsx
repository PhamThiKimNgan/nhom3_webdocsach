import React, { useState, useEffect } from 'react';
import { User } from '../../../models/User';
import { updateUser } from '../../../api/apiAdmin';
import { toast } from 'react-toastify';
import './EditUserModal.scss';

interface EditUserModalProps {
  user: User | null;
  onClose: () => void;
  onUserUpdated: (updatedUser: User) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, onClose, onUserUpdated }) => {
  const [formData, setFormData] = useState<Partial<User>>({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPasswordField, setShowPasswordField] = useState(false);

  useEffect(() => {
    if (user) {
      // Format birthdate for date input
      const birthdate = user.birthdate ? new Date(user.birthdate).toISOString().split('T')[0] : '';
      
      setFormData({
        ...user,
        birthdate,
        password: '' // Don't display the actual password
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    // Handle checkbox
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    
    // Clear error for this field when changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Username validation
    if (formData.username && formData.username.length < 6) {
      newErrors.username = 'Tên đăng nhập phải dài hơn 5 kí tự';
    }
    
    // Password validation (only if password field is shown and has a value)
    if (showPasswordField && formData.password && formData.password.length < 8) {
      newErrors.password = 'Mật khẩu phải dài hơn 8 kí tự';
    }
    
    // Email validation
    if (formData.email && !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    // Birthdate is required
    if (!formData.birthdate) {
      newErrors.birthdate = 'Ngày sinh là bắt buộc';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // If password is empty and not shown, don't send it
      const dataToSubmit = {...formData};
      if (!showPasswordField || !dataToSubmit.password) {
        delete dataToSubmit.password;
      }
      
      const updatedUser = await updateUser(user?.id?.toString() || '', dataToSubmit);
      toast.success('Thông tin người dùng đã được cập nhật thành công');
      onUserUpdated(updatedUser);
      onClose();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Có lỗi xảy ra khi cập nhật thông tin người dùng');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="modal-overlay">
      <div className="edit-user-modal">
        <div className="edit-user-modal__header">
          <h2>Chỉnh sửa thông tin người dùng</h2>
          <button className="close-button" onClick={onClose}>
            <i className="bx bx-x"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="edit-user-modal__content">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="username">Tên đăng nhập</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username || ''}
                onChange={handleChange}
                disabled={true} // Username shouldn't be changed
              />
              {errors.username && <div className="error-message">{errors.username}</div>}
            </div>
            
            <div className="form-group">
              <div className="password-header">
                <label htmlFor="password">Mật khẩu</label>
                <div className="toggle-password">
                  <input
                    type="checkbox"
                    id="show-password"
                    checked={showPasswordField}
                    onChange={() => setShowPasswordField(!showPasswordField)}
                  />
                  <label htmlFor="show-password">Thay đổi mật khẩu</label>
                </div>
              </div>
              {showPasswordField && (
                <>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password || ''}
                    onChange={handleChange}
                    placeholder="Nhập mật khẩu mới"
                  />
                  {errors.password && <div className="error-message">{errors.password}</div>}
                </>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="nickname">Tên hiển thị</label>
              <input
                type="text"
                id="nickname"
                name="nickname"
                value={formData.nickname || ''}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="image">Ảnh đại diện URL</label>
              <input
                type="text"
                id="image"
                name="image"
                value={formData.image || ''}
                onChange={handleChange}
              />
              {formData.image && (
                <div className="image-preview">
                  <img src={formData.image} alt="User avatar" />
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="birthdate">Ngày sinh</label>
              <input
                type="date"
                id="birthdate"
                name="birthdate"
                value={formData.birthdate || ''}
                onChange={handleChange}
              />
              {errors.birthdate && <div className="error-message">{errors.birthdate}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="balance">Số dư</label>
              <input
                type="number"
                id="balance"
                name="balance"
                value={formData.balance || 0}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group checkbox-group">
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  id="active"
                  name="active"
                  checked={formData.active || false}
                  onChange={handleChange}
                />
                <label htmlFor="active">Đã kích hoạt</label>
              </div>
            </div>
            
            <div className="form-group checkbox-group">
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  id="isDeleted"
                  name="isDeleted"
                  checked={formData.isDeleted || false}
                  onChange={handleChange}
                />
                <label htmlFor="isDeleted">Đã xóa</label>
              </div>
            </div>
          </div>
          
          <div className="form-group roles-group">
            <label>Vai trò</label>
            <div className="roles-container">
              <div className="role-checkbox">
                <input
                  type="checkbox"
                  id="role-admin"
                  checked={formData.role === 'ADMIN'}
                  onChange={() => setFormData({...formData, role: 'ADMIN'})}
                />
                <label htmlFor="role-admin">Admin</label>
              </div>
              <div className="role-checkbox">
                <input
                  type="checkbox"
                  id="role-user"
                  checked={formData.role === 'USER'}
                  onChange={() => setFormData({...formData, role: 'USER'})}
                />
                <label htmlFor="role-user">User</label>
              </div>
            </div>
          </div>
          
          <div className="edit-user-modal__actions">
            <button 
              type="button" 
              className="cancel-button"
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </button>
            <button 
              type="submit"
              className="save-button"
              disabled={loading}
            >
              {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;