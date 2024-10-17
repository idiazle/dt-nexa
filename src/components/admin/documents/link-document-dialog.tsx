'use'
import React, { useEffect, useState } from 'react'
import { CopyIcon } from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { getEntities } from '@/api/admin/entities-api'
import { deleteDocVsDocId, deleteReference, getDocumentsLightList, getDocVsDocRef, getObjVsDoc, postObjVsDocs, postRefDocToDoc } from '@/api/admin/documents-api'
import { FaRegTrashCan } from "react-icons/fa6";
import { EntityStructure, EquipmentStructure, LightDocument } from '@/lib/utils'
import { getEquipments } from '@/api/admin/equipments-api'
import { useToast } from '@/components/ui/use-toast'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useSession } from 'next-auth/react'
import { FaArrowRightLong } from "react-icons/fa6";
import { useRouter } from 'next/navigation'

interface LinkDocumentDialogStructure {
    open: boolean
    setOpen: (value: boolean) => void
    setReferenceObject: (value: any) => void
    operationType: string
    idDocument: number | null
}

export default function LinkDocumentDialog({ open, setOpen, setReferenceObject, operationType, idDocument }: LinkDocumentDialogStructure) {

    console.log("OPERATION TYPE: ", operationType);

    const router = useRouter()
    const { data: session } = useSession()

    const [equipments, setEquipments] = useState<EquipmentStructure[]>([])
    const [entities, setEntities] = useState<EntityStructure[]>([])
    const [documents, setDocuments] = useState<LightDocument[]>([])

    const [filteredItems, setFilteredItems] = useState<any[]>([])


    const [equipmentsSelected, setEquipmentsSelected] = useState<any[]>([])
    const [areasSelected, setAreasSelected] = useState<any[]>([])

    const [documentsSelected, setDocumentsSelected] = useState<any[]>([])

    const getAllData = async () => {
        try {
            const response = await getEquipments()
            let temp = response.data.data.map((obj: any) => {
                return {
                    ...obj,
                    isChecked: false
                }
            })

            // setEquipments(temp)

            const responseEntities = await getEntities()
            let temp2 = responseEntities.data.data.map((obj) => {
                return {
                    ...obj,
                    isChecked: false
                }
            })

            // setEntities(temp2)

            const responseDocuments = await getDocumentsLightList()
            let temp3 = responseDocuments.data.data.map((obj: LightDocument) => {
                return {
                    ...obj,
                    isChecked: false
                }
            })


            if (idDocument !== null) {

                const tempGetRefsDocs = await getObjVsDoc(idDocument)

                console.log("tempGetRefsDocs", tempGetRefsDocs);


                const equipmentSacados: any = [];

                const tempDataEquipments = response.data.data.filter((objd) => {
                    const match = tempGetRefsDocs.data.data.find((obj2: any) => objd.equipment_id == obj2.entity_id);
                    if (match) {
                        equipmentSacados.push(objd);
                        return false; // No se incluirá en el nuevo arreglo
                    }
                    return true; // Se incluirá en el nuevo arreglo
                });
                setEquipments(tempDataEquipments)
                setEquipmentsSelected(equipmentSacados)

                const entitiesSacados: any = [];


                const tempDataAreas = responseEntities.data.data.filter((objd) => {
                    const match = tempGetRefsDocs.data.data.find((obj2: any) => objd.id === obj2.entity_id);
                    if (match) {
                        entitiesSacados.push(objd);
                        return false; // No se incluirá en el nuevo arreglo
                    }
                    return true; // Se incluirá en el nuevo arreglo
                });
                setEntities(tempDataAreas)
                setAreasSelected(entitiesSacados)

                const tempGetRefDocsVsDocs = await getDocVsDocRef(idDocument)


                const documentosSacados: any = [];
                const tempDataDocs = responseDocuments.data.data.filter((doc: any) => doc.id !== idDocument).filter((objd: any) => {
                    const match = tempGetRefDocsVsDocs.data.data.find((obj2: any) => objd.id == obj2.document_id);
                    if (match) {
                        documentosSacados.push(objd);
                        return false; // No se incluirá en el nuevo arreglo
                    }
                    return true; // Se incluirá en el nuevo arreglo
                });
                setDocuments(tempDataDocs)
                setDocumentsSelected(documentosSacados)


            } else {
                setEquipments(temp)
                setEntities(temp2)
                setDocuments(temp3)
            }



        } catch (error) {
            throw new Error("LinkDocumentDialog");

        }
    }

    useEffect(() => {
        if (open) {
            getAllData()
        }
    }, [open])

    const [query, setQuery] = useState<string>('')
    const [tabSelected, setTabSelected] = useState<string>('tags')


    const handleChangeCheckbox = (checked: boolean, ele: any, tag: string) => {

        if (tag == 'tags') {
            if (checked == true) {
                setEquipments(prevstate => prevstate.map((obj: EquipmentStructure) => {
                    if (obj.equipment_id == ele.equipment_id) {
                        return {
                            ...obj,
                            isChecked: true
                        }
                    } else {
                        return obj
                    }
                }))
                setEquipmentsSelected([...equipmentsSelected, {
                    ...ele,
                    isNewSelected: true
                }])
            }
            else if (checked == false) {
                setEquipments(prevstate => prevstate.map((obj: EquipmentStructure) => {
                    if (obj.equipment_id == ele.equipment_id) {
                        return {
                            ...obj,
                            isChecked: false
                        }
                    }
                    else {
                        return obj
                    }
                }))
                const filtered = equipmentsSelected.filter(item => {
                    return item.equipment_id !== ele.equipment_id
                })
                setEquipmentsSelected(filtered)
            }
        } else if (tag === 'areas') {
            if (checked == true) {
                setEntities(prevstate => prevstate.map((obj) => {
                    if (obj.id == ele.id) {
                        return {
                            ...obj,
                            isChecked: true
                        }
                    } else {
                        return obj
                    }
                }))
                setAreasSelected([...areasSelected, {
                    ...ele,
                    isNewSelected: true
                }])
            }
            else if (checked == false) {
                setEntities(prevstate => prevstate.map((obj) => {
                    if (obj.id == ele.id) {
                        return {
                            ...obj,
                            isChecked: false
                        }
                    } else {
                        return obj
                    }
                }))
                const filtered = areasSelected.filter(item => {
                    return item.id !== ele.id
                })
                setAreasSelected(filtered)
            }
        } else if (tag === 'documents') {
            if (checked == true) {
                setDocuments(prevstate => prevstate.map((obj) => {
                    if (obj.id == ele.id) {
                        return {
                            ...obj,
                            isChecked: true
                        }
                    } else {
                        return obj
                    }
                }))
                setDocumentsSelected([...documentsSelected, {
                    ...ele,
                    isNewSelected: true
                }])
            }
            else if (checked == false) {
                setDocuments(prevstate => prevstate.map((obj) => {
                    if (obj.id == ele.id) {
                        return {
                            ...obj,
                            isChecked: false
                        }
                    } else {
                        return obj
                    }
                }))
                const filtered = documentsSelected.filter(item => {
                    return item.id !== ele.id
                })
                setDocumentsSelected(filtered)
            }
        }

    }

    const search = () => {
        if (tabSelected === 'tags') {
            if (equipments) {
                const filterList = equipments.filter(item => {
                    const res = (item.tag + item.name)
                    return res.toLowerCase().includes(query.toLowerCase())
                })
                setFilteredItems(filterList)
            }
        } else if (tabSelected === 'areas') {
            if (entities) {
                const filterList = entities.filter(item => {
                    const res = (item.code + item.name)
                    return res.toLowerCase().includes(query.toLowerCase())
                })
                setFilteredItems(filterList)
            }
        } else if (tabSelected === 'documents') {
            if (documents) {
                const filterList = documents.filter(item => {
                    const res = (item.title + item.filename)
                    return item.title.toLowerCase().includes(query.toLowerCase())
                })
                setFilteredItems(filterList)
            }
        }
    }

    useEffect(() => {
        search()
    }, [query, equipments, entities, documents, tabSelected])

    const [referencedDocs, setReferencedDocs] = useState<[] | null>(null)
    const [docVsDocRef, setDocVsDocRef] = useState<[] | null>(null)
    const getReferences = async () => {
        if (idDocument !== null) {
            try {
                const response = await getObjVsDoc(idDocument)
                if (response.status === 200) {
                    setReferencedDocs(response.data.data)
                }
                // console.log("DAWDWAA", response.status);

            } catch (error) {
                throw new Error("Error in getting getObjVsDoc");

            }

            try {
                const resp2 = await getDocVsDocRef(idDocument)
                // console.log(resp2.data.data);

                if (resp2.status === 200) {
                    setDocVsDocRef(resp2.data.data)
                }
            } catch (error) {
                throw new Error("Error in getting getDocVsDocRef")
            }

        }
    }

    useEffect(() => {
        getReferences()
    }, [idDocument])

    const { toast } = useToast()

    const delReference = async (id: number) => {
        try {
            const response = await deleteReference(id)
            if (response.status === 200) {
                toast({
                    duration: 3000,
                    variant: 'default',
                    title: 'Eliminación correcta',
                    description: 'Se eliminó la referencia de entidad-documento correctamente'
                })
            }
            getReferences()
            getAllData()
            router.refresh()
        } catch (error) {
            throw new Error("ERROR EN DELETEREFERENCE");

        }
    }

    const delDocVsDoc = async (id: number) => {
        try {
            const response = await deleteDocVsDocId(id)
            if (response.status === 200) {
                toast({
                    duration: 3000,
                    variant: 'default',
                    title: 'Eliminación correcta',
                    description: 'Se eliminó la referencia de documento-documento correctamente'
                })
                getAllData()
                getReferences()
                router.refresh()
            }

        } catch (error) {
            throw new Error("Error in DELETEDOCVSDOCID");

        }
    }

    const returnListReferences = (type: number) => {
        return (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Eliminar</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        referencedDocs !== null ?
                            referencedDocs.length > 0 ?
                                referencedDocs.filter((obj: any) => obj.type === type).map((obj: any) => {
                                    return (
                                        <TableRow key={obj.entity_data.id}>
                                            <TableCell>{obj.entity_data.id}</TableCell>
                                            <TableCell>{obj.entity_data.name}</TableCell>
                                            <TableCell>{obj.entity_data.code}</TableCell>
                                            <TableCell>
                                                <Button variant={'outline'} size={'icon'} onClick={() => delReference(obj.id)} asChild>
                                                    <FaRegTrashCan className='h-6 w-6 hover:cursor-pointer' />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                                : <h1>No existen registros</h1>
                            : <h1>Cargando</h1>
                    }


                </TableBody>
            </Table>
        )
    }

    const renderOption = (option: string) => {
        switch (option) {
            case 'tags':
                return (
                    <div className='flex flex-row w-full h-1/2 max-h-[75vh] gap-5'>
                        <div className='border w-1/2 rounded'>
                            <div className='p-3 overflow-auto h-full'>
                                <Input
                                    className='my-3'
                                    value={query}
                                    onChange={e => { setQuery(e.target.value) }}
                                    placeholder='-- Filtros --'
                                />
                                {
                                    filteredItems.length == 0 ?
                                        <h1>No existen documentos con los criterios de búsqueda ingresados</h1> :
                                        filteredItems.map((ele, index) => {
                                            return (
                                                <li key={index} className="flex items-center gap-2 text-sm m-1">
                                                    <Checkbox defaultChecked={ele.isChecked} checked={ele.isChecked} onCheckedChange={(val: boolean) => handleChangeCheckbox(val, ele, 'tags')} />

                                                    <div className='flex flex-row justify-start items-center gap-5 w-full'>
                                                        <p className='w-1/3'>{ele.tag}</p>
                                                        <FaArrowRightLong />
                                                        <p className='w-2/3'>{ele.title || ele.name}</p>
                                                    </div>
                                                </li>
                                            )
                                        })
                                }

                            </div>
                            {

                            }
                        </div>
                        <div className='border w-1/2 rounded'>
                            <ul className='p-3'>
                                {
                                    equipmentsSelected.length > 0 ?
                                        equipmentsSelected.map((e, index) => {
                                            return <li className="flex items-center text-sm m-1" key={index}>

                                                <div className='flex flex-row justify-start items-center gap-5 w-full'>
                                                    <p>{e.tag}</p>
                                                    <FaArrowRightLong />
                                                    <p>{e.name || e.code}</p>
                                                </div>

                                            </li>
                                        })
                                        :
                                        null
                                }
                            </ul>
                        </div>
                    </div>
                )

            case 'areas':
                return (
                    <div className='flex flex-row w-full h-1/2 max-h-[75vh] gap-5'>
                        <div className='border w-1/2 rounded'>
                            <div className='p-3 overflow-auto h-full'>
                                <Input
                                    className='my-3'
                                    value={query}
                                    onChange={e => { setQuery(e.target.value) }}
                                    placeholder='-- Filtros --'
                                />
                                {
                                    filteredItems.length == 0 ?
                                        <h1>No existen áreas con los criterios de búsqueda ingresados</h1> :
                                        filteredItems.map((ele, index) => {
                                            return (
                                                <li key={index} className="flex flex-col">
                                                    <div className={`text-sm m-1 flex flex-row gap-2 ${ele.parent_id ? 'ml-4' : 'ml-0'}`}>
                                                        <Checkbox defaultChecked={ele.isChecked} checked={ele.isChecked} onCheckedChange={(e: boolean) => { handleChangeCheckbox(e, ele, 'areas') }} />
                                                        {ele.code + (ele.code ? '-' : '') + ele.name}
                                                    </div>

                                                </li>
                                            )
                                        })
                                }

                            </div>
                            {

                            }
                        </div>
                        <div className='border w-1/2 rounded'>
                            <ul className='p-3'>
                                {
                                    areasSelected.length > 0 ?
                                        areasSelected.map((e, index) => {

                                            return <li className="flex items-center text-sm m-1" key={index}>
                                                {e?.code} - {e.name || e.code}
                                            </li>
                                        })
                                        :
                                        null
                                }
                            </ul>
                        </div>
                    </div>
                )

            case 'documents':
                return (
                    <div className='flex flex-row w-full h-1/2 max-h-[75vh] gap-5'>
                        <div className='border w-1/2 rounded'>
                            <div className='p-3 overflow-auto h-full'>
                                <Input
                                    className='my-3'
                                    value={query}
                                    onChange={e => { setQuery(e.target.value) }}
                                    placeholder='-- Filtros --'
                                />
                                {
                                    filteredItems.length == 0 ?
                                        <h1>No existen documentos con los criterios de búsqueda ingresados</h1> :
                                        filteredItems.map((ele, index) => {

                                            return (
                                                <li key={index} className="flex items-center gap-2 text-sm m-1">
                                                    <Checkbox defaultChecked={ele.isChecked} checked={ele.isChecked} onCheckedChange={(val: boolean) => handleChangeCheckbox(val, ele, 'documents')} />
                                                    {ele.title || ele.filename}
                                                </li>
                                            )
                                        })
                                }

                            </div>
                            {

                            }
                        </div>
                        <div className='border w-1/2 rounded'>
                            <ul className='p-3'>
                                {
                                    documentsSelected.length > 0 ?
                                        documentsSelected.map((e, index) => {
                                            return <li className="flex items-center text-sm m-1" key={index}>
                                                {e.title || e.filename}
                                            </li>
                                        })
                                        :
                                        null
                                }
                            </ul>
                        </div>
                    </div>
                )
            case 'listado':
                return (
                    <div className='flex flex-col'>
                        <Separator className='my-4' />
                        <div className='flex flex-row w-full h-1/2 max-h-[75vh] gap-5'>
                            <Tabs defaultValue="account" className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="documents">Documentos</TabsTrigger>
                                    <TabsTrigger value="tags">TAGS</TabsTrigger>
                                    <TabsTrigger value="entities">Entidades</TabsTrigger>
                                </TabsList>
                                <TabsContent value="documents" className='w-full'>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>ID</TableHead>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Code</TableHead>
                                                <TableHead>Eliminar</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {
                                                docVsDocRef !== null ?
                                                    docVsDocRef.length > 0 ?
                                                        docVsDocRef?.map((obj: any) => {
                                                            return (
                                                                <TableRow key={obj?.refer_id.id}>
                                                                    <TableCell>{obj?.refer_id.id}</TableCell>
                                                                    <TableCell>{obj?.refer_id.title}</TableCell>
                                                                    <TableCell>{obj?.refer_id.author}</TableCell>
                                                                    <TableCell>
                                                                        {obj.refer_id.file_url ?

                                                                            <a href={obj.refer_id.file_url} target='_blank'>Ver archivo</a>
                                                                            :
                                                                            <p>No tiene link</p>
                                                                        }
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Button variant={'outline'} size={'icon'} onClick={() => delDocVsDoc(obj.id)} asChild>
                                                                            <FaRegTrashCan className='h-6 w-6 hover:cursor-pointer' />
                                                                        </Button>
                                                                    </TableCell>
                                                                </TableRow>
                                                            )
                                                        })
                                                        : <h1>No existen registros</h1>
                                                    : <h1>Cargando</h1>
                                            }


                                        </TableBody>
                                    </Table>
                                </TabsContent>
                                <TabsContent value="tags" className='w-full'>
                                    {returnListReferences(3)}
                                </TabsContent>
                                <TabsContent value="entities">
                                    {returnListReferences(5)}
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>

                )
            default:
                break;
        }

    }
    // console.log("OEPRATION TYUPE", operationType);
    // console.log("EQUIPMENTSS", equipmentsSelected);
    // console.log("REFERENCESSEND", equipmentsSelected.filter((obj) => obj.isNewSelected));


    const saveData = async () => {

        if (operationType === 'create') {
            setReferenceObject({
                equipmentsReferences: equipmentsSelected,
                areasReferences: areasSelected,
                documentsReferences: documentsSelected
            })
        } else {
            //AQUI ENVIAR GUARDAR
            if (tabSelected === 'tags') {
                let jsonEquipments = {
                    document_id: [idDocument],
                    entity_id: equipmentsSelected.filter((obj) => obj.isNewSelected),
                    type: 3,
                    user_id: Number(session?.user.id)
                }
                try {
                    const response = await postObjVsDocs(jsonEquipments)
                    if (response.status === 200) {
                        toast({
                            duration: 3000,
                            variant: 'default',
                            title: 'Creación',
                            description: 'Relación de Equipos creada correctamente'
                        })
                    }
                } catch (error) {
                    throw new Error("ERROR IN SAVEDATA METHOD LINKDOCUMENTDIALOG");
                }

            } else if (tabSelected === 'areas') {
                let jsonAreas = {
                    document_id: [idDocument],
                    entity_id: areasSelected.filter((obj) => obj.isNewSelected).map((obj) => { return obj.id }),
                    type: 5,
                    user_id: Number(session?.user.id)
                }
                console.log("RELACION AREAS", jsonAreas);

                try {
                    const response = await postObjVsDocs(jsonAreas)
                    if (response.status === 200) {
                        toast({
                            duration: 3000,
                            variant: 'default',
                            title: 'Creación',
                            description: 'Relación de Áreas creada correctamente'
                        })
                    }
                } catch (error) {
                    throw new Error("ERROR IN SAVEDATA METHOD LINKDOCUMENTDIALOG");
                }

            } else if (tabSelected === 'documents') {
                // console.log("DOCUMENTS SELECTED", documentsSelected);
                try {
                    const finalArray = documentsSelected.filter((obj) => obj.isNewSelected).map((e) => { return e.id })
                    const jsonToSend = {
                        document_id: idDocument,
                        refer_id: finalArray,
                        user_id: Number(session?.user.id),
                    }
                    const response = await postRefDocToDoc(jsonToSend)
                    if (response.status === 200) {
                        toast({
                            duration: 3000,
                            variant: 'default',
                            title: 'Creación',
                            description: 'Relación de Documentos creada correctamente'
                        })
                    }
                } catch (error) {
                    throw new Error("ERROR IN SAVEDATA METHOD LINKDOCUMENTDIALOG");
                }
            }
        }
    }

    console.log("areasSelected", areasSelected);


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-h-[95vh] overflow-auto min-w-[50vw]">
                <DialogHeader>
                    <DialogTitle>Vincular</DialogTitle>
                    {/* <DialogDescription>
                        Anyone who has this link will be able to view this.
                    </DialogDescription> */}
                </DialogHeader>
                <Tabs defaultValue="tags" className="w-full" onValueChange={(va) => setTabSelected(va)}>
                    <TabsList className='flex flex-row gap-5'>
                        <TabsTrigger value="tags">Tags</TabsTrigger>
                        <TabsTrigger value="areas">Áreas</TabsTrigger>
                        <TabsTrigger value="documents">Documentos</TabsTrigger>
                        {
                            operationType === 'edit' ?
                                <TabsTrigger value="listado">Ver referencias</TabsTrigger> : null
                        }
                    </TabsList>
                    <TabsContent value="tags">
                        {renderOption('tags')}
                    </TabsContent>
                    <TabsContent value="areas">
                        {renderOption('areas')}
                    </TabsContent>
                    <TabsContent value="documents">
                        {renderOption('documents')}
                    </TabsContent>
                    <TabsContent value="listado">
                        {renderOption('listado')}
                    </TabsContent>
                </Tabs>

                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <div className='flex flex-row justify-end items-center gap-3 w-full'>
                            <Button className='w-1/5' type="button" variant="secondary" onClick={() => { saveData() }}>
                                Guardar
                            </Button>
                            <Button className='w-1/5' type="button" variant="secondary" onClick={() => { setOpen(false) }}>
                                Cerrar
                            </Button>
                        </div>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
