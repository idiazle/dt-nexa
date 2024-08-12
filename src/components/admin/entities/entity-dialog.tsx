'use client'
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import FormEntity from './form-entity'

interface EntityDialogStructure {
    id: number | null
    dialogOpen: boolean
    setDialogOpen: (value: boolean) => void
}

export default function EntityDialog({ id, dialogOpen, setDialogOpen }: EntityDialogStructure) {
    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            {
                // <DialogTrigger asChild>
                //     {
                //         id === null
                //             ? <p>
                //                 Crear entidad
                //             </p>
                //             : <p>
                //                 Editar entidad
                //             </p>
                //     }
                // </DialogTrigger>
            }
            <DialogPortal>
                <DialogOverlay />
                <DialogContent className='max-h-[95vh] overflow-auto' onPointerDownOutside={(e) => { e.preventDefault() }}>
                    <DialogHeader>
                        <DialogTitle>{id === null ? 'CREAR' : 'EDITAR'} ENTIDAD</DialogTitle>
                    </DialogHeader>
                    <FormEntity setDialogOpen={setDialogOpen} id={id} />
                </DialogContent>
            </DialogPortal>
        </Dialog>
    )
}
