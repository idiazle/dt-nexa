"use client"
import AdminAside from "@/components/admin/admin-aside"
import AdminNav from "@/components/admin/admin-nav"
import UserAside from "@/components/user/user-aside"
import { useTheme } from "next-themes"

export default function AuthLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col w-full h-full overflow-hidden bg-gray-50">
            <AdminNav/>
            <div className="flex flex-row overflow-hidden h-full w-full">
                <aside className="h-full max-w-[250px] w-[250px] shadow-xl bg-gray-200 overflow-auto">
                    <AdminAside />
                </aside>
                <main className="w-full h-full overflow-auto p-5">
                    {children}
                </main>
            </div>
        </div>
    )
}
