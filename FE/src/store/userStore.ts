import create from "zustand";

import { User } from "models/User";
import { persist } from 'zustand/middleware'
interface UserState {
    user: User | null;
    setUserInfo: (user: User) => void;
    clearUserInfo: () => void;
    updateBalance: (balance: number) => void;
}

export const userStore = create<UserState>()(
    
        (set) => ({
            // initial state
            user: null,
            // methods for manipulating state
            setUserInfo: (user: User) => {
                console.log(user)
                set((state) => ({
                    user
                }));
            },
            clearUserInfo: () => {
                set((state) => ({
                    user: null,
                }));
            },
            updateBalance: (balance: number) => {
                set((state) => ({
                    user: {
                        ...state.user ? state.user :
                            {
                                id: '',
                                username: '',
                                image: '',
                                balance: 0,
                                birthdate: '',
                                roles: [],
                                nickname: ''
                            },
                        balance
                    }
                }));
            }
        }),
        // {
        //     name: 'user',
        //     getStorage: () => localStorage,
        // }
    );