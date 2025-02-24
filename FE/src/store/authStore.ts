import create from "zustand";

import { Auth } from "models/Auth";
import { persist, createJSONStorage } from 'zustand/middleware'
interface AuthState {
    auth: Auth | null;
    loginSuccess: (auth: Auth) => void;
    logoutSuccess: () => void;
}

export const authStore = create<AuthState>()(
    persist(
        (set) => ({
            // initial state
            auth: {
                refreshToken: '',
                accessToken:''
            },
            // methods for manipulating state
            loginSuccess: (auth: Auth) => {
                set((state) => ({ auth }));
            },
            logoutSuccess: () => {
                set((state) => ({
                    auth: {
                        refreshToken: '',
                        accessToken:''
                    },
                }));
            },
        }),
        {
            name:'auth',
            getStorage: () => localStorage,
        }
    ));