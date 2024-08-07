'use client'
import { useTheme } from 'next-themes'
import React from 'react'

export default function AdminNav() {
    const theme = useTheme()

    return (
        <nav className={`flex flex-row justify-between items-center w-full h-full ${theme.theme === 'dark' ? 'bg-[#030F2E]' : 'bg-[#0078d4]'} h-[48px]`}>
            <h1>djawo</h1>
        </nav>
    )
}
