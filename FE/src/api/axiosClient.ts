import axios,{AxiosRequestConfig}from 'axios';
import queryString from 'query-string';
import jwt_decode from 'jwt-decode';
import { Auth } from 'models/Auth';
import { authStore } from 'store/authStore';
const baseURL='http://localhost:8080/api'
//const baseURL = 'https://becnpmm.vercel.app/api'
export const axiosClient = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true,
    paramsSerializer: (params) => queryString.stringify(params)
});

const getRefreshToken = async (refreshToken: string) => {
    const res = await axiosClient.post<any>('/auth/refreshtoken', { refreshToken })
    return res.data
}

export const axiosClientWithToken = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true,
    paramsSerializer: (params) => queryString.stringify(params)
});
type Nullable<T> = T | undefined | null;
// const loginSuccess = authStore(state => state.loginSuccess)
// const logoutSuccess = authStore(state => state.logoutSuccess)
var myInterceptor: any = null;
export const clearInterceptor = () => {
    axiosClientWithToken.interceptors.request.eject(myInterceptor)
}
export const axiosInstance = ({ accessToken, refreshToken }: Auth,
    stateSuccess: (auth: Auth) => void,
    stateFail: () => void) => {
    axiosClientWithToken.interceptors.request.eject(myInterceptor)
    myInterceptor = axiosClientWithToken.interceptors.request.use(
        async (config:AxiosRequestConfig) => {
            let date = new Date();
            if (!(refreshToken)) {
                return config;
            }
            const decodeToken:any = jwt_decode(accessToken);

            if (decodeToken.exp < date.getTime() / 1000) {
                try {
                    const response = await getRefreshToken(refreshToken);

                    const newToken = {
                        accessToken: response.accessToken,
                        refreshToken: response.refreshToken
                    }
                    stateSuccess(newToken)
                    
                    config.headers!.Authorization = `Bearer ${response.accessToken}`;
                }
                catch (err) {
                    stateFail()
                }
            } else {
                config.headers!.Authorization = `Bearer ${accessToken}`;
            }
            return config;
        },
        err => {
            return Promise.reject(err)
        }
    );
}
