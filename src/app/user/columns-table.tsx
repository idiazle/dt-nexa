"use client"

import ModalViewMedia from "@/components/viewers/modal-viewer";
import { ColumnDef } from "@tanstack/react-table"
import { useState } from "react";
import { FaRegFilePdf } from "react-icons/fa6"
import { FaDownload } from "react-icons/fa6";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
    id: string
    amount: number
    status: "pending" | "processing" | "success" | "failed"
    email: string
}

export const columns: ColumnDef<Payment>[] = [
    {
        accessorKey: 'id',
        header: () => <div className="text-left">Nombres</div>,
        cell: ({ row }) => {
            // const image = row.getValue('tag') || '/img/logo_main_dp.png' as any
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const [information, setInformation] = useState<any>({
                data: {
                    file_url: '',
                    type: '',
                    title: ''
                }
            })

            // eslint-disable-next-line react-hooks/rules-of-hooks
            const [openMedia, setOpenMedia] = useState<boolean>(false)

            return (
                <>
                    <button onClick={() => {
                        setOpenMedia(true), setInformation({
                            data: {
                                file_url: 'https://almdigital1.blob.core.windows.net/tintaya/files/3/1.1. Descripción General de las Operaciones.pdf.pdf',
                                title: 'Manual de uso Digital Portal - TINTAYA',
                                name: 'Manual de uso (Video) Digital Portal - TINTAYA',
                                type: 'document'
                            },
                        })
                    }} className="flex flex-row justify-start items-center h-full w-full gap-0.5">
                        <FaRegFilePdf size={18} color="red" />
                        <p className="w-full text-left">{row.getValue('id')}</p>
                    </button>
                    {
                        openMedia ?
                            <ModalViewMedia information={information} open={openMedia} setOpen={setOpenMedia} type={information.data.type} /> : null
                    }
                </>
            )
        },
    },
    {
        accessorKey: "status",
        header: "Código"
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "amount",
        header: () => <div>Descargar</div>,
        cell: ({ row }) => {
            // const image = row.getValue('tag') || '/img/logo_main_dp.png' as any
            return (
                <button className="flex flex-row justify-center items-center h-full w-full">
                    <FaDownload size={18} />
                </button>
            )
        },
    },
]
