import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { FaCaretDown } from "react-icons/fa6"
import { HiSwitchHorizontal } from "react-icons/hi";
import { FaHome } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { signOut } from "next-auth/react";
import { AiFillSetting } from "react-icons/ai";

export function UserInfoMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex flex-row justify-center items-center gap-2 text-white cursor-pointer">
          <p>Hola Alejandro</p>
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" alt="username" />
          </Avatar>
          <FaCaretDown size={20} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52 bg-white text-black">
        <DropdownMenuGroup className="flex flex-col">
          <DropdownMenuItem
            disabled = {true}
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
          <DropdownMenuItem
            onClick={() => window.location.href = '/admin'}
            className="flex flex-row items-center gap-2 text-base cursor-pointer">
            <AiFillSetting size={25} />
            Administración
          </DropdownMenuItem>
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
