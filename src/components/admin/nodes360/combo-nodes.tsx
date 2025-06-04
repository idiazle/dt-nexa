"use client"

import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export default function ComboNodes({ data,linkData, setLinkData }: { data: any[] | null, linkData: any, setLinkData: (value: any) => void }) {
    const [open, setOpen] = React.useState(false)

    console.log("MY DATAA", data)
    console.log("MY DATAA2a2", linkData)
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="justify-between w-full"
                >
                    {linkData.nodeId
                        ? data?.find((framework) => String(framework.id) === linkData.nodeId)?.name
                        : "Seleccione el nodo..."}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="CustomPopoverContent">
                <Command>
                    <CommandInput placeholder="Buscar nodo..." />
                    <CommandList>
                        <CommandEmpty>Nodo no encontrado.</CommandEmpty>
                        <CommandGroup>
                            {data?.map((framework) => (
                                <CommandItem
                                    key={framework.id}
                                    value={String(framework.id)}
                                    keywords={[framework.name]}
                                    onSelect={(currentValue) => {
                                        // setValue(currentValue === value ? "" : currentValue)
                                        setLinkData((prev:any)=>{
                                            return{
                                                ...prev,
                                                nodeId: currentValue === linkData.nodeId ? "" : currentValue
                                            }
                                        })
                                        setOpen(false)
                                    }}
                                >
                                    <CheckIcon
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            linkData.nodeId === String(framework.id) ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {framework.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
