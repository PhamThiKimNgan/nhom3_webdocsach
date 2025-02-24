import { login } from "api/apiAuth"
import { useState } from "react"
import { useMutation } from "react-query"
import { toast } from "react-toastify"
import { authStore } from "store/authStore"
import { modalStore } from "store/modalStore"
import { userStore } from "store/userStore"

export default function useLogin() {
    const setUserInfo = userStore(state => state.setUserInfo)
    const loginSuccess = authStore(state => state.loginSuccess)
    const authInactive = modalStore(state => state.authInactive)

    const { mutate, data, isLoading } = useMutation((variables) => login(variables), {
        onSuccess: async (data: any, context: any) => {
            const { refreshToken, accessToken, ...user } = data.data
            setUserInfo(user)
            loginSuccess({ accessToken, refreshToken })
            toast.success("Đăng nhập thành công", { autoClose: 1200, pauseOnHover: false, hideProgressBar: true });//hiển thị toast thông báo
            authInactive() //hành động tắt modal login
        },
        onError: async (data: any, context: any) => {
            let msg = data.response.data.details
            let _ = msg.username || msg.password || msg.active || msg.toString()
            toast.warning(_);
        }
    })

    return {mutate,isLoading}

}
