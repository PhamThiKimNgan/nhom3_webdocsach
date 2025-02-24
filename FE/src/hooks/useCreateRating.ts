import { createComment } from "api/apiComment"
import { createRating } from "api/apiStory"
import { useMutation } from "react-query"
import { toast } from "react-toastify"
import { userStore } from "store/userStore"

export default function useCreateRating(refetch: Function, setContent: Function, setRating: Function) {
    const user = userStore(state => state.user)

    const { mutate} = useMutation((variables) => createRating(variables), {
        onSuccess: async (data: any, context: any) => {
            setContent('')
            setRating(0)
            refetch()
        },
        onError: async (data: any, context: any) => {

            toast.warning('Đánh giá không thành công');
        }
    })
    const handleCreateRating = (params: any) => { //xử lý đăng bình luận mới
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



    return { handleCreateRating }

}
