import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import ComboNodes from './combo-nodes'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { getEquipments } from '@/api/admin/equipments-api'
import { Button } from '@/components/ui/button'
import { getNodes360ById, putNode360 } from '@/api/admin/nodes360-api'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { VirtualTourPlugin } from '@photo-sphere-viewer/virtual-tour-plugin'

interface MarkersLinksDialogStructure {
    allNodes: any
    dialogData: {
        open: boolean,
        data: any
    }
    setDialogData: (value: any) => void
    setDialogFather: (value: any) => void
}
export default function MarkersLinksDialog({ setDialogFather, allNodes, dialogData, setDialogData }: MarkersLinksDialogStructure) {

    const router = useRouter()
    const [selectedOption, setSelectedOption] = useState('')
    const baseUrl = 'https://photo-sphere-viewer-data.netlify.app/assets/'
    const [structMarker, setStructMarker] = useState<any>(null)
    const [typeRenderInput, setTypeRenderInput] = useState<number | null>(null)

    const handleMarkers = (markerType: number) => {
        setTypeRenderInput(markerType)
        let structureMarker = {}
        if (markerType === 1) {
            structureMarker = {
                image: baseUrl + 'pictos/pin-red.png',
                type: 'marker',
                tooltip: '',
                size: { width: 48, height: 48 },
                anchor: 'bottom center',
                position: { yaw: dialogData.data.yaw, pitch: dialogData.data.pitch }
            }
        }
        setStructMarker(structureMarker)
    }
    const [myEquipments, setMyEquipments] = useState<any>(null)

    const getAllEquipments = async () => {
        try {
            const response = await getEquipments()
            setMyEquipments(response.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getAllEquipments()
    }, [])



    const renderMarkerInputs = (type: number) => {
        if (type === 1) {
            return (
                <div>
                    <div>
                        <Label>Ícono del punto</Label>
                        <Input disabled value={structMarker?.image} />
                    </div>
                    <div>
                        <Label>Nombre a visualizar</Label>
                        <Input value={structMarker?.tooltip} onChange={(val) => {
                            setStructMarker((prev: any) => ({
                                ...prev,
                                id: JSON.parse(dialogData.data.selectedNode.markers as string).length + 1,
                                tooltip: val.target.value

                            }))
                        }} />
                        <div className='flex flex-col justify-center items-start w-full gap-3 my-2'>
                            <Label>Equipo</Label>
                            <Select value={structMarker.equipment_id} onValueChange={(value) => {
                                setStructMarker((prev: any) => ({
                                    ...prev,
                                    equipment_id: value

                                }))
                            }}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Seleccione un equipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {
                                            myEquipments?.map((obj: any, index: number) => {

                                                return (
                                                    <SelectItem key={index} value={String(obj.equipment_id)}>{obj.name}</SelectItem>
                                                )
                                            })
                                        }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div>
                    <p>OTRO</p>
                </div>
            )
        }
    }
    const [linkData, setLinkData] = useState<{
        nodeId: string
        position: { textureX: 0, textureY: 0 }
    } | null>(null)

    const { toast } = useToast()


    const handleSubmit = async () => {
        console.log("MY  LINKKS", dialogData.data.selectedNode.links);
        
        const links = JSON.parse(dialogData.data.selectedNode.links).concat(linkData)
        const markers = JSON.parse(dialogData.data.selectedNode.markers).concat(structMarker)
        let sendObject = {
            // links: JSON.stringify(links),
            // markers: JSON.stringify(markers)
        }

        if (linkData !== null) {
            sendObject = {
                ...sendObject,
                links: JSON.stringify(links)
            }
        } else {
            sendObject = {
                ...sendObject,
                markers: JSON.stringify(markers)
            }
        }

        try {
            const response = await putNode360(dialogData.data.selectedNode.id, { ...sendObject })
            console.log("MY SEND OBJETT", sendObject);
            
            toast({
                duration: 3000,
                variant: 'default',
                title: 'Creación',
                description: 'Nodo editado correctamente'
            })
            setDialogData({
                ...dialogData,
                open: false
            })
            setDialogFather((prev: boolean) => !prev)
            router.refresh()
        } catch (error) {
            console.log("MY ERROR", error)
        }
    }


    const settingLinkData = () => {
        if (selectedOption === '1') {
            setLinkData({
                nodeId: '',
                position: { textureX: dialogData.data.textureX, textureY: dialogData.data.textureY }
            })
        } else {
            setLinkData(null)
        }
    }

    useEffect(() => {
        settingLinkData()
    }, [selectedOption])

    

    return (
        <Dialog open={dialogData.open} onOpenChange={(val) => setDialogData({
            ...dialogData,
            open: val
        })}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Marcadores - Links</DialogTitle>
                    <DialogDescription />
                </DialogHeader>
                <div className='flex flex-col justify-center items-center gap-5'>
                    <Select value={selectedOption} onValueChange={setSelectedOption}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Qué desea realizar?" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="1">Relacionar otro nodo</SelectItem>
                                <SelectItem value="2">Crear marcador / Crear link</SelectItem>
                                <SelectItem value="3">Cargar fotografias individuales</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {
                        selectedOption === '1' ?
                            linkData !== null ?
                                <ComboNodes data={allNodes} linkData={linkData} setLinkData={setLinkData} /> : null :
                            selectedOption === '2' ?
                                <div className='w-full'>
                                    <p className='p-1 tex-xs'>Seleccione el tipo de marcador</p>
                                    <RadioGroup defaultValue="static" className='p-2 flex flex-row gap-10' onValueChange={(val) => { handleMarkers(Number(val)) }}>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="1" id="r1" />
                                            <Label htmlFor="r1">Punto de interés</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="2" id="r3" />
                                            <Label htmlFor="r3">Link Sistema Externo</Label>
                                        </div>
                                    </RadioGroup>
                                    {typeRenderInput === null ? null : renderMarkerInputs(typeRenderInput)}
                                </div> : null
                    }
                </div>
                <div className='flex justify-end w-full'>
                    <Button type='button' onClick={() => handleSubmit()}>
                        Guardar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
