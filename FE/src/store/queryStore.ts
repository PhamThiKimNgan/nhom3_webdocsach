import create from "zustand";
interface queryState {
    query:string;

    setQuery: (query:string) => void;
}

export const queryStore = create<queryState>()(
    
        (set) => ({
            // initial state
            query:'',
            // methods for manipulating state
            setQuery: (query) => {
                set((state) => ({
                    query
                }));
            },
        }),
    );