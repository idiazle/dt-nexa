import React, { useState } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { FaTrash } from "react-icons/fa6";
import { CheckCircle, CheckCircle2Icon, CheckIcon } from 'lucide-react';

interface AlertDelDialogStructure {
    open: boolean
    setOpen: (value: boolean) => void
    executeMethod: () => void
    objName: string
}
export default function AlertDeleteDialog({ open, setOpen, executeMethod, objName }: AlertDelDialogStructure) {


    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            {/* <AlertDialogTrigger asChild>
                <Button variant="outline">Show Dialog</Button>
            </AlertDialogTrigger> */}
            <AlertDialogContent>
                <AlertDialogHeader className='flex flex-col justify-center items-center gap-5'>
                    <AlertDialogTitle>Alerta de Eliminación</AlertDialogTitle>
                    <FaTrash size={50} />
                    <AlertDialogDescription>
                        Está seguro que desea eliminar <span className='font-bold uppercase'>{objName}</span>, esta acción no podrá ser desecha...
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className='border-t'>
                    <div className='flex flex-row justify-between items-center w-full mt-3 gap-3'>
                        <AlertDialogAction className='w-1/2 transition-all duration-500 hover:bg-red-400 hover:text-lg' onClick={executeMethod}>
                            Eliminar
                        </AlertDialogAction>
                        <AlertDialogCancel className='w-1/2'>Cancelar</AlertDialogCancel>
                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
