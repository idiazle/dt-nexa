"use client"

import { Button } from "@/components/ui/button";
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
const downloadFile = (file: any) => {
    fetch(`${file.file_url}`).then(response => {
        response.blob().then(blob => {
            const fileURL = window.URL.createObjectURL(blob)
            const linToDownload = document.createElement('a')
            const fileExtension = file.file_url.split('.').pop()
            // Establecer el nombre del archivo con la extensión correcta
            linToDownload.href = fileURL
            linToDownload.download = `${file.title}.${fileExtension}`
            linToDownload.click()
        })
    })
}
export const columns: ColumnDef<any>[] = [
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
                        console.log(row.original)
                        setOpenMedia(true), setInformation({
                            data: {
                                file_url: row.original?.document?.file_url || row.original?.document_id?.file_url,
                                title: row.original?.document?.title || row.original?.document_id?.title,
                                name: row.original?.document?.filename || row.original?.document_id?.filename,
                                type: 'document'
                            },
                        })
                    }} className="flex flex-row justify-start items-center h-full w-full gap-0.5">

                        <FaRegFilePdf size={18} color="red" />
                        <p className="w-full text-left">{row.original?.document?.title || row.original?.document_id?.title}</p>
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
        accessorKey: 'revision',
        header: () => <div className="text-center">Revisión</div>,
        cell: ({ row }) => {
            return (
                <div>
                    <p>{row.original?.document?.client?.revision_client || row.original?.document_id?.client?.revision_client}</p>
                </div>
            )
        }
    },
    {
        accessorKey: 'code',
        header: () => <div className="text-center">Código|Nombre de archivo?</div>,
        cell: ({ row }) => {
            return (
                <div>
                    <p>{row.original?.document?.filename || row.original?.document_id?.filename}</p>
                </div>
            )
        }
    },
    {
        accessorKey: "actions",
        header: () => <div>Descargar</div>,
        cell: ({ row }) => {
            // const image = row.getValue('tag') || '/img/logo_main_dp.png' as any
            return (
                <button className="flex flex-row justify-center items-center h-full w-full" onClick={() => {
                    downloadFile(row.original.document)

                }}>
                    <FaDownload size={18} />
                </button>
            )
        },
    },
]
