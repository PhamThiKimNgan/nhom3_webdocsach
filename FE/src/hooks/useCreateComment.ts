import { login } from "api/apiAuth"
import { createComment } from "api/apiComment"
import { useState } from "react"
import { useMutation } from "react-query"
import { toast } from "react-toastify"
import { authStore } from "store/authStore"
import { modalStore } from "store/modalStore"
import { userStore } from "store/userStore"

export default function useCreateComment(refetch: Function, setContent: Function) {
    const user = userStore(state => state.user)

    const { mutate, data, isLoading, isSuccess } = useMutation((variables) => createComment(variables), {
        onSuccess: async (data: any, context: any) => {
            setContent('')
            refetch()
        },
        onError: async (data: any, context: any) => {

            toast.warning('Bình luận không thành công');
        }
    })
    const handleCreateComment = (params: any) => { //xử lý đăng bình luận mới
        if (user) {
            
            mutate(params)
        }
        else {
            toast.warning("Vui lòng đăng nhập trước khi bình luận", {
                hideProgressBar: true,
                pauseOnHover: false,
                autoClose: 1200
            })
        }
    }



    return { handleCreateComment }

}
