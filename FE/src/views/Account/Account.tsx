import React from 'react'

import { Route, Routes } from 'react-router-dom';
import ChangePassword from './ChangePassword'
import Profile from './Profile';
import TuTruyen from './TuTruyen/TuTruyen';
import CreateNovel from './CreateNovel';
import './Account.scss'
import './Profile.scss'
import Panel from './Panel'
import ListBill from './ListBill';
const menu = [//menu dựa trên từng loại tài khoản
    {
      path: "user/profile",
      display: "Hồ sơ",
      icon: "bx bx-user"
    },
    {
      path: "user/change-password",
      display: "Đổi mật khẩu",
      icon: "bx bxs-key"
    },
    {
      path: "user/tu-truyen/reading",
      display: "Tủ truyện",
      icon: "bx bx-library"
    },
    {
      path: "user/dang-truyen",
      display: "Đăng truyện",
      icon: "bx bx-up-arrow-circle"
    },
    {
      path: "user/thanh-toan",
      display: "Thanh toán",
      icon: "bx bx-up-arrow-circle"
    },
  ]
function Account() {
  
  return (
    <Panel menu={menu}>
      <Routes>
        <Route path='profile' element={<Profile/>}></Route>
        <Route path='change-password' element={<ChangePassword />}></Route>
        <Route path='tu-truyen/*' element={<TuTruyen />}></Route>
        <Route path='dang-truyen' element={<CreateNovel />}></Route>
        <Route path='thanh-toan' element={<ListBill />}></Route>
      </Routes>
    </Panel>

  )
}


export default Account