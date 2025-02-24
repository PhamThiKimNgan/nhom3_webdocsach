import { MouseEvent, useCallback, useEffect, useState } from 'react'
import { useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from 'assets/img/logo.png';
import Auth from '../Auth/Auth';
import Modal, { ModalContent } from '../Modal/Modal';
import './Header.scss'
import { numWithCommas } from 'utils/convertNumber';
import { userStore } from 'store/userStore';
import { modalStore } from 'store/modalStore';
import { ClickEvent, ClickEventHandler } from 'types/react';
import { authStore } from 'store/authStore';
import { queryStore } from 'store/queryStore';

const menu = {//menu hiển thị cho từng loại tài khoản admin và user thường
    ADMIN: [
        {
            path: 'admin/profile',
            display: 'Hồ sơ',
            icon: 'bx bx-user'
        },
        {
            path: 'admin/change-password',
            display: 'Đổi mật khẩu',
            icon: 'bx bxs-key'
        },
        {
            path: 'admin/users',
            display: 'Người dùng',
            icon: 'bx bx-group'
        },
        {
            path: 'admin/tu-truyen/reading',
            display: 'Tủ truyện',
            icon: 'bx bx-library'
        },
        {
            path: 'admin/setting',
            display: 'Cài đặt',
            icon: 'bx bx-cog'
        }
    ]

    ,
    USER: [
        {
            path: 'user/profile',
            display: 'Hồ sơ',
            icon: 'bx bx-user'
        },
        {
            path: 'user/change-password',
            display: 'Đổi mật khẩu',
            icon: 'bx bxs-key'
        },
        {
            path: 'user/tu-truyen/reading',
            display: 'Tủ truyện',
            icon: 'bx bx-library'
        },
        {
            path: 'user/setting',
            display: 'Cài đặt',
            icon: 'bx bx-cog'
        }
    ]

}

export default function Header() {
    const headerRef = useRef(null)
    const expandRef = useRef(null)
    const profileDropdownRef = useRef<HTMLLIElement>(null)
    const user = userStore(state => state.user)
    const modalAuth = modalStore(state => state.modal.active)
    const modalLogin = modalStore(state => state.modal.login);
    const authLoginActive = modalStore(state => state.authLoginActive);
    const authRegisterActive = modalStore(state => state.authRegisterActive);
    const authInactive = modalStore(state => state.authInactive);
    const clearUserInfo = userStore(state => state.clearUserInfo);
    const logoutSuccess = authStore(state => state.logoutSuccess);
    const setQuery = queryStore(state => state.setQuery);

    const [search, setSearch] = useState<string>('')
    const [expand, setExpand] = useState<boolean>(false)

    const navigate = useNavigate()

    useEffect(() => {//xử lý dropdown của account
        const hideDropdown = () => {
            profileDropdownRef?.current?.classList.remove("active")
        }
        const collapseMenu = () => {
            setExpand(false)
        }
        document.addEventListener("click", hideDropdown)
        document.addEventListener("click", collapseMenu)
        return () => {
            document.removeEventListener("click", hideDropdown)
            document.removeEventListener("click", collapseMenu)
        }
    }, [])

    const handleExpand: ClickEventHandler = (event) => {
        //expandRef.current.classList.toggle('active')
        event.stopPropagation()
        setExpand(pre => !pre)
    }

    const handleDropdownProfile = (e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (profileDropdownRef?.current)
            profileDropdownRef?.current.classList.toggle('active')
    }

    const hideProfileDropdown = () => {
        if (profileDropdownRef?.current)
            profileDropdownRef?.current.classList.remove('active')
    }

    const closeModalAuth = useCallback(() => {
        authInactive();
    }, []);

    const handleAuthLogin = () => {
        authLoginActive();
    }

    const handleAuthRegister = () => {
        authRegisterActive();
    }

    const onClickLogout = () => {
        clearUserInfo()
        logoutSuccess()
    }

    const onClickSearch = () => {//xử lý tìm kiếm 
        setQuery(search)
        if (navigate.pathname !== '/tim-kiem') {
            navigate('/tim-kiem')
        }
    }
    return (
        <>
            <nav ref={headerRef} className="header">
                <div className="header__wrap">
                    <div className='collapse'>
                        <button onClick={handleExpand} className='navbar__collapse'>
                            {expand ? <i className='bx bx-x fs-40'></i> :
                                <i className='bx bx-list-ul fs-40'></i>}</button>
                    </div>
                    <div className={`navbar-expand ${expand ? 'active' : ''}`} ref={expandRef}>
                        <ul className='navbar-expand__wrap'>
                            {
                                user ?
                                    <li className='text-bold navbar-expand__item'>
                                        <div className="navbar__profile__name">
                                            {user.image ?
                                                <div className='navbar__avatar'><img src={user.image} alt="" /></div>
                                                : <i style={{ marginRight: 4 + 'px' }} className="fa-solid fa-user"></i>
                                            }
                                            <span>{user.tenhienthi || user.name || user.username}</span>
                                        </div>
                                    </li> :
                                    <>
                                        <li className='navbar-expand__item'>
                                            <span onClick={handleAuthLogin}>
                                                <i className='bx bx-user-circle'></i>
                                                Đăng nhập
                                            </span>
                                        </li>
                                        <li className='navbar-expand__item'>
                                            <span onClick={handleAuthRegister}>
                                                <i className='bx bx-id-card'></i>
                                                Đăng ký
                                            </span>
                                        </li>
                                    </>
                            }
                            <li className='text-bold navbar-expand__item'>
                                <Link to='/'>
                                    <i className='bx bx-category'></i>
                                    Thể loại
                                </Link>
                            </li>
                            <li className='text-bold navbar-expand__item'>
                                <Link to='/truyen'>
                                    <i className='bx bxs-bar-chart-alt-2'></i>
                                    Bảng xếp hạng
                                </Link>
                            </li>
                            {
                                user ? <>
                                    {menu['USER'].map((item, i) =>
                                        <li className='text-bold navbar-expand__item' key={i}>
                                            <Link to={item.path}><i className={item.icon}></i>{item.display}</Link>
                                        </li>
                                    )}
                                    <li className='text-bold navbar-expand__item' ><span onClick={onClickLogout}><i className='bx bx-log-out'></i>Đăng xuất</span></li>
                                </>
                                    : <></>
                            }
                        </ul>
                    </div>

                    <div className="logo">
                        <Link className="" to='/'><img src={logo} alt="" /></Link>
                    </div>
                    <div className="navbar">
                        <ul className='navbar__list'>
                            <li className='text-bold'><Link to='/'>
                                Thể loại
                            </Link></li>
                            <li className='text-bold'> <Link to='/truyen'>
                                Bảng xếp hạng
                            </Link></li>
                        </ul>
                        <div className='navbar__list__search'>
                            <div className='form-group'>
                                <input placeholder='Tìm truyện' onChange={e => { setSearch(e.target.value) }} value={search}></input>
                                <button onClick={onClickSearch}><i className='bx bx-search-alt-2'></i></button>
                            </div>
                        </div>
                        <ul className='navbar__list navbar__list--right'>
                            <li><Link to={'/user/dang-truyen'}
                                className='text-with-icon'>
                                <i style={{ marginRight: '4px' }} className="bx bx-up-arrow-circle fs-28"></i> Đăng truyện
                            </Link></li>
                            <li><Link to={'/payment'}
                                className='text-with-icon'>
                                <i style={{ marginRight: '4px' }} className="bx bx-up-arrow-circle fs-28"></i> Nạp tiền
                            </Link></li>
                            {
                                user ? <li ref={profileDropdownRef} className='navbar__profile'>
                                    <div >
                                        <div onClick={handleDropdownProfile} className="navbar__profile__name">
                                            {user.image ?
                                                <div className='navbar__avatar'><img src={user.image} alt="" /></div>
                                                : <i style={{ marginRight: 4 + 'px' }} className="fa-solid fa-user"></i>
                                            }
                                            <span>{user.nickname || user.name || user.username}</span>
                                        </div>
                                        <div tabIndex={1} onBlur={hideProfileDropdown} className="navbar__profile__menu">
                                            <ul>
                                                <li><Link to={'/payment'}>Số dư: {numWithCommas(user?.balance || 0)}<i className='bx bxs-coin-stack'></i></Link></li>
                                                {
                                                    menu['USER'].map((item, i) => {
                                                        return <li key={i}><Link to={item.path}><i className={item.icon}></i>{item.display}</Link></li>
                                                    }
                                                    )
                                                }
                                                <li ><span onClick={onClickLogout}><i className='bx bx-log-out'></i>Đăng xuất</span></li>
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                                    :
                                    <>
                                        <li><span onClick={handleAuthLogin}>Đăng nhập</span></li>
                                        <li><span onClick={handleAuthRegister}>Đăng ký</span></li>
                                    </>
                            }
                        </ul>
                    </div>
                </div>
            </nav>

            {modalAuth && <Modal active={modalAuth}>
                <ModalContent onClose={closeModalAuth}>
                    <Auth choose={modalLogin} />
                </ModalContent>
            </Modal>}
        </>
    )
}
