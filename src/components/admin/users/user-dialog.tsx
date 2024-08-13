import React, { useEffect, useState } from 'react'
import { z } from 'zod'
import {
    Dialog,
    DialogClose,
    DialogContent,

    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getGroups, getUserById, postUser, putUserById } from '@/api/admin/users-api'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { useSession } from 'next-auth/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import Spinner from '@/components/ui/spinner'

interface UserDialogStructure {
    id: number | null
    dialogOpen: boolean
    setDialogOpen: (value: boolean) => void
}

export default function UserDialog({ id, dialogOpen, setDialogOpen }: UserDialogStructure) {
    const FormUserSchema = z.object({
        code: z.string().min(2, {
            message: 'El nombre debe ser más largo'
        }),
        // role: z.string(),
        name: z.string().min(1, {
            message: 'El campo no debe estar vacío'
        }),
        last_name: z.string().min(1, {
            message: 'El campo no debe estar vacío'
        }),
        username: z.string().min(1, {
            message: 'El campo no debe estar vacío'
        }),
        dui: z.string().min(8, {
            message: 'La longitud del campo debe ser mayor a 8 caracteres'
        }).max(8, {
            message: 'La longitud del campo debe ser menor a 8 caracteres'
        }),
        short_name: z.string().min(1, {
            message: 'El campo no debe estar vacío'
        }),
        position: z.string().min(1, {
            message: 'El campo no debe estar vacío'
        }),
        email: z.string().email({
            message: 'Debe ingresar un email válido'
        }),
        // password: z.string().min(4)
        groups: z.array(z.any()).optional(),
        password: z.string().optional()
    })
    const formUser = useForm<z.infer<typeof FormUserSchema>>({
        resolver: zodResolver(FormUserSchema),
        defaultValues: {
            code: '',
            // role: '',
            name: '',
            last_name: '',
            username: '',
            dui: '',
            short_name: '',
            position: '',
            email: '',
            password: '',
            groups: []
        }
    })

    const resetFields = () => {
        formUser.reset()
    }
    const [userPassword, setUserPassword] = useState<string>('')
    const [tabSelection, setTabSelection] = useState<string>('')
    const [myGroups, setMyGroups] = useState<any[] | null>(null)

    const getUser = async () => {
        const responseGroups = await getGroups()
        // console.log(response.data.data)
        const rptaChanged = responseGroups.data.data.map((obj: any) => {
            return {
                ...obj,
                isChecked: false
            }
        })

        if (id !== null) {
            try {
                const rpta = await getUserById(id)
                const response = rpta.data.data
                formUser.setValue('code', response.code)
                // formUser.setValue('role', response.role)
                formUser.setValue('name', response.name)
                formUser.setValue('last_name', response.last_name)
                formUser.setValue('username', response.username)
                formUser.setValue('dui', response.dui)
                formUser.setValue('short_name', response.short_name)
                formUser.setValue('position', response.position)
                formUser.setValue('email', response.email)
                formUser.setValue('groups', response.groups)

                const convertedGroup = responseGroups.data.data?.map((obj: any) => {
                    const founded = (formUser.watch('groups'))?.find((g: any) => g === obj.id)
                    if (founded !== undefined) {
                        return {
                            ...obj,
                            isChecked: true
                        }
                    } else {
                        return obj
                    }
                })

                setMyGroups(convertedGroup as [])
            } catch (error) {
                console.log(error)

                throw new Error('Error in dialog-user-getUser')
            }
        } else {
            setMyGroups(rptaChanged as [])
        }
    }

    useEffect(() => {
        if (dialogOpen) {
            getUser()
        }
    }, [id, dialogOpen])

    const router = useRouter()
    const { toast } = useToast()
    const handleSubmit = async (data: z.infer<typeof FormUserSchema>) => {
        console.log('AQUIII')

        if (id === null) {
            try {
                const response = await postUser(data)
                if (response.status === 201) {
                    router.refresh()
                    setDialogOpen(false)
                    toast({
                        duration: 3000,
                        variant: 'default',
                        title: 'Creación',
                        description: 'Usuario creado correctamente'
                    })
                    formUser.reset()
                }
            } catch (error: any) {
                console.log(error.response)

                toast({
                    duration: 3000,
                    variant: 'destructive',
                    title: 'Error',
                    description: error.response.data.message.map((obj: any, index: number) => {
                        return (
                            <p key={index}>- {obj.detail}</p>
                        )
                    }) || 'Ocurrió un error, no se pudo crear el usuario'
                })
                throw new Error('Error in dialog-user-create')
            }
        } else {
            try {
                if (id !== null) {
                    const response = await putUserById(id, data)
                    if (response.status === 200) {
                        // router.refresh()
                        router.refresh()
                        // router.push('/admin/users')
                        setDialogOpen(false)
                        toast({
                            duration: 3000,
                            variant: 'default',
                            title: 'Edición',
                            description: 'Usuario editado correctamente'
                        })
                    }
                }
            } catch (error: any) {
                toast({
                    duration: 3000,
                    variant: 'destructive',
                    title: 'Error',
                    description: error?.response?.data?.message.map((obj: any, index: number) => {
                        return (
                            <p key={index}>- {obj.detail}</p>
                        )
                    }) || 'Ocurrió un error, no se pudo crear el usuario'
                })
                throw new Error('Error in dialog-user-edit')
            }
        }
    }
    const handleSubmitPass = async () => {
        try {
            if (id !== null) {
                const response = await putUserById(id, { password: userPassword })
                if (response.status === 200) {
                    toast({
                        duration: 3000,
                        variant: 'default',
                        title: 'Edición',
                        description: 'Contraseña editada correctamente'
                    })
                }
                // console.log(response)
            }
        } catch (error) {
            throw new Error('Error in dialog-user-edit-passs')
        }
    }

    const handleChangeCheckbox = (checked: boolean, grup: any) => {
        if (checked) {
            setMyGroups((prev: any) => prev.map((obj: any) => {
                if (obj.id === grup.id) {
                    return {
                        ...obj,
                        isChecked: true
                    }
                } else {
                    return obj
                }
            }))
            formUser.setValue('groups', [...formUser.getValues('groups') as [], grup.id])
            // setFormUser({
            //   ...formUser,
            //   groups: [...formUser.groups, grup.id]
            // })
        } else {
            setMyGroups((prev: any) => prev.map((obj: any) => {
                if (obj.id === grup.id) {
                    return {
                        ...obj,
                        isChecked: false
                    }
                } else {
                    return obj
                }
            }))
            formUser.setValue('groups', [...formUser.getValues('groups')?.filter((obj) => obj !== grup.id) as []])

            // setFormUser({
            //   ...formUser,
            //   groups: [...formUser.groups.filter((obj) => obj !== grup.id)]
            // })
            // setSelectedGroups((prev)=>prev.filter((obj)=>obj!==grup.id))
        }
    }
    const { data: session } = useSession()

    const encontre = session?.user.groups.find((obj: any) => obj === 1 || obj === 3)

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="max-h-[95vh] overflow-auto" onPointerDownOutside={(e) => { e.preventDefault() }}>
                <Tabs onValueChange={(e: string) => { setTabSelection(e) }} defaultValue="account" className="w-[full]">
                    <DialogHeader>
                        <TabsList className={`flex flex-row flex-wrap h-full justify-start items-center gap-3 ${id === null ? 'w-1/4' : 'w-7/12'}`}>
                            <TabsTrigger value="edit-all">{id === null ? 'Crear usuario' : 'Editar usuario'}</TabsTrigger>
                            {id === null ? null : <TabsTrigger value="edit-password">Editar Password</TabsTrigger>}
                        </TabsList>
                        <Separator />
                    </DialogHeader>
                    <TabsContent value="edit-all">
                        <Form {...formUser}>

                            <form onSubmit={formUser.handleSubmit(handleSubmit)} className="w-full">
                                <FormField
                                    control={formUser.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem className='flex flex-row justify-center items-center'>
                                            <FormLabel className='w-1/3'>Código</FormLabel>
                                            <FormControl>
                                                <Input placeholder="AUT-001" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {
                                    encontre !== undefined
                                        // eslint-disable-next-line multiline-ternary
                                        ? <div className="flex flex-row w-full my-2 mb-0">
                                            {/* <div className=""> */}
                                            <Label className='w-1/4'>Grupos:</Label>
                                            {/* </div> */}
                                            <div className="h-24 w-3/4 overflow-auto border rounded">
                                                {
                                                    myGroups?.map((obj) => {
                                                        return (
                                                            <li key={obj.id} className="flex items-center gap-2 text-sm m-1 mx-3">
                                                                <Checkbox checked={obj.isChecked} onCheckedChange={(val: boolean) => { handleChangeCheckbox(val, obj) }} />
                                                                - {obj.name}
                                                            </li>
                                                        )
                                                    }) ?? <div className='flex h-full justify-center items-center'>
                                                        <Spinner />
                                                    </div>
                                                }
                                            </div>
                                        </div> : null
                                }
                                <FormField
                                    control={formUser.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className='flex flex-row justify-center items-center'>
                                            <FormLabel className='w-1/3'>Nombre</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Pedro" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={formUser.control}
                                    name="last_name"
                                    render={({ field }) => (
                                        <FormItem className='flex flex-row justify-center items-center'>
                                            <FormLabel className='w-1/3'>Apellido</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Parker" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={formUser.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem className='flex flex-row justify-center items-center'>
                                            <FormLabel className='w-1/3'>Nombre de usuario</FormLabel>
                                            <FormControl>
                                                <Input placeholder="PedroParker" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={formUser.control}
                                    name="dui"
                                    render={({ field }) => (
                                        <FormItem className='flex flex-row justify-center items-center'>
                                            <FormLabel className='w-1/3'>DNI</FormLabel>
                                            <FormControl>
                                                <Input placeholder="95175841" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={formUser.control}
                                    name="short_name"
                                    render={({ field }) => (
                                        <FormItem className='flex flex-row justify-center items-center'>
                                            <FormLabel className='w-1/3'>Nombre corto</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Sr. Parker" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={formUser.control}
                                    name="position"
                                    render={({ field }) => (
                                        <FormItem className='flex flex-row justify-center items-center'>
                                            <FormLabel className='w-1/3'>Position</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Supervisor" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={formUser.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className='flex flex-row justify-center items-center'>
                                            <FormLabel className='w-1/3'>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="pparker@gmail.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {
                                    id === null
                                        ? <FormField
                                            control={formUser.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem className='flex flex-row justify-center items-center'>
                                                    <FormLabel className='w-1/3'>Password</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="*******" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        : null
                                }

                                <div className='flex flex-row gap-5 justify-end items-center mt-5'>
                                    <Button type="submit">Guardar</Button>
                                    <DialogClose asChild>
                                        <Button onClick={() => { resetFields() }} type="button">Cerrar</Button>
                                    </DialogClose>
                                </div>
                            </form>
                        </Form>
                    </TabsContent>
                    <TabsContent value="edit-password">
                        <div className="flex flex-col justify-center items-start gap-3 mb-4">
                            <Label htmlFor="pass">Password</Label>
                            <Input type="text" id="pass" placeholder="*****" onChange={(e) => {
                                setUserPassword(e.target.value)
                            }} />
                        </div>
                        <div className='flex flex-row items-center justify-end gap-3'>
                            <Button onClick={async () => { await handleSubmitPass() }} type="button">Guardar</Button>
                            <DialogClose asChild>
                                <Button onClick={() => { resetFields() }} type="button">Cerrar</Button>
                            </DialogClose>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
