import { AxiosError } from "axios"

export type ChangePasswordParams = {//payload
    newPassword: string,
    password: string
}

export type DetailsError = {
    message:string,
    [x:string]:any
}
export type ErrorQuery<T = {details:DetailsError}> = AxiosError<{details:DetailsError}>