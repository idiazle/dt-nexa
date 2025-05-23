import { useRouter } from 'next/navigation'
import React, { type ChangeEvent, useEffect, useState } from 'react'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useToast } from '@/components/ui/use-toast'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { CheckValuesForm } from '../documents/form-doc-dialog'
import { EntityStructure, ModuleStructure, PlanStructure } from '@/lib/utils'
import { getOptionsById, postDocument, postObjVsDocs, putDocumentById, uploadDocument } from '@/api/admin/documents-api'
import { deleteEntity, getEntities, postEntity, putEntity } from '@/api/admin/entities-api'
import { Button } from '@/components/ui/button'
import { FaEye, FaFile, FaFileImage, FaRegEye } from 'react-icons/fa6'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import ComboBoxModules from '../combo-box-modules'
import { Skeleton } from '@/components/ui/skeleton'
import { Checkbox } from '@/components/ui/checkbox'
import ModalViewMedia from '@/components/viewers/modal-viewer'
import { useSession } from 'next-auth/react'
import { getPlanById } from '@/api/admin/plan-api'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { Textarea } from '@/components/ui/textarea'


interface PlanCreateFormStructure {
  id: number | null
  setDialogOpen: (value: boolean) => void
}


export default function PlanCreateForm({ id, setDialogOpen }: PlanCreateFormStructure) {
  const [gerencies, setGerencies] = useState<EntityStructure[]>([])
  const { data: session } = useSession()

  const getGerencies = async () => {
    const response = await getEntities()
    if (response.status === 200) {
      // console.log('RESPONSE', response.data.data)
      const _gerencies = response.data.data.filter((obj: EntityStructure) => obj.type === 5)
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
    parent_id: z.string().nullable(),
    // image: z.instanceof(File).nullable(),
    image: z.instanceof(File).nullable(),
    description: z.string().nullable()

  })
  // console.log('MY PARENT ID', String(parentId))

  const formEntity = useForm<z.infer<typeof formSchema>>({
    reValidateMode: 'onChange',
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: '6',
      code: '',
      name: '',
      user_id: session?.user.id,
      parent_id: undefined,
      image: null,
      description: ''
    }
  })
  const { toast } = useToast()

  // console.log(formEntity.watch());

  /// ///////////////////////////////////////////////////////// THIS IS THE DATA FOR SAVE DOCUMENTTTTTTTTTTTTTTS
  const [modules, setModules] = useState<ModuleStructure[]>([])
  const [disciplines, setDisciplines] = useState<ModuleStructure[]>([])
  const [types, setTypes] = useState<ModuleStructure[]>([])
  const [statusVendor, setStatusVendor] = useState<ModuleStructure[]>([])
  const [statusClient, setStatusClient] = useState<ModuleStructure[]>([])
  const [documentFile, setDocumentFile] = useState<File | null>(null)
  const fillDropdowns = async () => {
    try {
      const resModules = await getOptionsById({ ids: '1' })
      if (resModules.status === 200) {
        setModules(resModules.data.data)
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

  const today = new Date()
  const date = today.setDate(today.getDate())
  const defaultDate = new Date(date).toISOString().split('T')[0]
  const formSchemaDoc = z.object({
    title: z.string().min(2, {
      message: 'Título muy corto.'
    }),
    filename: z.string().min(2, {
      message: 'Nombre de archivo muy corto.'
    }).default('').optional(),
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
    days_expired: z.any().optional(),
    user_id: z.number()
  })
  const form = useForm<z.infer<typeof formSchemaDoc>>({
    reValidateMode: 'onChange',
    resolver: zodResolver(formSchemaDoc),
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
      days_expired: 0,
      user_id: session?.user.id
    }
  })
  const formSchemaVendor = z.object({
    aux_status_vendor: z.number(),
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
      aux_status_vendor: 0,
      code_vendor: '',
      revision_vendor: '',
      rev_vendor_by: ''
    }
  })
  const formSchemaClient = z.object({
    aux_status_client: z.number(),
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
      aux_status_client: 0,
      code_client: '',
      revision_client: '',
      revision_client_alt: '',
      revision_client_by: '',
      po_contract: ''
    }
  })
  const [uploadDocLoading, setUploadDocLoading] = useState<number | null>(null)

  const [referenceObject, setReferenceObject] = useState<any>({
    equipmentsReferences: [],
    areasReferences: [],
    documentsReferences: []
  })
  const getDisciplines = async () => {
    try {
      if (form.getValues('aux_module_id') !== null && form.getValues('aux_module_id') !== 0) {
        const resDisciplines = await getOptionsById({ ids: String(form.getValues('aux_module_id')) })
        setDisciplines(resDisciplines.data.data)
      }
    } catch (error) {
      throw new Error('Error in getDisciplines')
    }
  }
  useEffect(() => {
    getDisciplines()
  }, [form.watch('aux_module_id')])

  const getTypes = async () => {
    try {
      if (form.getValues('aux_discipline_id') !== null && form.getValues('aux_discipline_id') !== 0) {
        const resTypes = await getOptionsById({ ids: String(form.getValues('aux_discipline_id')) })
        setTypes(resTypes.data.data)
      }
    } catch (error) {
      throw new Error('Error in getTypes')
    }
  }

  useEffect(() => {
    getTypes()
  }, [form.watch('aux_discipline_id')])

  // console.log(form.watch())

  const [checkExpired, setCheckExpired] = useState<CheckValuesForm>({
    expired: false,
    client: false,
    vendor: false
  })

  useEffect(() => {
    if (documentFile !== null || id === null) {
      form.setValue('filename', documentFile?.name)
    }
  }, [documentFile])

  const [openLinkDialog, setOpenLinkDialog] = useState<boolean>(false)
  const [viewImage, setViewImage] = useState<boolean>(false)
  const [infoImage, setInfoImage] = useState<{
    data: PlanStructure
  } | null>(null)
  const [fileUrl, setFileUrl] = useState<any | null>('')
  const [stateForSendDialog, setStateForSendDialog] = useState<any | null>(null)
  const [idsOfPlan, setIdsOfPlan] = useState<{
    entity_id: number
    document_id: number
  }>()
  const getPlan = async () => {
    try {
      if (id !== null) {
        const response = await getPlanById(id)
        const dataEntity = response.data.data
        formEntity.setValue('type', String(dataEntity.type))
        formEntity.setValue('code', dataEntity.code)
        formEntity.setValue('name', dataEntity.name)
        formEntity.setValue('user_id', dataEntity.user_id)
        formEntity.setValue('parent_id', dataEntity.parent.id !== null ? String(dataEntity.parent.id) : null)
        formEntity.setValue('description', dataEntity.description)

        

        setIdsOfPlan({
          ...idsOfPlan,
          document_id: dataEntity.documents[0].document_id.id,
          entity_id: dataEntity.id
        })
        setInfoImage(response.data)

        const dataDocument = dataEntity.documents[0].document_id
        const temp = {
          data: dataDocument
        }

        setFileUrl(temp)

        if (dataDocument.vendor !== null && dataDocument.client !== null) {
          setCheckExpired({
            ...checkExpired,
            vendor: true,
            client: true
          })
          formVendor.setValue('aux_status_vendor', dataDocument.vendor?.aux_status_vendor?.id)
          formVendor.setValue('code_vendor', dataDocument.vendor?.code_vendor)
          formVendor.setValue('revision_vendor', dataDocument.vendor?.revision_vendor)
          formVendor.setValue('rev_vendor_by', dataDocument.vendor?.rev_vendor_by)

          formClient.setValue('aux_status_client', dataDocument.client?.aux_status_client?.id)
          formClient.setValue('code_client', dataDocument.client?.code_client)
          formClient.setValue('revision_client', dataDocument.client?.revision_client)
          formClient.setValue('revision_client_alt', dataDocument.client?.revision_client_alt)
          formClient.setValue('revision_client_by', dataDocument.client?.revision_client_by)
          formClient.setValue('po_contract', dataDocument.client?.po_contract)
        } else if (dataDocument.vendor != null) {
          setCheckExpired({
            ...checkExpired,
            vendor: true
          })
          formVendor.setValue('aux_status_vendor', dataDocument.vendor?.aux_status_vendor?.id)
          formVendor.setValue('code_vendor', dataDocument.vendor?.code_vendor)
          formVendor.setValue('revision_vendor', dataDocument.vendor?.revision_vendor)
          formVendor.setValue('rev_vendor_by', dataDocument.vendor?.rev_vendor_by)
        } else if (dataDocument.client != null) {
          // console.log("Client");
          setCheckExpired({
            ...checkExpired,
            client: true
          })
          formClient.setValue('aux_status_client', dataDocument.client?.aux_status_client?.id)
          formClient.setValue('code_client', dataDocument.client?.code_client)
          formClient.setValue('revision_client', dataDocument.client?.revision_client)
          formClient.setValue('revision_client_alt', dataDocument.client?.revision_client_alt)
          formClient.setValue('revision_client_by', dataDocument.client?.revision_client_by)
          formClient.setValue('po_contract', dataDocument.client?.po_contract)
        }

        if (dataDocument.date_expired !== null) {
          setCheckExpired({
            ...checkExpired,
            expired: true
          })
        }
        // console.log("DW321321321", dataDocument.aux_module_id.id)
        // form.setValue('title', dataDocument.title)
        // form.setValue('filename', dataDocument.filename)
        // form.setValue('author', dataDocument.author)
        // form.setValue('aux_module_id', dataDocument.aux_module_id?.id)
        // form.setValue('aux_discipline_id', dataDocument.aux_discipline_id?.id)
        // form.setValue('aux_type_id', dataDocument.aux_type_id?.id)

        form.setValue('title', dataDocument.title)
        form.setValue('filename', dataDocument.filename)
        form.setValue('author', dataDocument.author)
        form.setValue('aux_type_id', dataDocument.aux_type_id?.id)
        form.setValue('aux_discipline_id', dataDocument.aux_discipline_id?.id)
        form.setValue('aux_module_id', dataDocument.aux_module_id?.id)
        form.setValue('confidential', dataDocument.confidential !== 0)
        form.setValue('date_doc', dataDocument.date_doc.split('T')[0])
        form.setValue('date_load', dataDocument.date_load.split('T')[0])
        form.setValue('date_expired', dataDocument.date_expired)
        form.setValue('days_expired', dataDocument.days_expired)
        form.setValue('user_id', dataDocument.user_id)

        if (dataDocument.aux_module_id?.id === 102 && dataDocument.aux_discipline_id?.id === 206 && dataDocument.aux_type_id?.id === 610) {
          setPlanType('1')
        } else if (dataDocument.aux_module_id?.id === 102 && dataDocument.aux_discipline_id?.id === 207 && dataDocument.aux_type_id?.id === 422) {
          setPlanType('2')
        } else {
          setPlanType('3')
        }
      }
    } catch (error) {
      console.log(error);
      
      throw new Error('Error al obtener Plano -  getPlanById')
    }
  }

  useEffect(() => {
    if (id !== null) {
      getPlan()
    }
  }, [id])

  // console.log('DWAP', idsOfPlan)

  const [planType, setPlanType] = useState<string>('')

  const defineModules = () => {
    if (planType === '1') {
      form.setValue('aux_module_id', 102)
      form.setValue('aux_discipline_id', 202)
      form.setValue('aux_type_id', 319)
    } else if (planType === '2') {
      form.setValue('aux_module_id', 102)
      form.setValue('aux_discipline_id', 206)
      form.setValue('aux_type_id', 610)
    } else if (planType === '3') {
      form.setValue('aux_module_id', 102)
      form.setValue('aux_discipline_id', 207)
      form.setValue('aux_type_id', 422)
    } else if (planType === '4') {
      form.setValue('aux_module_id', 102)
      form.setValue('aux_discipline_id', 208)
      form.setValue('aux_type_id', 611)
    }
  }

  useEffect(() => {
    if (id === null) {
      defineModules()
    }
  }, [planType, id])

  const [disableSave, setDisableSave] = useState<boolean>(false)

  const enableSaveButton = () => {
    if (id === null) {
      if (planType === '' || documentFile === null) {
        setDisableSave(true)
      } else {
        setDisableSave(false)
      }
    } else {
      if (planType === '') {
        setDisableSave(true)
      } else {
        setDisableSave(false)
      }
    }
  }

  useEffect(() => {
    enableSaveButton()
  }, [planType, id, form.watch(), formEntity.watch()])
  const [viewTypeDialog, setViewTypeDialog] = useState<string>('')
  const openDialogView = (type: string) => {
    setViewImage(true)
    if (type === 'image') {
      setViewTypeDialog('image')
      setStateForSendDialog(infoImage)
      // console.log('Aquí', stateForSendDialog)
    } else {
      console.log('Aquí2')
      setViewTypeDialog('document')
      setStateForSendDialog(fileUrl)
    }
  }

  const testSubmit = async () => {
    const isValidForm1 = await formEntity.trigger()
    const isValidForm2 = await form.trigger()
    if (isValidForm1 && isValidForm2) {
      const dataEntity = formEntity.getValues()
      const dataForm = form.getValues()

      const formData = new FormData()
      formData.append('name', dataEntity.name ?? '')
      formData.append('code', dataEntity.code ?? '')
      formData.append('type', dataEntity.type ?? '')
      formData.append('user_id', dataEntity.user_id.toString() ?? '')
      formData.append('description', dataEntity.description ?? '')
      if (dataEntity.parent_id !== null) {
        formData.append('parent_id', dataEntity?.parent_id.toString() ?? '')
      }
      if (dataEntity.image !== null && dataEntity.image !== undefined) {
        formData.append('image', dataEntity.image)
      }

      let temp = {}
      if (checkExpired.vendor && checkExpired.client) {
        temp = {
          ...dataForm,
          vendor: formVendor.getValues(),
          client: formClient.getValues()
        }
      } else if (checkExpired.vendor) {
        temp = {
          ...dataForm,
          vendor: formVendor.getValues()
        }
      } else if (checkExpired.client) {
        temp = {
          ...dataForm,
          client: formClient.getValues()
        }
      } else {
        temp = {
          ...dataForm
        }
      }

      if (id === null) {
        const response = await postEntity(formData)
        if (response.status === 201) {
          try {
            const responseDoc = await postDocument(temp)
            if (responseDoc.status === 201) {
              const linkPlanWithDoc = {
                document_id: [responseDoc.data.data.id],
                entity_id: [response.data.data.id],
                type: 6,
                user_id: Number(session?.user.id)
              }
              const resObjVsDocPlan = await postObjVsDocs(linkPlanWithDoc)

              if (resObjVsDocPlan.status === 200) {
                toast({
                  duration: 3000,
                  variant: 'default',
                  title: 'Carga correcta',
                  description: 'Plano creado correctamente'
                })
              }
              if (documentFile !== null && responseDoc.status === 201) {
                try {
                  const fileData = new FormData()
                  fileData.append('attachment', documentFile)

                  const config = {
                    onUploadProgress: async (progressEvent: any) => {
                      const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100)
                      setUploadDocLoading(progress - 1)
                    },
                    headers: {
                      'Content-Type': 'multipart/form-data'
                    }
                  }

                  const fileUploaded = await uploadDocument(Number(responseDoc.data.data.id), fileData, config)
                  if (fileUploaded.status === 200) {
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
              }
            } else {
              console.log('ABDULA')
            }
          } catch (error: any) {
            console.log('GA', error.response.data.data)
            toast({
              duration: 3000,
              variant: 'destructive',
              title: 'Error',
              description: error?.response?.data?.data.map((obj: any, index:number) => {
                return (
                  <p key={index}>- {obj.detail}</p>
                )
              }) || 'Ocurrió un error, no se pudo crear el plano'
            })
            const rs = await deleteEntity(response.data.data.id)
          }
        } else {
          console.log('ERRORRORO')
        }
        router.refresh()
        // setTriggerRefresh(!triggerRefresh)
        setDialogOpen(false)
        setUploadDocLoading(null)
      } else {
        const sendEdition = {
          ...temp,
          client: checkExpired.client ? formClient.watch() : null,
          vendor: checkExpired.vendor ? formVendor.watch() : null
        }

        try {
          const responseEntity = await putEntity(Number(idsOfPlan?.entity_id), formData)
          const responseDoc = await putDocumentById(Number(idsOfPlan?.document_id), sendEdition)

          if (responseEntity.status === 200 && responseDoc.status === 200) {
            toast({
              duration: 3000,
              variant: 'default',
              title: 'Actualización correcta',
              description: 'Se actualizó el plano correctamente'
            })
            router.refresh()
            setDialogOpen(false)
            setUploadDocLoading(null)
          }
        } catch (error) {
          console.log('AAAA', error)
          throw new Error('Error al actualizar')
        }

        if (documentFile !== null) {
          try {
            const fileData = new FormData()
            fileData.append('attachment', documentFile)

            const config = {
              onUploadProgress: async (progressEvent: any) => {
                const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100)
                setUploadDocLoading(progress - 1)
              },
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }

            const fileUploaded = await uploadDocument(Number(idsOfPlan?.document_id), fileData, config)
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
          console.log('LUEGO LO SUBO ')
        }
        router.refresh()
        setUploadDocLoading(null)
      }


      // Aquí puedes manejar los datos de ambos formularios juntos
    } else {
      setUploadDocLoading(null)
      toast({
        duration: 3000,
        variant: 'destructive',
        title: 'Error',
        description: 'Ocurrió un error al crear el plano'
      })
    }
  }
  return (
    <div className='w-full h-full p-2'>
      {
        uploadDocLoading !== null
          ? <div className='absolute flex justify-center items-center top-0 right-0 left-0 m-auto h-full w-full bg-black/30 backdrop-blur-sm z-30'>
            <AiOutlineLoading3Quarters className="mr-2 h-72 w-52 animate-spin" />

            <h1 className='absolute text-lg'>Subiendo {uploadDocLoading} %</h1>
          </div>
          : null
      }
      <Form {...formEntity}>
        <form onSubmit={testSubmit} className={'h-full w-full flex flex-col gap-3 transition-all duration-300'}>
          {
            formEntity.getValues('type') === '6'
              ? <FormField
                control={formEntity.control}
                name="parent_id"
                render={({ field }: any) =>
                (
                  <FormItem>
                    <FormLabel>Seleccione el área a la que pertenece</FormLabel>
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
              : null
          }
          <FormItem>
            <FormLabel>Seleccione el tipo de plano</FormLabel>
            <Select onValueChange={setPlanType} value={planType}>
              <SelectTrigger className={`${planType === '' ? 'border-red-500' : ''}`}>
                <SelectValue placeholder="Tipo de plano" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="1">P&ID</SelectItem>
                  <SelectItem value="2">PFD-Proyecto</SelectItem>
                  <SelectItem value="3">PFD-Gerencia</SelectItem>
                  <SelectItem value="4">PFD-Área</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormItem>
          <FormField
            control={formEntity.control}
            name="name"
            render={({ field }: any) => (
              <FormItem className='w-full'>
                <FormLabel>Nombre del plano</FormLabel>
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
                <FormLabel>Código del plano</FormLabel>
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
                <FormLabel>Descripción del plano</FormLabel>
                <FormControl>
                  <Textarea placeholder="Este plano representa..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col my-3">
            <div className="w-full flex flex-row justify-center items-center gap-4">
              <FormField
                control={formEntity.control}
                name="image"
                render={({ field: { value, onChange, ...field } }: any) => (
                  <FormItem className='w-full'>
                    <FormLabel className='flex flex-row justify-start items-center gap-10'>
                      <p>Imagen del Plano</p>
                      {
                        id !== null && infoImage?.data?.image !== '' && infoImage?.data?.image !== null
                          ? <Button size={'sm'} type='button' className='flex flex-row justify-center items-center gap-1' onClick={() => { openDialogView('image') }}>
                            <FaRegEye size={20} />
                            <p>Ver imagen</p>
                          </Button>
                          : null
                      }
                    </FormLabel>
                    <FormControl>
                      <div>
                        <Input
                          className="hidden"
                          type="file"
                          id="dropzone-file-img-entity"
                          accept=".png"
                          {...field}
                          value={value?.fileName}
                          onChange={(event) => {
                            if (event.target.files !== null) {
                              onChange(event.target.files[0])
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
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>
          </div>
          {/* <Button type="submit">{id === null ? 'Crear' : 'Editar'}</Button> */}
          <h1 className='font-semibold text-lg py-3'>Información del documento</h1>
          <Separator />
          <div className='mt-5'>
            <Form {...form}>
              {/* <Separator orientation='vertical' className='h-full' /> */}
              <form onSubmit={testSubmit}>
                <div className="h-full w-full flex flex-row gap-3">
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
                          {/* <FormDescription>
              This is your public display name.
            </FormDescription> */}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      disabled={documentFile === null}
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
                    {/* {
                    form.watch('aux_module_id') !== 0 ?
                      <FormField
                        control={form.control}
                        name="aux_module_id"
                        render={({ field }: any) => (
                          <FormItem className='flex flex-row justify-center items-center'>
                            <FormLabel className='w-1/3'>Módulos</FormLabel>
                            <FormControl className='w-2/3'>
                              <DropdownSelect dataArray={modules} defaultValue={form.watch('aux_module_id')} title={'módulo'} {...field} onChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      /> : null
                  }
                  {
                    form.watch('aux_discipline_id') !== 0 ?

                      <FormField
                        control={form.control}
                        name="aux_discipline_id"
                        render={({ field }: any) => (
                          <FormItem className='flex flex-row justify-center items-center'>
                            <FormLabel className='w-1/3'>Disciplinas</FormLabel>
                            <FormControl className='w-2/3'>
                              <DropdownSelect dataArray={disciplines} defaultValue={form.watch('aux_discipline_id')} title={'disciplina'} {...field} onChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      /> : null
                  }
                  {
                    form.watch('aux_type_id') !== 0 ?
                      <FormField
                        control={form.control}
                        name="aux_type_id"
                        render={({ field }: any) => (
                          <FormItem className='flex flex-row justify-center items-center'>
                            <FormLabel className='w-1/3'>Tipos</FormLabel>
                            <FormControl className='w-2/3'>
                              <DropdownSelect dataArray={types} defaultValue={form.watch('aux_type_id')} title={'tipo'} {...field} onChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      /> : null
                  } */}

                    {/* <FormField
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
                  /> */}

                    {/* <div className={`transition-opacity  duration-700 ${checkExpired.expired ? 'opacity-100' : 'h-0 opacity-0 overflow-hidden'}`}>
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
                  </div> */}
                    <div className='flex flex-row justify-center items-center'>
                      <div className='w-1/3 flex flex-row justify-start items-center gap-5'>
                        <Label>Documento</Label>
                        {/* <h2>{JSON.stringify(fileUrl.data?.file_url)}</h2> */}
                        {
                          fileUrl.data?.file_url !== null
                            ? <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button disabled={id === null} onClick={() => { openDialogView('document') }} type='button' variant="outline" size="icon">
                                    <FaEye />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Ver documento anterior</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            : null
                        }
                      </div>
                      <div className='w-2/3'>
                        <Input
                          defaultValue={''}
                          className='hidden'
                          type='file'
                          id="dropzone-file"
                          accept=".pdf"
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            if (e.target.files != null) {
                              setDocumentFile(e.target.files[0])
                            }
                          }}
                        />

                        <label style={{
                          width: '100%',
                          height: '110px',
                          border: `2px dashed ${(id === null ? documentFile === null : false) ? 'red' : 'gray'}`,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          fontSize: '18px',
                          cursor: 'pointer'
                        }}
                          htmlFor="dropzone-file"
                          onDrop={(e) => {
                            e.preventDefault()
                            setDocumentFile(e.dataTransfer.files[0])
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
                      <FormMessage />
                    </div>
                  </div>
                  {/* <Separator orientation='vertical' className='h-full mx-5' /> */}
                  <div className='flex flex-col gap-5 w-1/2'>
                    {/* <div className='flex flex-row justify-between items-center'>
                    <h1>Revisión Vendor</h1>
                    <Checkbox checked={checkExpired.vendor} onCheckedChange={(e: boolean) => {
                      setCheckExpired({
                        ...checkExpired,
                        vendor: e
                      })
                    }} />
                  </div> */}
                    <div className={`transition-all duration-500 border ${!checkExpired.vendor ? 'h-0 overflow-hidden' : 'h-1/3 overflow-auto'}`}>
                      <div className='p-3 flex flex-col gap-2'>
                        {
                          formVendor.watch('aux_status_vendor') !== 0
                            ? <FormField
                              control={formVendor.control}
                              name="aux_status_vendor"
                              render={({ field }: any) => (
                                <FormItem className='flex flex-row justify-center items-center'>
                                  <FormLabel className='w-1/3'>Estado Vendor</FormLabel>
                                  <FormControl className='w-2/3'>
                                    <ComboBoxModules defaultValue={formVendor.watch('aux_status_vendor')} dataArray={statusVendor} {...field} title={'tipo'} onChange={field.onChange} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            : <div className='flex flex-row justify-center items-center'>
                              <p className='w-1/3'>Estado Vendor</p>
                              <Skeleton className="w-2/3 h-[28px] rounded-md" />
                            </div>
                        }
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
                      </div>
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
                      <div className='p-3 flex flex-col gap-2'>
                        {
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
                          // <FormField
                          //   control={formClient.control}
                          //   name="aux_status_client"
                          //   render={({ field }: any) => (
                          //     <FormItem className='flex flex-row justify-center items-center'>
                          //       <FormLabel className='w-1/3'>Estado Cliente</FormLabel>
                          //       <FormControl className='w-2/3'>
                          //         {/* <DropdownSelect dataArray={statusClient} {...field} title={'tipo'} onChange={field.onChange} /> */}

                          //         <DropdownSelect defaultValue={String(formClient.watch('aux_status_client'))} dataArray={statusClient} {...field} title={'tipo'} onChange={field.onChange} />
                          //       </FormControl>
                          //       <FormMessage />
                          //     </FormItem>
                          //   )}
                          // />

                        }
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
                      </div>
                    </div>
                    {/* <div className='flex flex-row justify-between items-center'>
          <h1>Referencias</h1>
          <Button type='button' onClick={() => setOpenLinkDialog(true)} className='flex flex-row w-48 justify-center items-center gap-2' variant={'default'} size={'icon'}>
            <FaLink size={20} />
            <p>Referenciar documento</p>
          </Button>
          <LinkDocumentDialog operationType='create' setReferenceObject={setReferenceObject} setOpen={setOpenLinkDialog} open={openLinkDialog} />
        </div> */}
                    {/* <Button className='w-32' type="submit">Editar documento</Button> */}
                  </div>
                </div>
              </form>
            </Form>
          </div>
          <div className='flex flex-row justify-end items-center gap-10 mt-5'>
            <Button disabled={disableSave} type='button' onClick={() => { testSubmit() }}>
              {id === null ? 'Guardar' : 'Actualizar'}
            </Button>
            <Button onClick={() => { setDialogOpen(false) }}>
              Cancelar
            </Button>

          </div>
        </form>
      </Form>
      {
        viewImage
          ? <ModalViewMedia setOpen={setViewImage} open={viewImage} type={viewTypeDialog} information={stateForSendDialog} />
          : null
      }
    </div>
  )
}
