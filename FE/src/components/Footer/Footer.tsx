import React from 'react'
import avt from '../../assets/img/logo.png'
import { Link, useLocation } from 'react-router-dom'
import { userStore } from 'store/userStore';
import AdminFooter from '../Admin/AdminFooter/AdminFooter'

const menu =[
    {
        display:"Điều khoản dịch vụ",
        path:"dieu-khoan"
    },
    {
        display:"Chính sách bảo mật",
        path:"chinh-sach"
    },
    {
        display:"Về bản quyền",
        path:"ban-quyen"
    },
    {
        display:"Hướng dẫn sử dụng",
        path:"su-dung"
    }
]
function Footer() {
  const user = userStore(state => state.user);
  const isAdmin = user?.roles?.some(role => role.name === 'ADMIN');
  const isInAdminSection = useLocation().pathname.startsWith('/admin');

  // If user is admin and is in admin section, render AdminFooter
  if (isAdmin && isInAdminSection) {
    return <AdminFooter />;
  }

  // Otherwise render regular footer
  return (
    <div className="container" style={{marginTop:"3rem"}}>
        <section>
        <div className="d-flex" style={{justifyContent:"center",flexDirection:"column",alignItems:"center",gap:"1.5rem"}}>
            <div className="footer-logo">
                <img src={avt} alt="" style={{height:64}}/>
            </div>
            <div className="footer-content w-75" style={{textAlign:"center"}}>
            Team 3 Story là nền tảng mở trực tuyến, miễn phí đọc truyện chữ được convert hoặc dịch kỹ lưỡng,
             do các converter và dịch giả đóng góp, rất nhiều truyện hay và nổi bật được cập nhật nhanh nhất
              với đủ các thể loại tiên hiệp, kiếm hiệp, huyền ảo ...
            </div>
            <ul className="row" style={{justifyContent:"center"}}>
                {
                    menu.map((item,i)=><li key={item.path} className='col-sm-6' style={{padding:"0.5rem 1rem",textAlign:"center"}}>
                    <Link to={item.path}>
                        {item.display}
                    </Link>
                </li>)
                }
            </ul>
        </div>
        </section>
    </div>
  )
}

export default Footer