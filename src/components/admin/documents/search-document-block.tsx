import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn, EntityStructure, ModuleStructure, OneAuxStructure, SearchInput } from '@/lib/utils'
import { getEntities } from '@/api/admin/entities-api'
import { getAllAuxList, getOptionsById, getSearchDocuments } from '@/api/admin/documents-api'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { CheckIcon, ChevronsUpDown } from 'lucide-react'
import { FaMagnifyingGlass, FaArrowRotateRight } from 'react-icons/fa6'
import { useSession } from 'next-auth/react'
import { MdOutlineCloseFullscreen } from "react-icons/md";

interface SearchDocumentBlockStruc {
    setPagination: (value: any) => void
    setMyData: (value: any) => void
    setShow: (value: any) => void
}
export default function SearchDocumentBlock({ setPagination, setMyData, setShow }: SearchDocumentBlockStruc) {

    const { data: session } = useSession()

    const initialStateSearch = {
        title: '',
        filename: '',
        author: '',
        tag: '',
        entity: '',
        discipline: '',
        module: '',
        type: '',
        confidential: '',
        date_doc: '',
        date_load: '',
        date_expired: '',
        days_expired: '',
        status_vendor: '',
        code_vendor: '',
        revision_vendor: '',
        rev_vendor_by: '',
        status_client: '',
        code_client: '',
        revision_client: '',
        rev_client_by: '',
        rev_client_alt: '',
        po_contract: ''
    }

    const [searchObject, setSearchObject] = useState<SearchInput>(initialStateSearch)
    const handleInputs = (e: React.FormEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement // Aserción de tipo aquí
        setSearchObject({
            ...searchObject,
            [target.name]: target.value
        })
    }

    const [modules, setModules] = useState<OneAuxStructure[] | null>(null)
    const [disciplines, setDisciplines] = useState<OneAuxStructure[] | null>(null)
    const [types, setTypes] = useState<OneAuxStructure[] | null>(null)
    const [statusVendor, setStatusVendor] = useState<ModuleStructure[]>([])
    const [statusClient, setStatusClient] = useState<ModuleStructure[]>([])

    const removeDuplicates = (data: any) => {
        const nombresSet = new Set(data.map((tipo: any) => tipo.name.trim()))
        const tiposUnicos = Array.from(nombresSet).reduce((acc: any, nombre: any) => {
            const tiposConNombre = data.filter((tipo: any) => tipo.name.trim() === nombre.trim())
            const ids = tiposConNombre.map((tipo: any) => tipo.id)
            const tipoUnico = {
                id: ids,
                name: nombre
            }
            // Agregar el objeto al acumulador
            acc.push(tipoUnico)
            return acc
        }, [])
        return tiposUnicos
    }

    const [areasPlantas, setAreasPlantas] = useState<EntityStructure[] | null>(null)

    const getDocsAux = async () => {
        // console.log("ENTRANDo");

        try {
            const response = await getEntities()
            const temResEnt = [...response.data.data, {
                id: 0,
                image: null,
                description: null,
                active: false,
                name: 'Sin filtros',
                code: '',
                type: 5,
                blocked: false,
                parent_id: null,
                user_id: Number(session?.user.id),
                deleted: false,
                plan_image: null,
                children: []
            }]
            setAreasPlantas(temResEnt)
        } catch (error) {
            throw new Error('Error obteniendo entidades')
        }

        try {
            const rpta = await getAllAuxList()
            const modules = removeDuplicates(rpta.data.data.modules)
            const modulesTemp = [...modules as [], {
                id: 0,
                name: 'Sin filtros',
                code: '',
                initials: '',
                icon_url: 'http://127.0.0.1:7000/',
                parent: 1
            }].sort((function (a: OneAuxStructure, b: OneAuxStructure) {
                return a.id - b.id
            }))
            const disciplines = removeDuplicates(rpta.data.data.disciplines)
            const disciplinesTemp = [...disciplines as [], {
                id: 0,
                name: 'Sin filtros',
                code: '',
                initials: '',
                icon_url: 'http://127.0.0.1:7000/',
                parent: 1
            }].sort((function (a: OneAuxStructure, b: OneAuxStructure) {
                return a.id - b.id
            }))
            const typees = removeDuplicates(rpta.data.data.types)
            const typesTemp = [...typees as [], {
                id: 0,
                name: 'Sin filtros',
                code: '',
                initials: '',
                icon_url: 'http://127.0.0.1:7000/',
                parent: 1
            }].sort((function (a: OneAuxStructure, b: OneAuxStructure) {
                return a.id - b.id
            }))

            setModules(modulesTemp)
            setDisciplines(disciplinesTemp)
            setTypes(typesTemp)
        } catch (error: any) {
            // throw new OwnExpTokenError('Token vencido, se redirigirá al login', 401)
            // if (error?.status === 401) {
            //     await signOut({ callbackUrl: '/auth/login' })
            // }
            // throw new Error('Error al obtener Documentos auxiliares')
        }
        try {
            const resModules = await getOptionsById({ ids: '4' })
            if (resModules.status === 200) {
                setStatusVendor(resModules.data.data as ModuleStructure[])
            }
        } catch (error) {
            throw new Error('error GAA')
        }
        try {
            const resModules = await getOptionsById({ ids: '5' })
            if (resModules.status === 200) {
                setStatusClient(resModules.data.data as ModuleStructure[])
            }
        } catch (error) {
            throw new Error('error GAA')
        }
    }

    useEffect(() => {
        getDocsAux()
    }, [])

    const inputGroup = [
        { id: 1, name: 'title', label: 'Título', type: 'text', value: searchObject.title },
        { id: 2, name: 'filename', label: 'Nombre de Archivo', type: 'text', value: searchObject.filename },
        { id: 3, name: 'author', label: 'Autor', type: 'text', value: searchObject.author },
        { id: 4, name: 'tag', label: 'Tag', type: 'text', value: searchObject.tag },
        // { id: 4, name: 'discipline', label: 'Disciplina', type: 'text' },
        // { id: 5, name: 'module', label: 'Módulo', type: 'text' },
        // { id: 6, name: 'type', label: 'Tipo', type: 'text' },
        // { id: 7, name: 'confidential', label: 'Confidencial', type: 'text' },
        // { id: 8, name: 'date_doc', label: 'Fecha del Documento', type: 'text' },
        // { id: 9, name: 'date_load', label: 'Fecha de Carga', type: 'text' },
        // { id: 10, name: 'date_expired', label: 'Fecha de Expiración', type: 'text' },
        // { id: 11, name: 'days_expired', label: 'Días para Expirar', type: 'text' },
        // { id: 12, name: 'status_vendor', label: 'Estado del Vendedor', type: 'text' },
        { id: 5, name: 'code_vendor', label: 'Código del Vendedor', type: 'text', value: searchObject.code_vendor },
        { id: 6, name: 'revision_vendor', label: 'Revisión del Vendedor', type: 'text', value: searchObject.revision_vendor },
        { id: 7, name: 'rev_vendor_by', label: 'Revisado por el Vendedor', type: 'text', value: searchObject.rev_vendor_by },
        // { id: 7, name: 'status_client', label: 'Estado del Cliente', type: 'text' }
        { id: 8, name: 'code_client', label: 'Código del Cliente', type: 'text', value: searchObject.code_client },
        { id: 9, name: 'revision_client', label: 'Revisión del Cliente', type: 'text', value: searchObject.revision_client },
        { id: 10, name: 'rev_client_by', label: 'Revisado por el Cliente', type: 'text', value: searchObject.rev_client_by },
        { id: 11, name: 'rev_client_alt', label: 'Revisión Alternativa del Cliente', type: 'text', value: searchObject.rev_client_alt },
        { id: 12, name: 'po_contract', label: 'Contrato o Pedido', type: 'text', value: searchObject.po_contract }
    ]
    const [openEntities, setOpenEntities] = useState<boolean>(false)
    const [open, setOpen] = useState<boolean>(false)
    const [openDisciplines, setOpenDisciplines] = useState<boolean>(false)
    const [openTypes, setOpenTypes] = useState<boolean>(false)

    const [valueEntity, setValueEntity] = useState<EntityStructure | null>(null)
    const [value, setValue] = useState<{
        module: any
        discipline: any
        type: any
    }>({
        module: '',
        discipline: '',
        type: ''
    })
    const [valueDiscipline, setValueDiscipline] = useState<{
        module: any
        discipline: any
        type: any
    }>({
        module: '',
        discipline: '',
        type: ''
    })
    const [valueType, setValueType] = useState<{
        module: any
        discipline: any
        type: any
    }>({
        module: '',
        discipline: '',
        type: ''
    })

    const habdleChange = (e: OneAuxStructure | EntityStructure, selOption: string) => {
        // console.log(e)
        switch (selOption) {
            case 'entities':
                if (e.id === 0) {
                    setSearchObject({
                        ...searchObject,
                        entity: ''
                    })
                } else {
                    setSearchObject({
                        ...searchObject,
                        entity: String(e.id)
                    })
                }
                break
            case 'module':
                if (e.id === 0) {
                    setSearchObject({
                        ...searchObject,
                        module: ''
                    })
                } else {
                    setSearchObject({
                        ...searchObject,
                        module: String(e.id)
                    })
                }
                break
            case 'discipline':
                if (e.id === 0) {
                    setSearchObject({
                        ...searchObject,
                        discipline: ''
                    })
                } else {
                    setSearchObject({
                        ...searchObject,
                        discipline: String(e.id)
                    })
                }
                break
            case 'type':
                if (e.id === 0) {
                    setSearchObject({
                        ...searchObject,
                        type: ''
                    })
                } else {
                    setSearchObject({
                        ...searchObject,
                        type: String(e.id)
                    })
                }
                break
            default:
                break
        }
    }

    const sendSearch = async () => {
        const query = await getSearchDocuments(1, searchObject)
        if (query.status === 200) {
            setMyData(query.data.results)
            setPagination((prevstate: any) => {
                return {
                    ...prevstate,
                    pageIndex: 1,
                    pageSize: query.data.total_pages,
                    rowsPerPage: query.data.rows_quantity,
                    totalDocuments: query.data.count,
                    paginationType: 'search',
                    searchDocuments: searchObject
                }
            })
        }
    }

    console.log("MY SEARCH OBJECT", searchObject);


    return (
        <div className='h-full w-full mt-5'>
            <div className=" h-full w-full">
                <div className='relative flex flex-col gap-3'>
                    <div className='flex flex-row flex-wrap gap-2 transition-all'>
                        {
                            inputGroup.filter((objM: any) => objM.id < 5).map((obj: any) => {
                                return (
                                    <div key={obj.id} className="grid w-full max-w-xs items-center gap-2 mb-5">
                                        <Label htmlFor={obj.name}>{obj.label}</Label>
                                        <Input value={obj.value} onChange={handleInputs} id={obj.name} type={obj.type} name={obj.name} placeholder={'Ingrese ' + obj.label} />
                                    </div>
                                )
                            })
                        }
                        <div className="grid w-full max-w-xs items-center gap-2 mb-5">
                            <Label htmlFor='dwak'>Plantas/Áreas</Label>
                            <Popover open={openEntities} onOpenChange={setOpenEntities}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openEntities}
                                        className="w-full justify-between"
                                    >
                                        {(valueEntity !== null)
                                            ? areasPlantas?.find((framework) => framework.name === valueEntity?.name)?.name
                                            : 'Seleccione el área o planta'}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="PopoverContent overflow-auto">
                                    <Command>
                                        <CommandInput placeholder={'Buscar a...'} />
                                        <CommandList>
                                            <CommandEmpty>No se encontró a.</CommandEmpty>
                                            <CommandGroup>
                                                {areasPlantas?.sort(function (a, b) {
                                                    return a.id - b.id
                                                })?.map((entity: EntityStructure) => (
                                                    <CommandItem
                                                        key={entity.id}
                                                        value={String(entity.name)}
                                                        onSelect={(currentValue: any) => {
                                                            habdleChange(entity, 'entities')
                                                            setValueEntity(entity)
                                                            //   setValue(currentValue === value ? '' : currentValue)

                                                            setOpenEntities(false)
                                                        }}
                                                    >
                                                        <CheckIcon
                                                            className={cn(
                                                                'mr-2 h-4 w-4',
                                                                String(valueEntity?.id) === String(entity.id) ? 'opacity-100' : 'opacity-0'
                                                            )}
                                                        />
                                                        {entity.name}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="grid w-full max-w-xs items-center gap-2 mb-5">
                            <Label htmlFor='dwak'>Módulo</Label>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className="w-full justify-between"
                                    >
                                        {(String(value.module).length > 0)
                                            ? modules?.find((framework) => framework.name === value.module?.name)?.name
                                            : 'Seleccione el módulo'}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="PopoverContent overflow-auto">
                                    <Command>
                                        <CommandInput placeholder={'Buscar a...'} />
                                        <CommandList>
                                            <CommandEmpty>No se encontró a.</CommandEmpty>
                                            <CommandGroup>
                                                {modules?.sort(function (a, b) {
                                                    return a.id - b.id
                                                })?.map((framework) => (
                                                    <CommandItem
                                                        key={framework.id}
                                                        value={String(framework.name)}
                                                        onSelect={(currentValue: any) => {
                                                            habdleChange(framework, 'module')
                                                            setValue({
                                                                ...value,
                                                                module: framework
                                                            })
                                                            //   setValue(currentValue === value ? '' : currentValue)

                                                            setOpen(false)
                                                        }}
                                                    >
                                                        <CheckIcon
                                                            className={cn(
                                                                'mr-2 h-4 w-4',
                                                                String(value.module?.id) === String(framework.id) ? 'opacity-100' : 'opacity-0'
                                                            )}
                                                        />
                                                        {framework.name}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="grid w-full max-w-xs items-center gap-2 mb-5">
                            <Label htmlFor='dwak'>Disciplina</Label>
                            <Popover open={openDisciplines} onOpenChange={setOpenDisciplines}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openDisciplines}
                                        className="w-full justify-between"
                                    >
                                        {(String(valueDiscipline.module).length > 0)
                                            ? disciplines?.find((framework) => framework.name === valueDiscipline.module?.name)?.name
                                            : 'Seleccione la disciplina'}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="PopoverContent overflow-auto">
                                    <Command>
                                        <CommandInput placeholder={'Buscar a...'} />
                                        <CommandList>
                                            <CommandEmpty>No se encontró a.</CommandEmpty>
                                            <CommandGroup>
                                                {disciplines?.sort(function (a, b) {
                                                    return a.id - b.id
                                                })?.map((framework) => (
                                                    <CommandItem
                                                        key={framework.id}
                                                        value={String(framework.name)}
                                                        onSelect={(currentValue: any) => {
                                                            habdleChange(framework, 'discipline')
                                                            setValueDiscipline({
                                                                ...valueDiscipline,
                                                                module: framework
                                                            })
                                                            //   setValue(currentValue === value ? '' : currentValue)

                                                            setOpenDisciplines(false)
                                                        }}
                                                    >
                                                        <CheckIcon
                                                            className={cn(
                                                                'mr-2 h-4 w-4',
                                                                String(valueDiscipline.module?.id) === String(framework.id) ? 'opacity-100' : 'opacity-0'
                                                            )}
                                                        />
                                                        {framework.name}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="grid w-full max-w-xs items-center gap-2 mb-5">
                            <Label htmlFor='dwak'>Tipo</Label>
                            <Popover open={openTypes} onOpenChange={setOpenTypes}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openTypes}
                                        className="w-full justify-between"
                                    >
                                        {(String(valueType.module).length > 0)
                                            ? types?.find((framework) => framework.name === valueType.module?.name)?.name
                                            : 'Seleccione el tipo'}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="PopoverContent overflow-auto">
                                    <Command>
                                        <CommandInput placeholder={'Buscar a...'} />
                                        <CommandList>
                                            <CommandEmpty>No se encontró a.</CommandEmpty>
                                            <CommandGroup>
                                                {types?.sort(function (a, b) {
                                                    return a.id - b.id
                                                })?.map((framework) => (
                                                    <CommandItem
                                                        key={framework.id}
                                                        value={String(framework.name)}
                                                        onSelect={(currentValue: any) => {
                                                            habdleChange(framework, 'type')
                                                            setValueType({
                                                                ...valueType,
                                                                module: framework
                                                            })
                                                            //   setValue(currentValue === value ? '' : currentValue)

                                                            setOpenTypes(false)
                                                        }}
                                                    >
                                                        <CheckIcon
                                                            className={cn(
                                                                'mr-2 h-4 w-4',
                                                                String(valueType.module?.id) === String(framework.id) ? 'opacity-100' : 'opacity-0'
                                                            )}
                                                        />
                                                        {framework.name}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="grid w-full max-w-xs items-center gap-2 mb-5">
                            <Label htmlFor='dwak'>Confidencial</Label>
                            <Select value={searchObject.confidential} onValueChange={(value: string) => {
                                setSearchObject({
                                    ...searchObject,
                                    confidential: value === 'null' ? '' : value
                                })
                            }}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Seleccione alguna opción" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="null">Sin filtro</SelectItem>
                                        <SelectItem value="1">Si</SelectItem>
                                        <SelectItem value="0">No</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid w-full max-w-xs items-center gap-2 mb-5">
                            <Label htmlFor="dwa">Fecha de Documento</Label>
                            <Input value={searchObject.date_doc} onChange={handleInputs} id={'date_doc'} type={'date'} name={'date_doc'} placeholder={'Ingrese fecha'} />
                        </div>
                        <div className="grid w-full max-w-xs items-center gap-2 mb-5">
                            <Label htmlFor="dwa">Fecha de Subida</Label>
                            <Input value={searchObject.date_load} onChange={handleInputs} id={'date_load'} type={'date'} name={'date_load'} placeholder={'Ingrese fecha'} />
                        </div>
                        <div className="grid w-full max-w-xs items-center gap-2 mb-5">
                            <Label htmlFor="dwa">Fecha de Vencimiento</Label>
                            <Input value={searchObject.date_expired} onChange={handleInputs} id={'date_expired'} type={'date'} name={'date_expired'} placeholder={'Ingrese fecha'} />
                        </div>
                        <div className="grid w-full max-w-xs items-center gap-2 mb-5">
                            <Label htmlFor="dwa">Días de Vencimiento</Label>
                            <Input value={searchObject.days_expired} onChange={handleInputs} id={'days_expired'} type={'text'} name={'days_expired'} placeholder={'Ingrese fecha'} />
                        </div>
                        <div className="grid w-full max-w-xs items-center gap-2 mb-5">
                            <Label htmlFor='dwak'>Estado Vendor</Label>
                            <Select value={searchObject.status_vendor} onValueChange={(val) => setSearchObject({
                                ...searchObject,
                                status_vendor: val === '0' ? '' : val
                            })}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Seleccione el estado del vendedor" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {/* <SelectLabel>Confidencial</SelectLabel> */}
                                        <SelectItem value={'0'}>Sin filtro</SelectItem>
                                        {
                                            statusVendor?.map((module: ModuleStructure) => {
                                                return (
                                                    <SelectItem key={module.id} value={String(module.id)}>{module.name}</SelectItem>
                                                )
                                            })
                                        }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        {
                            inputGroup.filter((objMain: any) => objMain.id > 4 && objMain.id <= 6).map((obj: any) => {
                                return (
                                    <div key={obj.id} className="grid w-full max-w-xs items-center gap-2 mb-5">
                                        <Label htmlFor={obj.name}>{obj.label}</Label>
                                        <Input value={obj.value} onChange={handleInputs} id={obj.name} type={obj.type} name={obj.name} placeholder={'Ingrese ' + obj.name} />
                                    </div>
                                )
                            })
                        }
                        <div className="grid w-full max-w-xs items-center gap-2 mb-5">
                            <Label htmlFor='dwak'>Estado del cliente</Label>
                            <Select value={searchObject.status_client} onValueChange={(val) => setSearchObject({
                                ...searchObject,
                                status_client: val === '0' ? '' : val
                            })}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Seleccione el estado del cliente" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {/* <SelectLabel>Confidencial</SelectLabel> */}
                                        <SelectItem value={'0'}>Sin filtro</SelectItem>
                                        {
                                            statusClient?.map((module: ModuleStructure) => {
                                                return (
                                                    <SelectItem key={module.id} value={String(module.id)}>{module.name}</SelectItem>
                                                )
                                            })
                                        }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        {
                            inputGroup.filter((objMain: any) => objMain.id > 6).map((obj: any) => {
                                return (
                                    <div key={obj.id} className="grid w-full max-w-xs items-center gap-2 mb-5">
                                        <Label htmlFor={obj.name}>{obj.label}</Label>
                                        <Input value={obj.value} onChange={handleInputs} id={obj.name} type={obj.type} name={obj.name} placeholder={'Ingrese ' + obj.name} />
                                    </div>
                                )
                            })
                        }
                    </div>
                    {/* <div className='absolute flex flex-row gap-3 mb-5 -top-14  right-0'>
                        <Button className='flex flex-row gap-2' onClick={async () => { await sendSearch() }}>
                            <FaMagnifyingGlass className='h-5 w-5' />
                            <p>Buscar</p>
                        </Button>
                    </div> */}
                </div>
                <div className='flex flex-row justify-center gap-3'>
                    <Button className='flex flex-row gap-2 w-[250px]' onClick={() => {
                        setSearchObject(initialStateSearch)
                        setValueEntity(null)
                        setValue({
                            module: '',
                            discipline: '',
                            type: ''
                        })
                        setValueDiscipline({
                            module: '',
                            discipline: '',
                            type: ''
                        })
                        setValueType({
                            module: '',
                            discipline: '',
                            type: ''
                        })

                    }}>
                        <FaArrowRotateRight className='h-5 w-5' />
                        <p>Reiniciar campos</p>
                    </Button>
                    <Button type='button' className='flex flex-row gap-2 w-[250px]' onClick={async () => { await sendSearch() }}>
                        <FaMagnifyingGlass className='h-5 w-5' />
                        <p>Buscar</p>
                    </Button>
                    <Button className='flex flex-row gap-2 w-[250px]' onClick={() => setShow((prev: any) => !prev)}>
                        <MdOutlineCloseFullscreen className='h-5 w-5' />
                        <p>Cerrar búsqueda</p>
                    </Button>
                </div>
            </div>
        </div>
    )
}
