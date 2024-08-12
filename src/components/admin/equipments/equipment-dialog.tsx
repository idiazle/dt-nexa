'use client'
import { getEquipmentById, postEquipment, putEquipment } from '@/api/admin/equipments-api'
import { useToast } from '@/components/ui/use-toast'
import { EntityStructure, EquipmentStructure, Manufacturer } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  //   DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { FaSquarePlus, FaSquareMinus } from 'react-icons/fa6'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

interface EquipmentType {
  id: number
  type: string
}

interface EquipmentDialogStructure {
  id: number | null
  dialogOpen: boolean
  setDialogOpen: (value: boolean) => void
  entities: EntityStructure[] | null
  manufacturers: Manufacturer[] | null
  equipments: EquipmentStructure[] | null
}

interface EquipmentExtraInfoStructure {
  tag: string
  requisition: string
  english_name: string | null
  properties: Array<string | object | null>
  manufacturer_id: number
}

export default function EquipmentDialog({ id, dialogOpen, setDialogOpen, entities, manufacturers, equipments }: EquipmentDialogStructure) {
  const [loading, setLoading] = useState<boolean>(false)
  const FormEquipmentSchema = z.object({
    name: z.string().min(2, {
      message: 'El nombre debe ser más largo'
    }),
    code: z.string(),
    description: z.string(),
    type: z.number(),
    user_id: z.number(),
    parent_id: z.string().min(1, {
      message: 'El equipo debe pertenecer a un área'
    })
  })
  const formEquipment = useForm<z.infer<typeof FormEquipmentSchema>>({
    resolver: zodResolver(FormEquipmentSchema),
    defaultValues: {
      name: '',
      code: '',
      description: '',
      type: 3,
      user_id: 123,
      parent_id: ''
    }
  })

  let initialValue: EquipmentExtraInfoStructure = {
    tag: '',
    requisition: '',
    english_name: '',
    properties: [],
    manufacturer_id: 1
  }

  const equipTypeArr = [
    {
      id: 1,
      type: 'Electromecánico'
    },
    {
      id: 2,
      type: 'Almacenamiento'
    },
    {
      id: 3,
      type: 'Instrumentos'
    },
    {
      id: 4,
      type: 'Válvulas'
    },
    {
      id: 5,
      type: 'Tuberías'
    },
    {
      id: 6,
      type: 'Eléctrico'
    }
  ]
  const [registerType, setRegisterType] = useState<string>('1')
  const [equipSelType, setEquipSelType] = useState<string>('1')
  const [formEquipmentInfo, setFormEquipmentInfo] = useState<EquipmentExtraInfoStructure>(initialValue)

  const renderProperties = () => {
    switch (equipSelType) {
      case '1':
        initialValue = {
          tag: '',
          english_name: '',
          requisition: '',
          properties: [
            {
              label: 'Tipo/Modelo',
              value: ''
            },
            {
              label: 'Capacidad',
              value: ''
            },
            {
              label: 'Material',
              value: ''
            },
            {
              label: 'Dimensiones',
              value: ''
            },
            {
              label: 'Peso',
              value: ''
            },
            {
              label: 'Potencia',
              value: ''
            },
            {
              label: 'Sala eléctrica',
              value: ''
            },
            {
              label: 'Ubicación técnica',
              value: ''
            },
            {
              label: 'Ubicación Planta virtual',
              value: ''
            },
            {
              label: 'Plano P&ID',
              value: ''
            },
            {
              label: '¿Es un sistema?',
              value: ''
            }
          ],
          manufacturer_id: 1
        }
        break
      case '2':
        initialValue = {
          tag: '',
          english_name: '',
          requisition: '',
          properties: [
            {
              label: 'Capacidad',
              value: ''
            },
            {
              label: 'Material',
              value: ''
            },
            {
              label: 'Dimensiones',
              value: ''
            },
            {
              label: 'Corriente',
              value: ''
            },
            {
              label: 'Voltaje',
              value: ''
            },
            {
              label: 'Red de comunicación',
              value: ''
            },
            {
              label: 'Ubicación técnica',
              value: ''
            },
            {
              label: 'Ubicación Planta virtual',
              value: ''
            },
            {
              label: 'Plano P&ID',
              value: ''
            }
          ],
          manufacturer_id: 1
        }
        break
      case '3':
        initialValue = {
          tag: '',
          requisition: '',
          english_name: '',
          properties: [
            {
              label: 'Nombre en Inglés',
              value: ''
            },
            {
              label: 'Material',
              value: ''
            },
            {
              label: 'Corriente',
              value: ''
            },
            {
              label: 'Voltaje',
              value: ''
            },
            {
              label: 'Red de comunicación',
              value: ''
            },
            {
              label: 'Sala eléctrica',
              value: ''
            },
            {
              label: 'Tablero eléctrico',
              value: ''
            },
            {
              label: 'Ubicación técnica',
              value: ''
            },
            {
              label: 'Ubicación Planta virtual',
              value: ''
            },
            {
              label: 'Valor operacional',
              value: ''
            },
            {
              label: 'Plano P&ID',
              value: ''
            }
          ],
          manufacturer_id: 1
        }
        break
      case '4':
        initialValue = {
          tag: '',
          requisition: '',
          english_name: '',
          properties: [
            {
              label: 'Tipo/Modelo',
              value: ''
            },
            {
              label: 'Peso',
              value: ''
            },
            {
              label: 'Diámetro',
              value: ''
            },
            {
              label: 'Tipo de actuador',
              value: ''
            },
            {
              label: 'Sala eléctrica',
              value: ''
            },
            {
              label: 'Tablero eléctrico',
              value: ''
            },
            {
              label: 'Ubicación técnica',
              value: ''
            },
            {
              label: 'Ubicación Planta virtual',
              value: ''
            },
            {
              label: 'Valor operacional',
              value: ''
            },
            {
              label: 'Plano P&ID',
              value: ''
            }
          ],
          manufacturer_id: 1
        }
        break
      case '5':
        initialValue = {
          tag: '',
          requisition: '',
          english_name: '',
          properties: [
            {
              label: 'Material',
              value: ''
            },
            {
              label: 'Diámetro',
              value: ''
            },
            {
              label: 'Tipo de fluido',
              value: ''
            }
          ],
          manufacturer_id: 1
        }
        break
      default:
        initialValue = {
          tag: '',
          requisition: '',
          english_name: '',
          properties: [
            {
              label: 'Tipo/Modelo',
              value: ''
            },
            {
              label: 'Capacidad',
              value: ''
            },
            {
              label: 'Peso',
              value: ''
            },
            {
              label: 'Potencia',
              value: ''
            },
            {
              label: 'Corriente',
              value: ''
            },
            {
              label: 'Voltaje',
              value: ''
            },
            {
              label: 'Red de comunicación',
              value: ''
            },
            {
              label: 'Sala eléctrica',
              value: ''
            },
            {
              label: 'Tablero eléctrico',
              value: ''
            },
            {
              label: 'Ubicación técnica',
              value: ''
            },
            {
              label: 'Ubicación Planta virtual',
              value: ''
            },
            {
              label: '¿Es un sistema?',
              value: ''
            }
          ],
          manufacturer_id: 1
        }
        break
    }
    setFormEquipmentInfo(initialValue)
  }

  useEffect(() => {
    renderProperties()
  }, [equipSelType])

  const handleAddProperty = () => {
    setFormEquipmentInfo({
      ...formEquipmentInfo,
      properties: [...formEquipmentInfo.properties, {
        label: '',
        value: ''
      }]
    })
  }

  const handleRemoveProperty = () => {
    setFormEquipmentInfo(prev => ({
      ...formEquipmentInfo,
      properties: [...prev.properties].slice(0, -1)
    }))
  }

  const handleChangeEquipment = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement
    setFormEquipmentInfo({
      ...formEquipmentInfo,
      [target.name]: target.value
    })
  }
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (data: z.infer<typeof FormEquipmentSchema>) => {
    setLoading(true)
    const sendObject = {
      ...data,
      equipment: {
        ...formEquipmentInfo,
        properties: JSON.stringify(formEquipmentInfo.properties)
      }
    }
    if (id === null) {
      try {
        const response = await postEquipment(sendObject)
        if (response.status === 201) {
          router.refresh()
          setDialogOpen(false)
          formEquipment.reset()
          setFormEquipmentInfo(initialValue)
          setLoading(false)
          toast({
            duration: 3000,
            variant: 'default',
            title: 'Creación',
            description: 'Equipo(TAG) creado correctamente'
          })
        }
      } catch (error: any) {
        console.log(error);
        
        setLoading(false)
        toast({
          duration: 3000,
          variant: 'destructive',
          title: 'Error',
          description: error?.response.data.message ? error?.response.data.message : 'Ocurrió un error, no se pudo crear el equipo'
        })
        throw new Error('Error in equipment-dialog-create-submit')
      }
    } else {
      const objeEdit = {
        ...data,
        ...sendObject.equipment
      }

      if (id !== null) {
        try {
          const response = await putEquipment(id, objeEdit)

          if (response.status === 200) {
            router.refresh()
            setDialogOpen(false)
            setLoading(false)
            toast({
              duration: 3000,
              variant: 'default',
              title: 'Edición',
              description: 'Equipo(TAG) editado correctamente'
            })
          }
        } catch (error) {
          setLoading(false)
          toast({
            duration: 3000,
            variant: 'destructive',
            title: 'Error',
            description: 'Ocurrió un error, no se pudo editar el equipo'
          })
          throw new Error('Error in equipment-dialog-edit-submit')
        }
      }
    }
  }

  const handleChangeProperties = (e: React.FormEvent<HTMLInputElement>, index: number) => {
    const target = e.target as HTMLInputElement
    const updatedProperties = [...formEquipmentInfo.properties as any]
    updatedProperties[index][target.name] = target.value
    setFormEquipmentInfo({ ...formEquipmentInfo, properties: updatedProperties })
  }

  // console.log('THIS IS MY EQUIPMENT INFO', formEquipmentInfo)

  const resetFields = () => {
    renderProperties()
    formEquipment.reset()
  }
  const [selectedEquipment, setSelectedEquipment] = useState<boolean>(false)

  const getInforEquipment = async (id: number) => {
    try {
      const response = await getEquipmentById(id)
      const data = response.data.data

      if (response.status === 200) {
        formEquipment.setValue('name', data.name)
        formEquipment.setValue('code', data.code)
        formEquipment.setValue('description', String(data.level_data.description))
        // formEquipment.setValue()
        formEquipment.setValue('parent_id', String(data.parent))

        setFormEquipmentInfo({
          tag: data.tag,
          english_name: data.english_name,
          requisition: data.requisition,
          properties: JSON.parse(data.properties as any),
          // num_req: response.num_req,
          manufacturer_id: data.manufacturer_id?.id
        })
        setSelectedEquipment(true)
      }
    } catch (error) {
      console.log(error);
      
      throw new Error('Error en equipment-dialog')
    }
  }
  useEffect(() => {
    if (id !== null) {
      getInforEquipment(id)
    }
  }, [id])

  useEffect(() => {
    if (registerType === '1') {
      setSelectedEquipment(false)
      resetFields()
    }
  }, [registerType])

  useEffect(() => {
    if (id === null) {
      setSelectedEquipment(false)
      resetFields()
    }
  }, [id, dialogOpen])

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        {
          id === null
            ? <p>
              Crear TAG
            </p>
            : <p >
              Editar
            </p>
        }
        {/* <Button>Crear TAG</Button> */}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[95vh] overflow-auto min-w-[50vw]" onPointerDownOutside={(e) => { e.preventDefault() }}>
        <DialogHeader>
          <DialogTitle>{id === null ? 'Crear TAG' : 'Editar TAG'}</DialogTitle>
          {/* <DialogDescription>
                        Anyone who has this link will be able to view this.
                    </DialogDescription> */}
        </DialogHeader>

        <div className="relative flex flex-col items-start justify-center gap-3">
          {
            id === null

              ? <div className='w-full flex flex-col gap-3'>
                <Label>Tipo de registro</Label>
                <Select onValueChange={setRegisterType} defaultValue={registerType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione el tipo de registro" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={'1'}>Nuevo registro</SelectItem>
                    <SelectItem value={'2'}>Copiar registro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              : null
          }
          {

            <div className='w-full'>

              {
                registerType === '2'
                  ? <div className='w-full flex flex-row justify-center items-center mt-2 mb-2'>
                    <Label className='w-1/3'>Equipo que desea copiar</Label>
                    <Select onValueChange={(e) => { getInforEquipment(Number(e)) }} >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione el equipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {
                          equipments?.map((equipment: EquipmentStructure) => {
                            return (
                              <SelectItem key={equipment.equipment_id} value={String(equipment.equipment_id)}>{equipment.tag} - {equipment.name}</SelectItem>
                            )
                          })
                        }
                      </SelectContent>
                    </Select>
                  </div>
                  : null
              }
              {
                registerType === '1' || (registerType === '2' && selectedEquipment)
                  ? <div>
                    <div className='w-full flex flex-row justify-center items-center'>
                      <Label className='w-1/3'>Tipo de equipo</Label>
                      <Select value={equipSelType} onValueChange={setEquipSelType}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccione el tipo de equipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {
                            equipTypeArr.map((equipment: EquipmentType) => {
                              return (
                                <SelectItem key={equipment.id} value={String(equipment.id)}>{equipment.type}</SelectItem>
                              )
                            })
                          }
                        </SelectContent>
                      </Select>
                    </div>
                    <Form {...formEquipment}>
                      <form onSubmit={formEquipment.handleSubmit(handleSubmit)} className="w-full">
                        <FormField
                          control={formEquipment.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem className='flex flex-row justify-center items-center'>
                              <FormLabel className='w-1/3'>Nombre</FormLabel>
                              <FormControl>
                                <Input placeholder="shadcn" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={formEquipment.control}
                          name="code"
                          render={({ field }) => (
                            <FormItem className='flex flex-row justify-center items-center'>
                              <FormLabel className='w-1/3'>Código</FormLabel>
                              <FormControl>
                                <Input placeholder="shadcn" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={formEquipment.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem className='flex flex-row justify-center items-center'>
                              <FormLabel className='w-1/3'>Descripción</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Type your message here." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={formEquipment.control}
                          name="parent_id"
                          render={({ field }) => (
                            <FormItem className='flex flex-row justify-center items-center'>
                              <FormLabel className='w-1/3'>Área de pertenencia</FormLabel>
                              {
                                entities !== null
                                  ? <Select value={String(field.value)} onValueChange={field.onChange}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Seleccione el área al cual pertenece" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {
                                        entities?.map((obj: EntityStructure) => {
                                          return (
                                            <SelectItem key={obj.id} value={String(obj.id)}>{obj.name}</SelectItem>
                                          )
                                        })
                                      }
                                    </SelectContent>
                                  </Select>
                                  : <div className='w-full border border-slate-100/40 rounded'>
                                    <h1 className='p-2 text-sm'>Cargando</h1>
                                  </div>
                              }

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className='flex flex-col'>
                          <div className='flex flex-row justify-center items-center mt-2'>
                            <Label className='w-1/3'>TAG</Label>
                            <Input className={`${formEquipmentInfo.tag === '' ? 'border-red-500' : ''}`} value={formEquipmentInfo.tag} type="text" id="tag" name='tag' placeholder="TAG" onChange={handleChangeEquipment} />
                          </div>
                          <div className='flex flex-row justify-center items-center mt-2'>
                            <Label className='w-1/3'>Requisición</Label>
                            <Input value={formEquipmentInfo.requisition} type="text" id="requisition" name='requisition' placeholder="Requisición" onChange={handleChangeEquipment} />
                          </div>
                          <div className='flex flex-row justify-center items-center mt-2 gap-1'>
                            <Label className='w-1/3'>Nombre en inglés</Label>
                            <Input value={formEquipmentInfo.english_name ?? ''} type="text" id="english_name" name='english_name' placeholder="Nombre en inglés" onChange={handleChangeEquipment} />
                          </div>
                          <div className='flex flex-row justify-center items-center mt-2 gap-1'>
                            <Label className='w-1/3'>Fabricante</Label>
                            {
                              manufacturers !== null
                                ? <Select value={String(formEquipmentInfo.manufacturer_id)} onValueChange={(e) => {
                                  setFormEquipmentInfo({
                                    ...formEquipmentInfo,
                                    manufacturer_id: Number(e)
                                  })
                                }}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccione el fabricante" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {
                                      manufacturers?.map((obj) => {
                                        console.log(obj);
                                        
                                        return (
                                          <SelectItem key={obj.id} value={String(obj.id)}>{obj.name}</SelectItem>
                                        )
                                      })
                                    }
                                  </SelectContent>
                                </Select>
                                : <div className='w-full border border-slate-100/40 rounded'>
                                  <h1 className='p-2 text-sm'>Cargando</h1>
                                </div>
                            }

                          </div>
                          <Separator className='mt-5' />

                          <div className='p-2 mt-3'>
                            <div className='flex flex-row justify-between items-center'>
                              <h1>Propiedades de Equipos</h1>
                              <div className='flex flex-row justify-center items-center gap-2'>
                                <FaSquarePlus onClick={handleAddProperty} className='hover:cursor-pointer' size={27} />
                                <FaSquareMinus onClick={handleRemoveProperty} className='hover:cursor-pointer' size={27} />
                              </div>
                            </div>
                            <Separator className='mt-2' />
                            <div className='flex flex-col gap-3 mt-3'>
                              {
                                formEquipmentInfo.properties.map((proper: any, index: number) => {
                                  return (
                                    <div className='flex flex-row justify-center items-center' key={index}>
                                      {/* <Label className='w-1/3'> */}
                                      <Input className='w-1/3.5 mr-9' value={proper.label} type="text" id={`label_${index}`} name='label' placeholder="Requisición" onChange={(e) => { handleChangeProperties(e, index) }} />
                                      {/* </Label> */}
                                      <Input type="text" value={proper.value} id={`value_${index}`} name='value' placeholder=" " onChange={(e) => { handleChangeProperties(e, index) }} />

                                    </div>
                                  )
                                })
                              }
                            </div>
                          </div>
                        </div>
                        <div className='flex flex-row gap-5 justify-end items-center mt-3'>
                          <Button disabled={formEquipmentInfo.tag === ''} type="submit">Guardar</Button>
                          <DialogClose asChild>
                            <Button type="button" onClick={() => { resetFields() }}>Cerrar</Button>
                          </DialogClose>
                        </div>
                      </form>
                    </Form>
                  </div>

                  : null
              }
            </div>

          }
          {
            loading
              ? <p>CARGANDO</p>
              : null
          }
        </div>
      </DialogContent>
    </Dialog>
  )
}
