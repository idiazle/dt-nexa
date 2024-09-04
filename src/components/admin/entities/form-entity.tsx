'use client'
import React, { type ChangeEvent, useEffect, useState, type SetStateAction } from 'react'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FaEye, FaEyeSlash, FaFileImage } from 'react-icons/fa6'
import Image from 'next/image'
import { getEntities, getEntityById, postEntity, putEntity } from '@/api/admin/entities-api'
import { type EntityStructure } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { useSession } from 'next-auth/react'

interface FormEntityStructure {
    setDialogOpen: (value: boolean) => void
    id: number | null
}

export default function FormEntity({ setDialogOpen, id }: FormEntityStructure) {

    const {data:session} = useSession()
    const [gerencies, setGerencies] = useState<EntityStructure[]>([])

    const getGerencies = async () => {
        const response = await getEntities()
        if (response.status === 200) {
            // console.log('RESPONSE', response.data.data)
            const _gerencies = response.data.data.filter((obj: EntityStructure) => obj.type === 4)
            setGerencies(_gerencies)
        }
    }
    useEffect(() => {
        getGerencies()
    }, [])

    const router = useRouter()
    const formSchema = z.object({
        type: z.string().nullable(),
        code: z.string().min(2, {
            message: 'Ingrese un código correcto'
        }).nullable(),
        name: z.string().min(2, {
            message: 'El nombre debe ser más descriptivo'
        }),
        user_id: z.number(),
        parent_id: z.any().nullable(),
        // image: z.instanceof(File).nullable(),
        image: z.instanceof(File).nullable(),
        description: z.string().nullable()

    })
    // console.log('MY PARENT ID', String(parentId))

    const formEntity = useForm<z.infer<typeof formSchema>>({
        reValidateMode: 'onChange',
        resolver: zodResolver(formSchema),
        defaultValues: {
            type: '4',
            code: '',
            name: '',
            user_id:  Number(session?.user.id),
            parent_id: null,
            image: null,
            description: ''
        }
    })

    // console.log(formEntity.watch())
    const [myParent, setMyParent] = useState<string | null>(null)
    const [image, setImage] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const getEntityInfo = async () => {
        if (id !== null) {
            const response = await getEntityById(id)
            if (response.status === 200) {
                const dataEntity = response.data.data
                formEntity.setValue('type', String(dataEntity.type))
                formEntity.setValue('code', dataEntity.code)
                formEntity.setValue('name', dataEntity.name)
                // formEntity.setValue('user_id', dataEntity.type as string)
                setMyParent(String(dataEntity.parent_id))
                formEntity.setValue('parent_id', dataEntity.parent_id !== null ? String(dataEntity.parent_id) : null)
                // if (String(dataEntity.parent) !== null && String(dataEntity.parent) !== '') {
                //   formEntity.setValue('parent_id', null)
                // } else {
                //   formEntity.setValue('parent_id', null)
                // }
                if (dataEntity.image !== null && dataEntity.image !== '' && dataEntity.image !== undefined) {
                    // formEntity.setValue('image', dataEntity.image as string)
                    setImage(dataEntity.image)
                } else {
                    formEntity.setValue('image', null)
                }
                formEntity.setValue('description', dataEntity.description)
            }
        }
        // console.log('THIS IS MY FORM ENTITY', formEntity.watch())
    }

    useEffect(() => {
        if (id !== null) {
            getEntityInfo()
        }
    }, [])

    
    useEffect(() => {
        if (formEntity.watch('type') === '5' && formEntity.watch('parent_id') === null) {
            formEntity.setError('parent_id', {
                type: 'required',
                message: 'Al ser un área, primero debe seleccionar la planta a la que pertenece'
            })
        }else{
            formEntity.clearErrors('parent_id')
        }
    }, [formEntity.watch('type'), formEntity.watch('parent_id')])

    const { toast } = useToast()
    // console.log(formEntity.watch())
    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        setLoading(true)
        const formData = new FormData()
        formData.append('name', data.name ?? '')
        formData.append('code', data.code ?? '')
        formData.append('type', data.type ?? '')
        formData.append('user_id', data.user_id.toString() ?? '')
        formData.append('description', data.description ?? '')
        if (data.parent_id !== null) {
            formData.append('parent_id', data?.parent_id.toString() ?? '')
        }
        if (data.image !== null && data.image !== undefined) {
            formData.append('image', data.image)
        }

        try {
            if (id === null) {
                const response = await postEntity(formData)
                if (response.status === 201) {
                    router.refresh()
                    setDialogOpen(false)
                    setLoading(false)
                    toast({
                        duration: 3000,
                        variant: 'default',
                        title: 'Creación',
                        description: 'Entidad creada correctamente'
                    })
                }
            } else {
                const response = await putEntity(id, formData)
                if (response.status === 200) {
                    router.refresh()
                    setDialogOpen(false)
                    setLoading(false)
                    toast({
                        duration: 3000,
                        variant: 'default',
                        title: 'Edición',
                        description: 'Entidad editada correctamente'
                    })
                }
            }
        } catch (error) {
            setLoading(false)
            toast({
                duration: 3000,
                variant: 'destructive',
                title: 'Error',
                description: 'Ocurrió un error, no se pudo guardar la entidad'
            })
            throw new Error('ERROR IN form-entity Component')
        }
        // toast({
        //   title: 'You submitted the following values:',
        //   description: (
        //       <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        //         <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        //       </pre>
        //   )
        // })
    }
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const settingImage = (file: File) => {
        if (file != null) {
            formEntity.setValue('image', file)
            const urlImage = URL.createObjectURL(file)
            setImagePreview(urlImage)
        }
    }

    const [showImage, setShowImage] = useState<boolean>(false)
    return (
        <Form {...formEntity}>
            <form onSubmit={formEntity.handleSubmit(handleSubmit)} className="h-full w-full flex flex-col gap-3">
                <FormField
                    control={formEntity.control}
                    name="type"
                    render={({ field }: any) => (
                        <FormItem className='w-full'>
                            <FormLabel>Tipo de Entidad</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione la Entidad" />
                                    </SelectTrigger>
                                    <SelectContent >
                                        {/* <SelectGroup> */}
                                        <SelectItem value={String(4)}>Gerencia/Planta</SelectItem>
                                        <SelectItem value={String(5)}>Área</SelectItem>
                                        {/* </SelectGroup> */}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {
                    formEntity.getValues('type') === '5'
                        ? <FormField
                            control={formEntity.control}
                            name="parent_id"
                            render={({ field }: any) =>

                            (
                                <FormItem>
                                    <FormLabel>Seleccione la planta a la que pertenece</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={String(field.value)} value={String(field.value)}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={gerencies.find((obj: EntityStructure) => { return obj })?.name} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                gerencies.map((obj: EntityStructure) => {
                                                    return (
                                                        <SelectItem key={obj.id} value={String(obj.id)}>{obj.name}</SelectItem>
                                                    )
                                                })
                                            }
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        : null
                }

                <FormField
                    control={formEntity.control}
                    name="name"
                    render={({ field }: any) => (
                        <FormItem className='w-full'>
                            <FormLabel>Nombre de la Entidad</FormLabel>
                            <FormControl>
                                <Input placeholder="Chancadora primaria" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={formEntity.control}
                    name="code"
                    render={({ field }: any) => (
                        <FormItem className='w-full'>
                            <FormLabel>Código de la Entidad</FormLabel>
                            <FormControl>
                                <Input placeholder="01-00" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={formEntity.control}
                    name="description"
                    render={({ field }: any) => (
                        <FormItem className='w-full'>
                            <FormLabel>Descripción de la Entidad</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Descripción" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex flex-col my-3">
                    <div className="w-full flex flex-row justify-between items-center">
                        <p>Imagen:</p>
                        {
                            !showImage
                                ? <FaEyeSlash className='hover:cursor-pointer' size={22} onClick={() => { setShowImage(true) }} />
                                : <FaEye className='hover:cursor-pointer' size={22} onClick={() => { setShowImage(false) }} />
                        }
                    </div>
                    <div className="w-full flex flex-row justify-center items-center gap-4">
                        <input
                            className="hidden"
                            type="file"
                            id="dropzone-file-img-entity"
                            accept=".png"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                if (e.target.files != null) {
                                    settingImage(e.target.files[0])
                                }
                            }}
                        />
                        <label
                            style={{
                                width: '100%',
                                height: '100px',
                                border: '2px dashed gray',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: '20px',
                                fontSize: '18px',
                                cursor: 'pointer'
                            }}
                            htmlFor="dropzone-file-img-entity"

                        >

                            <div className={'flex flex-row gap-2 justify-center item-center p-2'}>
                                <FaFileImage />
                                <p className="text-sm">
                                    {
                                        ((formEntity.watch('image')?.name) !== '') ? formEntity.watch('image')?.name : 'Seleccione la imagen o arrastrela al cuadro'
                                    }
                                </p>
                            </div>

                        </label>

                        <div className={`mt-3 transition-all duration-500 w-full flex justify-center items-center ${showImage ? 'h-0 w-0 overflow-hidden' : 'h-full w-full'}`}>
                            {
                                imagePreview !== null
                                    ? <Image
                                        className='border rounded-lg p-1'
                                        alt='awdwd'
                                        width={150}
                                        height={150}
                                        src={imagePreview}
                                    />
                                    : image && <Image
                                        className='border rounded-lg p-1'
                                        alt='image_render'
                                        width={150}
                                        height={150}
                                        src={image}
                                    />
                            }
                        </div>
                    </div>
                </div>
                <Button disabled={formEntity.watch('type') === '5' && formEntity.watch('parent_id') === null} type="submit">{id === null ? 'Crear' : 'Editar'}</Button>
            </form>
            {
                loading
                    ? <p>Cargando pe compare</p>
                    : null
            }

        </Form>
    )
}
