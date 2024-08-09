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
        <div className="flex flex-col w-full h-full overflow-hidden">
            <AdminNav/>
            <div className="flex flex-row overflow-hidden h-full w-full">
                <aside className="h-full max-w-[47px] w-[47px] shadow-lg">
                    <AdminAside />
                </aside>
                <main className="w-full h-full overflow-auto p-5">
                    {children}
                </main>
            </div>
        </div>
    )
}
