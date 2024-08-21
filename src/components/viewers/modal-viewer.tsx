import React from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import Image from 'next/image'
import ReactPlayer from 'react-player'
import PdfViewer from './pdf-viewer'
import { FaBookOpen } from "react-icons/fa6";

interface ModalViewMediaStructure {
    open: boolean
    setOpen: (value: boolean) => void
    information: any
    type: string
}
export default function ModalViewMedia({ open, setOpen, information, type }: ModalViewMediaStructure) {
console.log(information.data);
console.log(type);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-lg max-h-[97vh] min-w-[95vw] overflow-hidden">
                <DialogHeader className='-my-3'>
                    <DialogTitle className={'flex flex-row justify-start items-center gap-3'}>
                        <FaBookOpen  size={18}/>
                        <p className='text-sm'>
                            {type === 'document' ? information?.data.title : information?.data.name || information?.data.filename.split('.')[0]}
                        </p>
                    </DialogTitle>
                    {/* <DialogDescription>
            Make changes to your profile here. Click save when e done.
          </DialogDescription> */}
                </DialogHeader>
                <AspectRatio ratio={16 / 9} className='h-[91vh] w-full overflow-auto z-50 flex justify-center items-center'>
                    {
                        type === 'document'
                            ? <PdfViewer file={information?.data?.file_url} />
                            : type === 'video'
                                ? <ReactPlayer controls={true} url={information?.data?.file_url} width="100%" height="100%" />
                                : <Image
                                    alt={information?.data?.name}
                                    src={information?.data?.image}
                                    height={500}
                                    width={500}
                                />
                    }
                </AspectRatio>
            </DialogContent>
        </Dialog >
    )
}
