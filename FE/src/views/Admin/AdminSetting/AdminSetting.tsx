import React, { useState } from 'react';
import './AdminSetting.scss';
import { toast } from 'react-toastify';

interface SettingOption {
  id: string;
  label: string;
  description: string;
  type: 'toggle' | 'select' | 'input';
  value: string | boolean | number;
  options?: { value: string; label: string }[];
}

const AdminSetting: React.FC = () => {
  // Default settings structure
  const [settings, setSettings] = useState<{[key: string]: SettingOption[]}>({
    notifications: [
      {
        id: 'email_notifications',
        label: 'Thông báo qua email',
        description: 'Gửi email khi có cập nhật mới',
        type: 'toggle',
        value: true,
      },
      {
        id: 'push_notifications',
        label: 'Thông báo đẩy',
        description: 'Hiển thị thông báo trên trình duyệt khi có cập nhật mới',
        type: 'toggle',
        value: false,
      },
      {
        id: 'notification_frequency',
        label: 'Tần suất thông báo',
        description: 'Chọn tần suất nhận thông báo',
        type: 'select',
        value: 'daily',
        options: [
          { value: 'realtime', label: 'Thời gian thực' },
          { value: 'daily', label: 'Mỗi ngày' },
          { value: 'weekly', label: 'Mỗi tuần' },
        ],
      },
    ],
    system: [
      {
        id: 'language',
        label: 'Ngôn ngữ',
        description: 'Chọn ngôn ngữ hiển thị cho hệ thống',
        type: 'select',
        value: 'vi',
        options: [
          { value: 'vi', label: 'Tiếng Việt' },
          { value: 'en', label: 'Tiếng Anh' },
        ],
      },
      {
        id: 'items_per_page',
        label: 'Số mục trên mỗi trang',
        description: 'Số lượng mục hiển thị tối đa trên mỗi trang',
        type: 'input',
        value: 10,
      },
      {
        id: 'dark_mode',
        label: 'Chế độ tối',
        description: 'Bật chế độ tối cho giao diện',
        type: 'toggle',
        value: false,
      },
    ],
    security: [
      {
        id: 'two_factor_auth',
        label: 'Xác thực hai yếu tố',
        description: 'Yêu cầu xác thực bổ sung khi đăng nhập',
        type: 'toggle',
        value: false,
      },
      {
        id: 'session_timeout',
        label: 'Thời gian phiên',
        description: 'Thời gian trước khi phiên đăng nhập hết hạn (phút)',
        type: 'input',
        value: 30,
      },
      {
        id: 'login_attempts',
        label: 'Số lần đăng nhập tối đa',
        description: 'Số lần đăng nhập thất bại tối đa trước khi khóa tài khoản',
        type: 'input',
        value: 5,
      },
    ],
    content: [
      {
        id: 'auto_approve_stories',
        label: 'Tự động duyệt truyện',
        description: 'Tự động duyệt truyện mới khi người dùng gửi lên',
        type: 'toggle',
        value: false,
      },
      {
        id: 'content_filter_level',
        label: 'Mức lọc nội dung',
        description: 'Mức độ kiểm duyệt nội dung truyện',
        type: 'select',
        value: 'moderate',
        options: [
          { value: 'strict', label: 'Nghiêm ngặt' },
          { value: 'moderate', label: 'Vừa phải' },
          { value: 'relaxed', label: 'Thoải mái' },
        ],
      },
    ],
  });

  const [loading, setLoading] = useState(false);
  
  const handleToggleChange = (categoryKey: string, settingId: string) => {
    setSettings(prevSettings => {
      const newSettings = { ...prevSettings };
      const settingIndex = newSettings[categoryKey].findIndex(setting => setting.id === settingId);
      
      if (settingIndex !== -1) {
        newSettings[categoryKey][settingIndex] = {
          ...newSettings[categoryKey][settingIndex],
          value: !newSettings[categoryKey][settingIndex].value as boolean
        };
      }
      
      return newSettings;
    });
  };
  
  const handleSelectChange = (categoryKey: string, settingId: string, value: string) => {
    setSettings(prevSettings => {
      const newSettings = { ...prevSettings };
      const settingIndex = newSettings[categoryKey].findIndex(setting => setting.id === settingId);
      
      if (settingIndex !== -1) {
        newSettings[categoryKey][settingIndex] = {
          ...newSettings[categoryKey][settingIndex],
          value
        };
      }
      
      return newSettings;
    });
  };
  
  const handleInputChange = (categoryKey: string, settingId: string, value: string) => {
    setSettings(prevSettings => {
      const newSettings = { ...prevSettings };
      const settingIndex = newSettings[categoryKey].findIndex(setting => setting.id === settingId);
      
      if (settingIndex !== -1) {
        const setting = newSettings[categoryKey][settingIndex];
        let parsedValue: string | number = value;
        
        // Convert to number if the original value was a number
        if (typeof setting.value === 'number') {
          parsedValue = value === '' ? 0 : Number(value);
        }
        
        newSettings[categoryKey][settingIndex] = {
          ...setting,
          value: parsedValue
        };
      }
      
      return newSettings;
    });
  };
  
  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Here you would normally make an API call to save the settings
      // For demonstration, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Cài đặt đã được lưu thành công!');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu cài đặt.');
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const renderSettingInput = (category: string, setting: SettingOption) => {
    switch (setting.type) {
      case 'toggle':
        return (
          <div className="toggle-switch">
            <input
              type="checkbox"
              id={setting.id}
              checked={setting.value as boolean}
              onChange={() => handleToggleChange(category, setting.id)}
            />
            <label htmlFor={setting.id}></label>
          </div>
        );
      case 'select':
        return (
          <select
            value={setting.value as string}
            onChange={(e) => handleSelectChange(category, setting.id, e.target.value)}
            className="form-control"
          >
            {setting.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'input':
        return (
          <input
            type="number"
            value={String(setting.value)}
            onChange={(e) => handleInputChange(category, setting.id, e.target.value)}
            className="form-control"
            min="0"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="admin-setting-container">
      <div className="setting-header">
        <h1>Cài đặt hệ thống</h1>
        <p>Quản lý và tùy chỉnh các cài đặt của hệ thống</p>
      </div>
      
      {Object.keys(settings).map(category => (
        <div key={category} className="setting-section">
          <h2>{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
          
          <div className="setting-list">
            {settings[category].map(setting => (
              <div key={setting.id} className="setting-item">
                <div className="setting-info">
                  <h3>{setting.label}</h3>
                  <p>{setting.description}</p>
                </div>
                <div className="setting-control">
                  {renderSettingInput(category, setting)}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      <div className="setting-actions">
        <button 
          className="btn-save" 
          onClick={handleSaveSettings} 
          disabled={loading}
        >
          {loading ? 'Đang lưu...' : 'Lưu cài đặt'}
        </button>
      </div>
    </div>
  );
};

export default AdminSetting;