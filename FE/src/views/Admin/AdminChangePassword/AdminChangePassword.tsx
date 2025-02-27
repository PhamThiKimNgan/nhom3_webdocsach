import React, { useState } from 'react';
import './AdminChangePassword.scss';

const AdminChangePassword: React.FC = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    
    if (!passwords.currentPassword) {
      newErrors.currentPassword = 'Mật khẩu hiện tại không được để trống';
      valid = false;
    }
    
    if (!passwords.newPassword) {
      newErrors.newPassword = 'Mật khẩu mới không được để trống';
      valid = false;
    } else if (passwords.newPassword.length < 6) {
      newErrors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự';
      valid = false;
    }
    
    if (!passwords.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
      valid = false;
    } else if (passwords.confirmPassword !== passwords.newPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Handle password change API call here
      console.log('Password change data:', passwords);
      
      // Reset form after successful submission
      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      alert('Đổi mật khẩu thành công!');
    }
  };

  return (
    <div className="admin-change-password">
      <h1>Đổi mật khẩu</h1>
      <div className="change-password-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="currentPassword">Mật khẩu hiện tại</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={handleChange}
              className={errors.currentPassword ? 'error' : ''}
            />
            {errors.currentPassword && <div className="error-message">{errors.currentPassword}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="newPassword">Mật khẩu mới</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handleChange}
              className={errors.newPassword ? 'error' : ''}
            />
            {errors.newPassword && <div className="error-message">{errors.newPassword}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'error' : ''}
            />
            {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
          </div>
          
          <button type="submit" className="btn-change-password">Đổi mật khẩu</button>
        </form>
      </div>
    </div>
  );
};

export default AdminChangePassword;
