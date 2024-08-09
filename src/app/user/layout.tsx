import UserAside from "@/components/user/user-aside"
import { usePathname } from "next/navigation"

export default function AuthLayout({
    children
}: {
    children: React.ReactNode
}) {

    // const path = usePathname()

    return (
        <div className="w-full h-full bg-default-background bg-no-repeat bg-cover">
            <div className="flex flex-row h-full w-full">
                <aside className="h-full max-w-[270px] overflow-hidden">
                    <UserAside />
                </aside>
                <main className="w-full h-full overflow-hidden">
                    {children}
                </main>
            </div>
        </div>
    )
}
