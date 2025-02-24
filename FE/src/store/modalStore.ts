import create from "zustand";

import { Auth } from "models/Auth";
import { persist, createJSONStorage } from 'zustand/middleware'
interface modalState {
    modal: {
        active: boolean;
        login: boolean;
    };

    authLoginActive: () => void;
    authRegisterActive: () => void;
    authInactive: () => void;
}

export const modalStore = create<modalState>()(
    
        (set) => ({
            // initial state
            modal: {
                active: false,
                login: false
            },
            // methods for manipulating state
            authLoginActive: () => {
                set((state) => ({
                    modal: {
                        active: true,
                        login: true,
                    }
                }));
            },
            authRegisterActive: () => {
                set((state) => ({
                    modal: {
                        active: true,
                        login: false,
                    }
                }));
            },
            authInactive: () => {
                set((state) => ({
                    modal: {
                        ...state.modal,
                        active: false,
                    }
                }));
            },

        }),
        
    );