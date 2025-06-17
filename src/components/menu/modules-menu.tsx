import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { EntityStructure, MenuIconsStructure } from "@/lib/utils"
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ModulesMenu({ data, selectedPlant }: { data: MenuIconsStructure[], selectedPlant: EntityStructure | undefined }) {
  const executeMethod = (menuOptions: MenuIconsStructure) => {

    switch (menuOptions.id) {
      case 10:
        return (
          <MenubarItem disabled={selectedPlant === undefined}>
            <Link href={{
              pathname: '/user/map2d',
              query: { plant: selectedPlant !== undefined ? selectedPlant.id : '', map_type: '4' }
            }
            } className="border-b border-white w-full p-1">
              {menuOptions.icon_name}
            </Link>
          </MenubarItem>
        )
      default:
        return (
          <MenubarItem>
            <div className="border-b border-white w-full p-1">
              {menuOptions.icon_name}
            </div>
          </MenubarItem>

        )
    }
  }

  const router = useRouter()

  return (
    <Menubar className="flex flex-row flex-wrap-reverse bg-transparent border-none gap-5">
      {
        data.map((module, index) => {
          return (
            <MenubarMenu key={module.id}>
              <div className="flex flex-col items-center max-w-32 min-h-[150px] gap-2">
                <MenubarTrigger onClick={() => {
                  if (module.id === 1) {
                    router.push('/interactives/dtwin')
                  }
                }}
                  className={`flex flex-col items-center gap-2 p-0 rounded-2xl focus:bg-white/35 data-[state=open]:bg-white/60 opacity-20 ${module.id === 1 ? 'cursor-pointer opacity-100 hover:bg-gray-400 bg-gray-600' : ''}`}>
                  {/* Imagen centrada */}
                  <div className="border border-white/50 p-4 rounded-2xl">
                    <div className="relative h-[90px] w-[90px] overflow-hidden">
                      <Image
                        src={module.icon_image}
                        alt={module.icon_name}
                        fill
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                  </div>

                  {/* Texto con altura fija para alineación consistente */}
                </MenubarTrigger>
                <p className="text-center leading-tight h-[32px]  font-bold">
                  {module.icon_name}
                </p>
              </div>
              {
                module.children === null ? null :
                  <MenubarContent side="top" className="bg-[#385b6d]">
                    {
                      module.children.reverse().map((child, index) => {
                        return (
                          executeMethod(child)
                          // <MenubarItem key={child.id}>
                          //     <div className="border-b border-white w-full p-1">
                          //         {child.icon_name}
                          //     </div>
                          // </MenubarItem>
                        )
                      })
                    }
                  </MenubarContent>
              }
            </MenubarMenu>
          )
        })
      }
    </Menubar>
  )
}
