import { ChangePassword } from "api/apiAuth";
import { AxiosError } from "axios";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { ChangePasswordParams, ErrorQuery } from "types/params";

export default function useChangePassword() {
    const { isLoading, mutate } = useMutation((params:ChangePasswordParams) => ChangePassword(params),
        {
            onSuccess() {
                toast.success("Đổi mật khẩu thành công")
            },
            onError(error: ErrorQuery) {
                let details = error?.response?.data?.details
                let msg = details?.password || details?.message || details?.[0] || "Lỗi đổi mật khẩu"
                toast.error(msg)
            }
        })

    return { isLoading, mutate }
}