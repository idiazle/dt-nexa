'use client'
import React, { useState } from 'react'
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
import { cn, ModuleStructure } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown } from "lucide-react"

const frameworks = [
    {
        value: "next.js",
        label: "Next.js",
    },
    {
        value: "sveltekit",
        label: "SvelteKit",
    },
    {
        value: "nuxt.js",
        label: "Nuxt.js",
    },
    {
        value: "remix",
        label: "Remix",
    },
    {
        value: "astro",
        label: "Astro",
    },
]

interface ComboBoxModuleStructure {
    data: ModuleStructure[]
    title: string
    defaultValue: any
    onChange: (value: any) => void

}

export default function ComboBoxModules({ data, title, defaultValue, onChange, ...props }: ComboBoxModuleStructure) {
    const [open, setOpen] = useState<boolean>(false)
    const [value, setValue] = useState<string>(String(defaultValue))

    console.log(value);
    
    
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger {...props} asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="justify-between"
                >
                    {value
                        ? data.find((obj) => String(obj.id) === value)?.name
                        : `Seleccione el ${title}`}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="CustomPopoverContent">
                <Command>
                    <CommandInput placeholder={`Buscar ${title}...`} />
                    <CommandList>
                        <CommandEmpty>Módulo no encontrado.</CommandEmpty>
                        <CommandGroup>
                            {data.map((obj) => (
                                <CommandItem
                                    key={obj.id}
                                    value={String(obj.id)}
                                    keywords={[obj.name]}
                                    onSelect={(currentValue) => {
                                        onChange(Number(currentValue))
                                        setValue(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === String(obj.id) ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {obj.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
