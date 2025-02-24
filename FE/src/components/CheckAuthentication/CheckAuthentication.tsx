import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import jwt_decode from 'jwt-decode'
import { useState } from 'react'
import LoadingData from 'components/LoadingData/LoadingData'

import { userStore } from 'store/userStore'
import { authStore } from 'store/authStore'
import { getUserInfo } from 'api/apiAuth'

const privatePath = [
    '/user/', '/payment'
]

function CheckAuthentication(props:any) {
    const user = userStore(state => state.user)
    const refreshToken = authStore(state => state.auth?.refreshToken)
    const logoutSuccess = authStore(state => state.logoutSuccess)
    const setUserInfo = userStore(state => state.setUserInfo)
    const clearUserInfo = userStore(state => state.clearUserInfo)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const check = () => {
            const isPrivate:boolean = privatePath.findIndex(e => location.pathname.includes(e)) >= 0 ? true : false
            if(isPrivate){
                setLoading(true)
            }
            if (refreshToken) {
                const tokenDecode:any = jwt_decode(refreshToken)
                let date = new Date();
                if (tokenDecode.exp < date.getTime() / 1000) {
                    toast.warning("Phiên làm việc của bạn đã hết. Vui lòng đăng nhập lại")
                    logoutSuccess()
                    if (isPrivate)
                        navigate('/')
                }
                if (!user) {
                    getUserInfo()
                        .then((res:any) => {
                            setUserInfo(res.data.userInfo)
                        })
                        .finally(()=>setLoading(false))
                    // dispatch(logoutSuccess())
                    // 
                    // if (isPrivate)
                    //     navigate('/')
                }
                else{
                    setLoading(false)
                }
            }
            else {
                setLoading(false)
                clearUserInfo()
                if (isPrivate) {
                    //toast.warning("Bạn không có quyền truy cập. Vui lòng đăng nhập lại")
                    navigate('/')
                }
            }
        }
        check()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshToken])
    return (
        <>
        {
            loading?<>
            <div className='d-flex' style={{
                height:'100vh',
                justifyContent:'center',
                alignItems:'center',
                flexDirection:'column'
            }}>

             <LoadingData />
            <p style={{fontSize:'18px'}}>Đang lấy thông tin người dùng. Vui lòng đợi</p>
            </div>
            </>
            :props.children
        }
        </>
    )
}

export default CheckAuthentication