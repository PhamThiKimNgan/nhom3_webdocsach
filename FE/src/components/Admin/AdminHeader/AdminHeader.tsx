import { MouseEvent, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from 'assets/img/logo.png';
import { userStore } from 'store/userStore';
import { authStore } from 'store/authStore';
import { numWithCommas } from 'utils/convertNumber';
import './AdminHeader.scss';

const adminMenu = [
  {
    path: '/admin/dashboard',
    display: 'Dashboard',
    icon: 'bx bxs-dashboard'
  },
  {
    path: '/admin/users',
    display: 'Người dùng',
    icon: 'bx bx-group'
  },
  {
    path: '/admin/stories',
    display: 'Quản lý truyện',
    icon: 'bx bx-book'
  },
  {
    path: '/admin/payment',
    display: 'Giao dịch',
    icon: 'bx bx-money'
  },
  {
    path: '/admin/setting',
    display: 'Cài đặt',
    icon: 'bx bx-cog'
  }
];

export default function AdminHeader() {
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const user = userStore(state => state.user);
  const clearUserInfo = userStore(state => state.clearUserInfo);
  const logoutSuccess = authStore(state => state.logoutSuccess);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();

  const handleDropdownProfile = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (profileDropdownRef?.current)
      profileDropdownRef?.current.classList.toggle('active');
  };

  const hideProfileDropdown = () => {
    if (profileDropdownRef?.current)
      profileDropdownRef?.current.classList.remove('active');
  };

  const onClickLogout = () => {
    clearUserInfo();
    logoutSuccess();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  return (
    <div className="admin-header">
      <div className="admin-header__container">
        <div className="admin-header__logo">
          <Link to="/">
            <img src={logo} alt="Logo" />
            <span>Admin Panel</span>
          </Link>
          <button className="mobile-toggle" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? (
              <i className='bx bx-x'></i>
            ) : (
              <i className='bx bx-menu'></i>
            )}
          </button>
        </div>

        <div className={`admin-header__nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <ul className="admin-header__menu">
            {adminMenu.map((item, index) => (
              <li key={index} className="admin-header__menu-item">
                <Link to={item.path}>
                  <i className={item.icon}></i>
                  <span>{item.display}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="admin-header__profile">
            <div className="admin-header__profile-trigger" onClick={handleDropdownProfile}>
              {user?.image ? (
                <div className="admin-header__avatar">
                  <img src={user.image} alt="Avatar" />
                </div>
              ) : (
                <div className="admin-header__avatar-placeholder">
                  <i className='bx bx-user'></i>
                </div>
              )}
              <span>{user?.nickname || user?.name || user?.username}</span>
              <i className='bx bx-chevron-down'></i>
            </div>

            <div 
              ref={profileDropdownRef} 
              className="admin-header__dropdown" 
              tabIndex={1} 
              onBlur={hideProfileDropdown}
            >
              <ul>
                <li className="admin-header__dropdown-balance">
                  <Link to="/payment">
                    Số dư: {numWithCommas(user?.balance || 0)}
                    <i className='bx bxs-coin-stack'></i>
                  </Link>
                </li>
                <li>
                  <Link to="/admin/profile">
                    <i className='bx bx-user'></i>
                    Hồ sơ
                  </Link>
                </li>
                <li>
                  <Link to="/admin/change-password">
                    <i className='bx bxs-key'></i>
                    Đổi mật khẩu
                  </Link>
                </li>
                <li>
                  <span onClick={onClickLogout}>
                    <i className='bx bx-log-out'></i>
                    Đăng xuất
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
