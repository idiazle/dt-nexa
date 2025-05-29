'use client'
import React, { useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import { type IconStructure } from '@/lib/utils'
import Image from 'next/image'
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger
} from '@/components/ui/context-menu'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { ToastAction } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { deleteMapPlans2dIcon, putMapPlans2dIcon } from '@/api/admin/maps2d-api'

export default function IconImageCard({ icon }: { icon: any }) {
    const { toast } = useToast()
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    const [openToast, setOpenToast] = useState<boolean>(false)
    const router = useRouter()
    const [document, setDocument] = useState<File | null>(null)
    const [name, setName] = useState(icon.name)
    const deleteImage = async (id: number) => {
        setOpenToast(true)
        try {
            const response = await deleteMapPlans2dIcon(id)
            if (response.status === 200) {
                toast({
                    variant: 'destructive',
                    title: 'Eliminación',
                    description: 'Imagen eliminada correctamente'
                })
                router.refresh()
            }
        } catch (error) {
            console.log("MMY EERRROR", error)
        }
    }

    const updateImage = async (id: number) => {
        if (id !== null) {
            const formD = new FormData()
            if (document !== null) {
                formD.append('file', document)
            }
            formD.append('name', name)
            try {
                const response = await putMapPlans2dIcon(id, formD)
                if (response.status === 200) {
                    router.refresh()
                    toast({
                        variant: 'default',
                        title: 'Actualización',
                        description: 'Imagen actualizada correctamente'
                    })
                    setDialogOpen(false)
                    setDocument(null)
                }
            } catch (error) {
                throw new Error('ERROR IN PUT IMAGES')
            }
        }
    }

    console.log("MY DOCUMENT", document);

    return (
        <Card className='max-w-72 max-h-72'>
            <CardHeader>
                <CardTitle className='text-sm'>{icon.name}</CardTitle>
                {/* <CardDescription>Card Description</CardDescription> */}
            </CardHeader>
            <CardContent>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen} >
                    <ContextMenu>
                        <ContextMenuTrigger className='flex items-center justify-center'>
                            <div className="w-full relative pt-[50%]">
                                <Image
                                    alt={icon.name}
                                    src={icon.file}
                                    objectFit="contain"
                                    fill
                                    className="w-full h-full top-0 left-0 object-cover rounded-2xl"
                                />
                            </div>
                        </ContextMenuTrigger>
                        <ContextMenuContent hideWhenDetached={false}>
                            <DialogTrigger asChild>
                                <ContextMenuItem>Ampliar</ContextMenuItem>
                            </DialogTrigger>
                            <ContextMenuItem><p onClick={() => {
                                toast({
                                    duration: 3000,
                                    open: openToast,
                                    onOpenChange: setOpenToast,
                                    variant: 'default',
                                    title: 'Eliminación',
                                    description: 'Desea eliminar esta imagen?',
                                    action: <ToastAction altText='Confirmar' onClick={() => { deleteImage(icon.id) }}>Confirmar</ToastAction>
                                })
                            }}>Eliminar</p></ContextMenuItem>
                        </ContextMenuContent>
                    </ContextMenu>
                    <DialogContent className="max-h-[75vh] overflow-auto min-w-[50vw]">
                        <DialogHeader>
                            <DialogTitle>
                                <Input value={name} onChange={(e) => setName(e.target.value)} />
                            </DialogTitle>
                            {/* <DialogDescription>
                                This action cannot be undone. Are you sure you want to permanently
                                delete this file from our servers?
                            </DialogDescription> */}
                        </DialogHeader>
                        <div className='flex justify-center items-center'>
                            <Image
                                alt={icon.name}
                                src={icon.file}
                                width={750}
                                height={350}
                            />
                        </div>

                        <DialogFooter>
                            <div className='w-full flex justify-center items-center gap-10'>
                                <Button
                                    onClick={async () => { await updateImage(icon.id) }}
                                >
                                    Guardar cambios
                                </Button>
                                <Button type="button" className='relative w-28'>
                                    <Input
                                        onChange={(e) => {
                                            if (e.target.files !== null) {
                                                setDocument(e.target.files[0])
                                            }
                                        }}
                                        className='opacity-0 absolute top-0 left-0'
                                        type="file"
                                    />
                                    Editar
                                </Button>
                                <DialogClose>
                                    <Button type="button">Cancelar</Button>
                                </DialogClose>
                            </div>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardContent>
            <CardFooter>
                <p className='text-xs text-center w-full'>Click derecho en la imagen para más opciones</p>
            </CardFooter>
        </Card>
    )
}
