'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { z } from 'zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { FaFile, FaLink } from 'react-icons/fa6'
import { Input } from '@/components/ui/input'
import { ModuleStructure } from '@/lib/utils'
import { getDocumentById, getOptionsById, getVerifyDocExists, postDocument, postObjVsDocs, postRefDocToDoc, postTemFileToDoc, putDocumentById, uploadDocument } from '@/api/admin/documents-api'
import { Checkbox } from '@/components/ui/checkbox'
import { CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import ComboBoxModules from '../combo-box-modules'
import { toast } from '@/components/ui/use-toast'
import { AxiosError } from 'axios'
import LinkDocumentDialog from './link-document-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { revalidatePath } from 'next/cache'
import { revalidaTeRoute } from '@/lib/actions'
import { useSession } from 'next-auth/react'

interface FormDocDialogStructure {
    tempFile: any
    setTempFile: (value: any) => void
    setDialogOpen: (value: boolean) => void
    id: number | null
    onRefresh: () => void
}

export interface CheckValuesForm {
    expired: boolean
    vendor: boolean
    client: boolean
}

export default function FormDocDialog({ id, tempFile, setTempFile, setDialogOpen, onRefresh }: FormDocDialogStructure) {

    const { data: session } = useSession()

    const [modules, setModules] = useState<ModuleStructure[]>([])
    const [disciplines, setDisciplines] = useState<ModuleStructure[]>([])
    const [types, setTypes] = useState<ModuleStructure[]>([])
    const [statusVendor, setStatusVendor] = useState<ModuleStructure[]>([])
    const [statusClient, setStatusClient] = useState<ModuleStructure[]>([])
    const [documentFile, setDocumentFile] = useState<File | null>(null)
    const [checkExpired, setCheckExpired] = useState<CheckValuesForm>({
        expired: false,
        client: false,
        vendor: false
    })
    const router = useRouter()
    const [fileUrl, setFileUrl] = useState<any | null>('')


    const today = new Date()
    const date = today.setDate(today.getDate())
    const defaultDate = new Date(date).toISOString().split('T')[0]


    const fillDropdowns = async () => {
        try {
            const resModules = await getOptionsById({ ids: '1' })

            const resDisciplines = await getOptionsById({ ids: '5' })


            const resTypes = await getOptionsById({ ids: '6' })
            if (resModules.status === 200) {
                setModules(resModules.data.data)
            }
            if (resDisciplines.status === 200) {
                setDisciplines(resDisciplines.data.data)
            }
            if (resTypes.status === 200) {
                setTypes(resTypes.data.data)
            }
        } catch (error) {
            throw new Error('error obteniendo resm')
        }
        try {
            const resModules = await getOptionsById({ ids: '3' })
            if (resModules.status === 200) {
                setStatusVendor(resModules.data.data)
            }
        } catch (error) {
            throw new Error('error GAA')
        }
        try {
            const resModules = await getOptionsById({ ids: '4' })
            // console.log("resModules", resModules.data.data);

            if (resModules.status === 200) {
                setStatusClient(resModules.data.data)
            }
        } catch (error) {
            throw new Error('error GAA')
        }
    }
    useEffect(() => {
        fillDropdowns()
    }, [])

    const getDocumentInfo = async () => {
        // const response = await getDocumentById(Number(params.id))
        try {
            const resModules = await getOptionsById({ ids: '1' })
            if (resModules.status === 200) {
                setModules(resModules.data.data)
            }
        } catch (error) {
            throw new Error('error GAA')
        }
        try {
            const resModules = await getOptionsById({ ids: '3' })
            if (resModules.status === 200) {
                setStatusVendor(resModules.data.data)
            }
        } catch (error) {
            throw new Error('error GAA')
        }
        try {
            const resModules = await getOptionsById({ ids: '4' })
            if (resModules.status === 200) {
                setStatusClient(resModules.data.data)
            }
        } catch (error) {
            throw new Error('error GAA')
        }

        try {
            const response = await getDocumentById(Number(id))
            const data = response.data.data
            // console.log(data);

            setFileUrl(response.data)

            if (data.vendor !== null && data.client !== null) {
                setCheckExpired({
                    ...checkExpired,
                    vendor: true,
                    client: true
                })
                formVendor.setValue('aux_status_vendor', data.vendor?.aux_status_vendor?.id)
                formVendor.setValue('code_vendor', data.vendor?.code_vendor)
                formVendor.setValue('revision_vendor', data.vendor?.revision_vendor)
                formVendor.setValue('rev_vendor_by', data.vendor?.rev_vendor_by)

                formClient.setValue('aux_status_client', data.client?.aux_status_client?.id)
                formClient.setValue('code_client', data.client?.code_client)
                formClient.setValue('revision_client', data.client?.revision_client)
                formClient.setValue('revision_client_alt', data.client?.revision_client_alt)
                formClient.setValue('revision_client_by', data.client?.revision_client_by)
                formClient.setValue('po_contract', data.client?.po_contract)

            }

            else if (data.vendor != null) {

                setCheckExpired({
                    ...checkExpired,
                    vendor: true
                })
                formVendor.setValue('aux_status_vendor', data.vendor?.aux_status_vendor?.id)
                formVendor.setValue('code_vendor', data.vendor?.code_vendor)
                formVendor.setValue('revision_vendor', data.vendor?.revision_vendor)
                formVendor.setValue('rev_vendor_by', data.vendor?.rev_vendor_by)
            }

            else if (data.client != null) {
                // console.log("Client");
                setCheckExpired({
                    ...checkExpired,
                    client: true
                })
                formClient.setValue('aux_status_client', data.client?.aux_status_client?.id)
                formClient.setValue('code_client', data.client?.code_client)
                formClient.setValue('revision_client', data.client?.revision_client)
                formClient.setValue('revision_client_alt', data.client?.revision_client_alt)
                formClient.setValue('revision_client_by', data.client?.revision_client_by)
                formClient.setValue('po_contract', data.client?.po_contract)
            }

            if (data.date_expired !== null) {
                setCheckExpired({
                    ...checkExpired,
                    expired: true
                })
            }

            // const disciplines = await getOptionsById({ ids: String(data.aux_module_id?.id) })
            // if (disciplines.status === 200) {
            //     setDisciplines(disciplines.data.data)
            // }
            // const typess = await getOptionsById({ ids: String(data.aux_discipline_id?.id) })
            // if (typess.status === 200) {
            //     setTypes(typess.data.data)
            // }
            form.setValue('title', data.title)
            form.setValue('filename', data.filename)
            form.setValue('author', data.author)
            form.setValue('aux_type_id', data.aux_type_id?.id)
            form.setValue('aux_discipline_id', data.aux_discipline_id?.id)
            form.setValue('aux_module_id', data.aux_module_id?.id)
            form.setValue('confidential', data.confidential === 0 ? false : true)
            form.setValue('date_doc', data.date_doc.split('T')[0])
            form.setValue('date_load', data.date_load.split('T')[0])
            form.setValue('date_expired', data.date_expired)
            form.setValue('days_expired', data.days_expired)
            form.setValue('user_id', data.user_id)
            // console.log("PAWDKP", response);

        } catch (error) {
            throw new Error("ERROR AL OBTENER INFOR DOCUMENT");

        }

    }

    useEffect(() => {
        if (id !== null) {
            getDocumentInfo()
        }
    }, [id])


    const formSchema = z.object({
        title: z.string().min(2, {
            message: 'Título muy corto.'
        }),
        filename: z.string().min(2, {
            message: 'Nombre de archivo muy corto.'
        }).optional(),
        author: z.string().min(2, {
            message: 'Como mínimo, ingrese el nombre'
        }),
        aux_type_id: z.number().min(1, {
            message: 'Debe elegir al menos un tipo'
        }),
        aux_discipline_id: z.number().min(1, {
            message: 'Debe elegir al menos una disciplina'
        }),
        aux_module_id: z.number().min(1, {
            message: 'Debe elegir al menos un módulo'
        }),
        confidential: z.boolean(),
        date_doc: z.string(),
        date_load: z.string(),
        date_expired: z.string().nullable().optional(),
        days_expired: z.string().optional(),
        user_id: z.number()
    })

    const formSchemaVendor = z.object({
        aux_status_vendor: z.string(),
        code_vendor: z.string().min(2, {
            message: 'Code vendor must be at least 2 characters.'
        }),
        revision_vendor: z.string().min(2, {
            message: 'Revision vendor must be at least 2 characters.'
        }),
        rev_vendor_by: z.string().min(2, {
            message: 'Rev vendor by must be at least 2 characters.'
        })
    })
    const formVendor = useForm<z.infer<typeof formSchemaVendor>>({
        reValidateMode: 'onChange',
        resolver: zodResolver(formSchemaVendor),
        defaultValues: {
            aux_status_vendor: '0',
            code_vendor: '',
            revision_vendor: '',
            rev_vendor_by: ''
        }
    })
    const formSchemaClient = z.object({
        aux_status_client: z.any(),
        code_client: z.string().min(2, {
            message: 'Code client must be at least 2 characters.'
        }),
        revision_client: z.string().min(2, {
            message: 'Revision client must be at least 2 characters.'
        }),
        revision_client_alt: z.string().min(2, {
            message: 'Rev client alt must be at least 2 characters.'
        }),
        revision_client_by: z.string().min(2, {
            message: 'Rev client by must be at least 2 characters.'
        }),
        po_contract: z.string().min(2, {
            message: 'Po contract by must be at least 2 characters.'
        })
    })
    const formClient = useForm<z.infer<typeof formSchemaClient>>({
        reValidateMode: 'onChange',
        resolver: zodResolver(formSchemaClient),
        defaultValues: {
            aux_status_client: null,
            code_client: '',
            revision_client: '',
            revision_client_alt: '',
            revision_client_by: '',
            po_contract: ''
        }
    })

    console.log("FORMCLIENTT", formClient.watch());


    const form = useForm<z.infer<typeof formSchema>>({
        reValidateMode: 'onChange',
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            filename: '',
            author: '',
            aux_type_id: 0,
            aux_discipline_id: 0,
            aux_module_id: 0,
            confidential: false,
            date_doc: defaultDate,
            date_load: defaultDate,
            date_expired: null,
            days_expired: '0',
            user_id: session?.user.id
        }
    })

    const [referenceObject, setReferenceObject] = useState<any>({
        equipmentsReferences: [],
        areasReferences: [],
        documentsReferences: []
    })


    const [sendingFile, setSendingFile] = useState(false)

    const handleGeneralSubmit = async () => {
        const isValidForm1 = await form.trigger()

        if (documentFile !== null) {
            form.setValue('filename', documentFile.name)
        }

        if (id === null) {
            let temp = {}

            if (isValidForm1) {
                if (checkExpired.vendor && checkExpired.client) {
                    temp = {
                        ...form.getValues(),

                        vendor: formVendor.getValues(),
                        client: formClient.getValues()
                    }
                } else if (checkExpired.vendor) {
                    temp = {
                        ...form.getValues(),
                        vendor: formVendor.getValues()
                    }
                } else if (checkExpired.client) {
                    temp = {
                        ...form.getValues(),
                        client: formClient.getValues()
                    }
                } else {
                    temp = {
                        ...form.getValues()
                    }
                }
            }

            try {
                console.log("MY TEMP");

                const response = await postDocument(temp)
                if (response.status === 201) {
                    toast({
                        duration: 3000,
                        variant: 'default',
                        title: 'Creación exitosa',
                        description: 'Documento creado correctamente'
                    })
                    if (documentFile) {
                        setSendingFile(true)
                        try {
                            let fileData = new FormData()
                            fileData.append('attachment', documentFile)

                            const config = {
                                onUploadProgress: async (progressEvent: any) => {
                                    const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                                    setUploadDocLoading(progress - 1)
                                },
                                headers: {
                                    'Content-Type': 'multipart/form-data'
                                }
                            }

                            const fileUploaded = await uploadDocument(response.data.data.id, fileData, config)
                            if (fileUploaded.status === 200) {
                                setSendingFile(false)
                                toast({
                                    duration: 3000,
                                    variant: 'default',
                                    title: 'Carga correcta',
                                    description: 'Documento subido correctamente'
                                })
                            }
                            // console.log("OBJTE", referenceObject);


                        } catch (error) {

                        }
                    } else {
                        if (tempFile != null) {
                            let jsonA = {
                                document_id: response.data.data.id,
                                temporal_file_id: tempFile.id || null
                            }
                            postTemFileToDoc(jsonA).then((rpta) => {
                                if (rpta.status === 200) {
                                    toast({
                                        duration: 3000,
                                        variant: 'default',
                                        title: 'Carga correcta',
                                        description: 'Documento subido correctamente'
                                    })
                                    // routerUse.push("/admin/documents")
                                }
                            })
                        }

                    }
                    try {
                        if (referenceObject.equipmentsReferences.length > 0) {
                            console.log("ESTOY AQUíIIIIIIII", referenceObject.equipmentsReferences);

                            const jsonEquipments = {
                                document_id: [response.data.data.id],
                                entity_id: referenceObject.equipmentsReferences,
                                type: 3,
                                user_id: Number(session?.user.id)
                            }
                            const resObjVsDoc = await postObjVsDocs(jsonEquipments)
                            if (resObjVsDoc.status !== 200) {
                                toast({
                                    duration: 3000,
                                    variant: 'destructive',
                                    title: 'Error',
                                    description: 'Ocurrió un error al crear la referencia de equipos'
                                })
                            }
                        }
                        if (referenceObject.areasReferences.length > 0) {
                            const jsonAreas = {
                                document_id: [response.data.data.id],
                                entity_id: referenceObject.areasReferences.map((obj: any) => { return obj.id }),
                                type: 5,
                                user_id: Number(session?.user.id)
                            }
                            const resObjVsDocArea = await postObjVsDocs(jsonAreas)
                            if (resObjVsDocArea.status !== 200) {
                                toast({
                                    duration: 3000,
                                    variant: 'destructive',
                                    title: 'Error',
                                    description: 'Ocurrió un error al crear la referencia de áreas'
                                })
                            }
                        }
                        if (referenceObject.documentsReferences.length > 0) {
                            const jsonToSend = {
                                document_id: response.data.data.id,
                                refer_id: referenceObject.documentsReferences.map((obj: any) => { return obj.id }),
                                user_id: Number(session?.user.id),
                            };
                            const resRefToDoc = await postRefDocToDoc(jsonToSend)
                            if (resRefToDoc.status !== 200) {
                                toast({
                                    duration: 3000,
                                    variant: 'destructive',
                                    title: 'Error',
                                    description: 'Ocurrió un error al crear la referencia de documento a documento'
                                })
                            }

                        }
                    } catch (error) {
                        throw new Error("ERROR EN FormCreateDocument - postObjVsDocs");

                    }
                    router.refresh()
                    onRefresh()
                    location.reload()
                    setDialogOpen(false)
                }

            } catch (error: any) {
                if (error instanceof AxiosError) {
                    toast({
                        duration: 7000,
                        variant: 'destructive',
                        title: 'Error',
                        description: <div className='flex flex-col'>
                            {
                                error?.response?.data.data.map((obj: any, index: number) => {
                                    return (
                                        <div key={index} className='flex flex-row gap-3 border-b border-white p-2'>
                                            <h1>{index + 1}</h1>
                                            <div className='flex flex-col'>
                                                {/* <p>{obj.attr}</p> */}
                                                <p>Campo erróneo: {obj.code}</p>
                                                <p>Detalle del error: {obj.detail}</p>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    });
                }
                console.log(error);

                throw new Error("ERROR EN FormCreateDocument", error);
            }

        } else {
            const finalResponse = {
                ...form.getValues(),
                client: checkExpired.client ? formClient.getValues() : null,
                vendor: checkExpired.vendor ? formVendor.getValues() : null
            }
            try {
                const response = await putDocumentById(id, finalResponse)
                if (response.status === 200) {
                    toast({
                        duration: 3000,
                        variant: 'default',
                        title: 'Actualización correcta',
                        description: 'Se actualizó el documento correctamente'
                    })
                    if (documentFile) {
                        try {
                            let fileData = new FormData()
                            fileData.append('attachment', documentFile)

                            const config = {
                                onUploadProgress: async (progressEvent: any) => {
                                    const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                                    setUploadDocLoading(progress - 1)
                                },
                                headers: {
                                    'Content-Type': 'multipart/form-data'
                                }
                            }

                            const fileUploaded = await uploadDocument(response.data.data.id, fileData, config)
                            if (fileUploaded.status === 200) {
                                toast({
                                    duration: 3000,
                                    variant: 'default',
                                    title: 'Carga correcta',
                                    description: 'Documento subido correctamente'
                                })
                            }
                        } catch (error) {

                        }
                    } else {
                        console.log("LUEGO LO SUBO ");
                    }

                    router.refresh()
                    onRefresh()
                    setDialogOpen(false)
                }
            } catch (error) {
                throw new Error("Error in putDocumentById");

            }
        }

        // setRefreshTable(!refreshTable)

        router.refresh()

    }

    const [uploadDocLoading, setUploadDocLoading] = useState<number | null>(null)


    // const getDisciplines = async () => {
    //     try {
    //         if (form.getValues('aux_module_id') !== null && form.getValues('aux_module_id') !== 0) {
    //             const resDisciplines = await getOptionsById({ ids: String(form.getValues('aux_module_id')) })
    //             setDisciplines(resDisciplines.data.data)
    //         }
    //     } catch (error) {
    //         throw new Error('Error in getDisciplines')
    //     }
    // }
    // useEffect(() => {
    //     getDisciplines()
    // }, [form.watch('aux_module_id')])

    // const getTypes = async () => {
    //     try {
    //         if (form.getValues('aux_discipline_id') !== null && form.getValues('aux_discipline_id') !== 0) {
    //             const resTypes = await getOptionsById({ ids: String(form.getValues('aux_discipline_id')) })
    //             setTypes(resTypes.data.data)
    //         }
    //     } catch (error) {
    //         throw new Error('Error in getTypes')
    //     }
    // }

    // useEffect(() => {
    //     getTypes()
    // }, [form.watch('aux_discipline_id')])


    const [disableSaveDocExist, setDisableSaveDocExist] = useState<boolean>(false)
    const getVerifyDocExist = async (filename: string) => {
        const response = await getVerifyDocExists(filename)
        console.log("VERIFY EXISTE", response.data);

        if (response.data.data > 0) {
            setDisableSaveDocExist(true)
            toast({
                duration: 5000,
                variant: 'destructive',
                title: 'Advertencia',
                description: 'El Documento existe en la base de datos'
            })
        } else {
            setDisableSaveDocExist(false)
        }


    }

    const settingFilename = (file: File) => {
        if (file !== null) {
            form.setValue('filename', file.name)
            getVerifyDocExist(file.name)
        }
    }

    const [openLinkDialog, setOpenLinkDialog] = useState<boolean>(false)



    return (
        <div className='h-full w-full'>
            {
                uploadDocLoading !== null
                    ? <div className='absolute flex justify-center items-center top-0 right-0 left-0 m-auto h-full w-full bg-black/30 backdrop-blur-sm z-30'>
                        <AiOutlineLoading3Quarters className="mr-2 h-72 w-52 animate-spin" />

                        <h1 className='absolute text-lg'>Subiendo {uploadDocLoading} %</h1>
                    </div>
                    : null
            }
            <Form {...form} >
                <form onSubmit={handleGeneralSubmit} className="h-full w-full flex flex-row gap-3">
                    <div className='flex flex-col gap-5 w-1/2'>
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }: any) => (
                                <FormItem className='flex flex-row justify-center items-center'>
                                    <FormLabel className='w-1/3'>Título del Archivo</FormLabel>
                                    <FormControl className='w-2/3'>
                                        <Input placeholder="Chancadora primaria" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            disabled={documentFile === null || tempFile === null ? true : false}
                            control={form.control}
                            name="filename"
                            render={({ field }: any) => (
                                <FormItem className='flex flex-row justify-center items-center'>
                                    <FormLabel className='w-1/3'>Nombre de Archivo</FormLabel>
                                    <FormControl className='w-2/3'>
                                        <Input placeholder="" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="author"
                            render={({ field }: any) => (
                                <FormItem className='flex flex-row justify-center items-center'>
                                    <FormLabel className='w-1/3'>Autor del Registro</FormLabel>
                                    <FormControl className='w-2/3'>
                                        <Input placeholder="Leandro Rodríguez" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {
                            form.watch('aux_module_id') !== 0 || (form.watch('aux_module_id') === 0 && id === null) ?
                                <FormField
                                    control={form.control}
                                    name="aux_module_id"
                                    render={({ field }: any) => (
                                        <FormItem className='flex flex-row justify-center items-center'>
                                            <FormLabel className='w-1/3'>Módulos</FormLabel>
                                            <FormControl className='w-2/3'>
                                                <ComboBoxModules data={modules} defaultValue={form.watch('aux_module_id')} title='Módulo' {...field} onChange={field.onChange} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                :
                                <div className='flex flex-row justify-center items-center'>
                                    <p className='w-1/3'>Tipos</p>
                                    <Skeleton className="w-2/3 h-[28px] rounded-md" />
                                </div>
                        }

                        {
                            form.watch('aux_discipline_id') !== 0 || (form.watch('aux_discipline_id') === 0 && id === null) ?
                                <FormField
                                    control={form.control}
                                    name="aux_discipline_id"
                                    render={({ field }: any) => (
                                        <FormItem className='flex flex-row justify-center items-center'>
                                            <FormLabel className='w-1/3'>Disciplinas</FormLabel>
                                            <FormControl className='w-2/3'>
                                                <ComboBoxModules data={disciplines} defaultValue={form.watch('aux_discipline_id')} title='Disciplina' {...field} onChange={field.onChange} />
                                                {/* <DropdownSelect dataArray={disciplines} title={'disciplina'} {...field} onChange={field.onChange} /> */}
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                /> : <div className='flex flex-row justify-center items-center'>
                                    <p className='w-1/3'>Tipos</p>
                                    <Skeleton className="w-2/3 h-[28px] rounded-md" />
                                </div>
                        }
                        {
                            form.watch('aux_type_id') !== 0 || (form.watch('aux_type_id') === 0 && id === null) ?
                                <FormField
                                    control={form.control}
                                    name="aux_type_id"
                                    render={({ field }: any) => (
                                        <FormItem className='flex flex-row justify-center items-center'>
                                            <FormLabel className='w-1/3'>Tipos</FormLabel>
                                            <FormControl className='w-2/3'>
                                                <ComboBoxModules data={types} defaultValue={form.watch('aux_type_id')} title='Tipo' {...field} onChange={field.onChange} />

                                                {/* <DropdownSelect dataArray={types} title={'tipo'} {...field} onChange={field.onChange} /> */}
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                /> : <div className='flex flex-row justify-center items-center'>
                                    <p className='w-1/3'>Tipos</p>
                                    <Skeleton className="w-2/3 h-[28px] rounded-md" />
                                </div>
                        }
                        <FormField
                            control={form.control}
                            name="confidential"
                            render={({ field }) => (
                                <FormItem className="flex flex-row justify-between items-center">
                                    <FormLabel className='w-1/3'>
                                        Confidencial
                                    </FormLabel>
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <div className='flex flex-row justify-between items-center'>
                            <h1>Vencimiento</h1>
                            <Checkbox checked={checkExpired.expired} onCheckedChange={(e: boolean) => {
                                setCheckExpired({
                                    ...checkExpired,
                                    expired: e
                                })
                            }} />
                        </div>

                        <div className={`transition-opacity  duration-700 ${checkExpired.expired ? 'opacity-100' : 'h-0 opacity-0 overflow-hidden'}`}>
                            <FormField
                                control={form.control}
                                name="date_expired"
                                render={({ field }: any) => (
                                    <FormItem className='flex flex-row justify-center items-center'>
                                        <FormLabel className='w-1/3'>Fecha de vencimiento</FormLabel>
                                        <FormControl className='w-2/3'>
                                            <Input placeholder="shadcn" {...field} type='date' value={field.value || ''} onChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="days_expired"
                                render={({ field }: any) => (
                                    <FormItem className='flex flex-row justify-center items-center'>
                                        <FormLabel className='w-1/3'>Días antes de vencimiento</FormLabel>
                                        <FormControl className='w-2/3'>
                                            <Input placeholder="shadcn" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='flex flex-row justify-center items-center'>
                            <h2 className='w-1/3'>Documento</h2>
                            {tempFile !== null ? <div className='w-2/3 flex flex-row justify-center items-center gap-3'>
                                <CheckCircle color='green' />
                                <h1>{tempFile?.filename}</h1>
                            </div> :
                                <div className='w-2/3'>
                                    <input
                                        defaultValue={''}
                                        className='hidden'
                                        type='file'
                                        id="dropzone-file"
                                        accept=".pdf"
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                            if (e.target.files != null) {
                                                setDocumentFile(e.target.files[0])
                                                settingFilename(e.target.files[0])
                                            }
                                        }}
                                    />

                                    <label style={{
                                        width: '100%',
                                        height: '110px',
                                        border: '2px dashed gray',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        fontSize: '18px',
                                        cursor: 'pointer'
                                    }}
                                        htmlFor="dropzone-file"
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            setDocumentFile(e.dataTransfer.files[0]);
                                            settingFilename(e.dataTransfer.files[0])
                                        }
                                        }
                                        onDragOver={(e) => { e.preventDefault() }}
                                    >
                                        {
                                            documentFile === null || documentFile === undefined
                                                ? <div className="flex flex-row gap-3 justify-center item-center">
                                                    <FaFile />
                                                    <p className="text-sm">
                                                        Arrastra un archivo PDF o sube desde tu
                                                        ordenador
                                                    </p>
                                                </div>
                                                : <h1>{documentFile?.name}</h1>
                                        }
                                    </label>
                                </div>
                            }
                            <FormMessage />
                        </div>
                    </div>
                    <div className='flex flex-col gap-5 w-1/2'>
                        <div className='flex flex-row justify-between items-center'>
                            <h1>Revisión Vendor</h1>
                            <Checkbox checked={checkExpired.vendor} onCheckedChange={(e: boolean) => {
                                setCheckExpired({
                                    ...checkExpired,
                                    vendor: e
                                })
                            }} />
                        </div>
                        <div className={`transition-all duration-500 border ${!checkExpired.vendor ? 'h-0 overflow-hidden' : 'h-1/3 overflow-auto'}`}>
                            <Form {...formVendor}>
                                <form onSubmit={handleGeneralSubmit} className='p-3 flex flex-col gap-2'>
                                    {/* <FormField
                                        control={formVendor.control}
                                        name="aux_status_vendor"
                                        render={({ field }: any) => (
                                            <FormItem className='flex flex-row justify-center items-center'>
                                                <FormLabel className='w-1/3'>Estado Vendor</FormLabel>
                                                <FormControl className='w-2/3'>
                                                    <ComboBoxModules data={statusVendor} title='Tipo' {...field} onChange={field.onChange} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    /> */}
                                    <FormField
                                        control={formVendor.control}
                                        name="aux_status_vendor"
                                        render={({ field }: any) =>
                                        (
                                            <FormItem className='flex flex-row justify-center items-center'>
                                                <FormLabel className='w-1/3'>Estado Vendor</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={String(field.value)} value={String(field.value)}>
                                                    <FormControl className='w-2/3'>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={statusVendor.find((obj: ModuleStructure) => { return obj })?.name} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {
                                                            statusVendor.map((obj: ModuleStructure) => {
                                                                return (
                                                                    <SelectItem key={obj.id} value={String(obj.id)}>{obj?.name}</SelectItem>
                                                                )
                                                            })
                                                        }
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={formVendor.control}
                                        name="code_vendor"
                                        render={({ field }: any) => (
                                            <FormItem className='flex flex-row justify-center items-center'>
                                                <FormLabel className='w-1/3'>Código Vendor</FormLabel>
                                                <FormControl className='w-2/3'>
                                                    <Input placeholder="A1-1" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={formVendor.control}
                                        name="revision_vendor"
                                        render={({ field }: any) => (
                                            <FormItem className='flex flex-row justify-center items-center'>
                                                <FormLabel className='w-1/3'>Revisión Vendor</FormLabel>
                                                <FormControl className='w-2/3'>
                                                    <Input placeholder="2" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={formVendor.control}
                                        name="rev_vendor_by"
                                        render={({ field }: any) => (
                                            <FormItem className='flex flex-row justify-center items-center'>
                                                <FormLabel className='w-1/3'>Revisión Vendor by</FormLabel>
                                                <FormControl className='w-2/3'>
                                                    <Input placeholder="Joan Travis" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </form>
                            </Form>
                        </div>

                        <div className='flex flex-row justify-between items-center'>
                            <h1>Revisión Cliente</h1>
                            <Checkbox checked={checkExpired.client} onCheckedChange={(e: boolean) => {
                                setCheckExpired({
                                    ...checkExpired,
                                    client: e
                                })
                            }} />
                        </div>
                        <div className={`transition-all duration-500 border ${!checkExpired.client ? 'h-0 overflow-hidden' : 'h-2/3 overflow-auto'}`}>
                            <Form {...formClient}>
                                <form onSubmit={handleGeneralSubmit} className='p-3 flex flex-col gap-2'>
                                    <FormField
                                        control={formClient.control}
                                        name="aux_status_client"
                                        render={({ field }: any) =>
                                        (
                                            <FormItem className='flex flex-row justify-center items-center'>
                                                <FormLabel className='w-1/3'>Estado Cliente</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={String(field.value)} value={String(field.value)}>
                                                    <FormControl className='w-2/3'>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={statusClient.find((obj: ModuleStructure) => { return obj })?.name} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {
                                                            statusClient.map((obj: ModuleStructure) => {
                                                                return (
                                                                    <SelectItem key={obj.id} value={String(obj.id)}>{obj?.name}</SelectItem>
                                                                )
                                                            })
                                                        }
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={formClient.control}
                                        name="code_client"
                                        render={({ field }: any) => (
                                            <FormItem className='flex flex-row justify-center items-center'>
                                                <FormLabel className='w-1/3'>Código de Cliente</FormLabel>
                                                <FormControl className='w-2/3'>
                                                    <Input placeholder="A0" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={formClient.control}
                                        name="revision_client"
                                        render={({ field }: any) => (
                                            <FormItem className='flex flex-row justify-center items-center'>
                                                <FormLabel className='w-1/3'>Revisión Cliente</FormLabel>
                                                <FormControl className='w-2/3'>
                                                    <Input placeholder="1" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={formClient.control}
                                        name="revision_client_alt"
                                        render={({ field }: any) => (
                                            <FormItem className='flex flex-row justify-center items-center'>
                                                <FormLabel className='w-1/3'>Revisión Cliente Alternativo</FormLabel>
                                                <FormControl className='w-2/3'>
                                                    <Input placeholder="B1" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={formClient.control}
                                        name="revision_client_by"
                                        render={({ field }: any) => (
                                            <FormItem className='flex flex-row justify-center items-center'>
                                                <FormLabel className='w-1/3'>Revisión Cliente por</FormLabel>
                                                <FormControl className='w-2/3'>
                                                    <Input placeholder="Tania Carrasco" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={formClient.control}
                                        name="po_contract"
                                        render={({ field }: any) => (
                                            <FormItem className='flex flex-row justify-center items-center'>
                                                <FormLabel className='w-1/3'>PO Contrato</FormLabel>
                                                <FormControl className='w-2/3'>
                                                    <Input placeholder="PO" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </form>
                            </Form>
                        </div>
                        <div className='flex flex-row justify-between items-center'>
                            <h1>Referencias</h1>
                            <Button type='button' onClick={() => setOpenLinkDialog(true)} className='flex flex-row w-48 justify-center items-center gap-2' variant={'default'} size={'icon'}>
                                <FaLink size={20} />
                                <p>Referenciar documento</p>
                            </Button>
                            <LinkDocumentDialog operationType={id === null ? 'create' : 'edit'} setReferenceObject={setReferenceObject} setOpen={setOpenLinkDialog} open={openLinkDialog} idDocument={id} />
                        </div>
                        {
                            referenceObject.equipmentsReferences.length != 0 || referenceObject.areasReferences.length != 0 || referenceObject.documentsReferences.length != 0 ? null : 
                            <p className='text-center animate-pulse text-red-500 text-lg'>Atención: No está referenciando el documento con algún equipo | área | documento</p>
                        }
                        {/* <div className='flex flex-row gap-3 justify-center items-center mt-5'>
                            <Button className='w-32' type="submit">Crear documento</Button>
                            <Button className='w-32' type='button' onClick={() => router.replace('/admin/documents')}>Cancelar</Button>
                        </div> */}
                        <div className='flex flex-row justify-end items-center gap-3 w-full'>
                            <Button disabled={disableSaveDocExist || sendingFile} onClick={() => { handleGeneralSubmit() }} className='w-1/5' type="button" variant="secondary" >
                                Guardar
                            </Button>
                            <Button onClick={() => { setDialogOpen(false) }} className='w-1/5' type="button" variant="secondary">
                                Cerrar
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>

        </div>
    )
}
