import React, { useState } from 'react'
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
import { SearchInput } from '@/lib/utils'

interface SearchDocumentDialogStructure {
    openDialog: boolean
    setOpenDialog: (value: boolean) => void
    setMyData: (value: any) => void
}

export default function SearchDocumentDialog({ openDialog, setOpenDialog, setMyData }: SearchDocumentDialogStructure) {
    const [searchObject, setSearchObject] = useState<SearchInput>({
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
    })
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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

    const getDocsAux = async () => {
        // console.log("ENTRANDo");
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
            if (error?.status === 401) {
                await signOut({ callbackUrl: '/auth/login' })
            }
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
        { id: 1, name: 'title', label: 'Título', type: 'text' },
        { id: 2, name: 'filename', label: 'Nombre de Archivo', type: 'text' },
        { id: 3, name: 'author', label: 'Autor', type: 'text' },
        // { id: 4, name: 'discipline', label: 'Disciplina', type: 'text' },
        // { id: 5, name: 'module', label: 'Módulo', type: 'text' },
        // { id: 6, name: 'type', label: 'Tipo', type: 'text' },
        // { id: 7, name: 'confidential', label: 'Confidencial', type: 'text' },
        // { id: 8, name: 'date_doc', label: 'Fecha del Documento', type: 'text' },
        // { id: 9, name: 'date_load', label: 'Fecha de Carga', type: 'text' },
        // { id: 10, name: 'date_expired', label: 'Fecha de Expiración', type: 'text' },
        // { id: 11, name: 'days_expired', label: 'Días para Expirar', type: 'text' },
        // { id: 12, name: 'status_vendor', label: 'Estado del Vendedor', type: 'text' },
        { id: 4, name: 'code_vendor', label: 'Código del Vendedor', type: 'text' },
        { id: 5, name: 'revision_vendor', label: 'Revisión del Vendedor', type: 'text' },
        { id: 6, name: 'rev_vendor_by', label: 'Revisado por el Vendedor', type: 'text' },
        // { id: 7, name: 'status_client', label: 'Estado del Cliente', type: 'text' }
        { id: 7, name: 'code_client', label: 'Código del Cliente', type: 'text' },
        { id: 8, name: 'revision_client', label: 'Revisión del Cliente', type: 'text' },
        { id: 9, name: 'rev_client_by', label: 'Revisado por el Cliente', type: 'text' },
        { id: 10, name: 'rev_client_alt', label: 'Revisión Alternativa del Cliente', type: 'text' },
        { id: 11, name: 'po_contract', label: 'Contrato o Pedido', type: 'text' }
    ]
    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    {/* <DialogDescription>
                        Make changes to your profile here. Click save when you're done.
                    </DialogDescription> */}
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            defaultValue="Pedro Duarte"
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                            Username
                        </Label>
                        <Input
                            id="username"
                            defaultValue="@peduarte"
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
