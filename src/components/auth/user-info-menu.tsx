import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { FaCaretDown, FaUser } from "react-icons/fa6"
import { HiSwitchHorizontal } from "react-icons/hi";
import { FaHome, FaUserCircle } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { signOut, useSession } from "next-auth/react";
import { AiFillSetting } from "react-icons/ai";

export function UserInfoMenu() {
  const { data: session } = useSession()
  const admin = session?.user?.groups.find((obj: any) => obj === 1 || obj === 3)
  const name = session?.user?.short_name || ""
  console.log("Session", session)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex flex-row justify-center items-center gap-2 text-white cursor-pointer">
          <p>Hola {name}</p>
            <div className="flex justify-center items-center">
              <FaUserCircle size={30} className="text-white" />
            </div>
          
          <FaCaretDown size={20} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52 bg-white text-black">
        <DropdownMenuGroup className="flex flex-col">
          <DropdownMenuItem
            disabled={true}
            className="flex flex-row items-center gap-2 text-base cursor-pointer">
            <HiSwitchHorizontal size={25} />
            Cambiar tema
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => window.location.href = '/menu'}
            className="flex flex-row items-center gap-2 text-base cursor-pointer">
            <FaHome size={25} />
            Menú Principal
          </DropdownMenuItem>
          {
            admin !== undefined
              ? <DropdownMenuItem
                onClick={() => window.location.href = '/admin'}
                className="flex flex-row items-center gap-2 text-base cursor-pointer">
                <AiFillSetting size={25} />
                Administración
              </DropdownMenuItem>
              : null

          }
          <DropdownMenuItem
            onClick={async () => { await signOut() }}
            className="flex flex-row items-center gap-2 text-base cursor-pointer">
            <MdLogout size={25} />
            Cerrar Sesión
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
