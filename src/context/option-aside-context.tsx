'use client'
import { createContext, ReactNode, useState } from "react";

interface OptionAsideStructure {
    option: any
    setOption: (option: any) => void
}

const authContextDefaultValues: OptionAsideStructure = {
    option: null,
    setOption: () => { },
}

export const OptionAsideContext = createContext<OptionAsideStructure>(authContextDefaultValues);

export function OptionAsideProvider({
    children
}: {
    children: React.ReactNode
}) {
    const [option, setOption] = useState<any>(null);
    const [objectSelected, setObjectSelected] = useState<any>(null);


    return (
        <>
            <OptionAsideContext.Provider value={{
                option,
                setOption
            }}>
                {children}
            </OptionAsideContext.Provider>
        </>
    );
}