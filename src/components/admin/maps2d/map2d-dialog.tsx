import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { getEntities } from '@/api/admin/entities-api'
import { EntityStructure } from '@/lib/utils'
import { getMapPlans2dById, postMapsPlans2d, putMapPlans2d } from '@/api/admin/maps2d-api'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface Map2dDialogStructure {
  id: number | null
  dialogOpen: boolean
  setDialogOpen: (value: boolean) => void
}
export default function Map2dDialog({ id, dialogOpen, setDialogOpen }: Map2dDialogStructure) {
  const router = useRouter()
  const [listEntities, setListEntities] = useState<EntityStructure[] | null>(null)
  const FormMapSchema = z.object({
    name: z.string().min(2, {
      message: 'El nombre debe ser más largo'
    }),
    file: z.instanceof(File),
    map_type: z.string().min(1, {
      message: 'Debe de elegir un tipo de mapa'
    }),
    entity: z.string().min(1, {
      message: 'Debe elegir la entidad a referenciar'
    })
  })
  const formMap2d = useForm<z.infer<typeof FormMapSchema>>({
    resolver: zodResolver(FormMapSchema),
    defaultValues: {
      name: '',
      map_type: '',
    }
  })

  const getApiEntities = async () => {
    try {
      const response = await getEntities()
      setListEntities(response.data.data)
    } catch (error) {
      console.log("ERROR ENTIDADES", error)
    }
  }

  useEffect(() => {
    getApiEntities()
  }, [])
  const { toast } = useToast()

  const getApiMap2dById = async () => {
    try {
      const response = await getMapPlans2dById(Number(id))
      console.log(response.data.data)
      formMap2d.setValue('name', response.data.data.name);
      formMap2d.setValue('map_type', response.data.data.map_type);
      formMap2d.setValue('entity', response.data.data.entity.id);
      formMap2d.setValue('file', response.data.data.file);

    } catch (error) {
      console.log("ERR", error)
    }
  }
  useEffect(() => {
    getApiMap2dById()
  }, [id, dialogOpen])


  const handleSubmit = async (data: z.infer<typeof FormMapSchema>) => {
    console.log("MY SUBMIT DATA", id);

    if (id === null) {
      try {
        const response = await postMapsPlans2d(data)
        toast({
          duration: 3000,
          variant: 'default',
          title: 'Creación',
          description: 'Mapa creado correctamente'
        })
        setDialogOpen(false)
      } catch (error) {
        toast({
          duration: 3000,
          variant: 'destructive',
          title: 'Error',
          description: `Ocurrió un error al intentar crear el mapa ${JSON.stringify(error)}`
        })
        console.log("ERROR", error)
      }
    }
    router.refresh()
  }

  // console.log(formMap2d.watch())

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id === null ? 'Crear' : 'Editar'} mapa</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <Form {...formMap2d}>
          <form onSubmit={formMap2d.handleSubmit(handleSubmit)} className="w-full">
            <FormField
              control={formMap2d.control}
              name="name"
              render={({ field }) => (
                <FormItem className='flex flex-row justify-center items-center'>
                  <FormLabel className='w-1/3'>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Mi nombre" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {
              formMap2d.getValues('file') !== null && id !== null && typeof formMap2d.getValues('file') === 'string' ?
                <div className='flex justify-center items-center my-5'>
                  <Image
                    src={String(formMap2d.getValues('file'))}
                    alt={formMap2d.getValues('name')}
                    height={450}
                    width={450}
                  />
                </div> : null
            }
            <FormField
              control={formMap2d.control}
              name="file"
              render={({ field: { value, onChange, ...field } }: any) => (
                <FormItem>
                  <FormLabel>Imagen</FormLabel>
                  <FormControl>
                    <Input type='file' placeholder="shadcn" {...field} onChange={(e) => {
                      if (e.target.files) {
                        onChange(e.target.files[0])
                      }
                    }} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formMap2d.control}
              name="map_type"
              render={({ field: { value, onChange, ...field } }: any) => (
                <FormItem>
                  <FormLabel>Tipo de Mapa</FormLabel>
                  <Select onValueChange={onChange} value={value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione el tipo" />
                    </SelectTrigger>
                    <SelectContent >
                      <SelectItem value={String(1)}>PFD</SelectItem>
                      <SelectItem value={String(2)}>PLD</SelectItem>
                      <SelectItem value={String(3)}>PND</SelectItem>
                      <SelectItem value={String(4)}>General</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formMap2d.control}
              name="entity"
              render={({ field: { value, onChange, ...field } }: any) => (
                <FormItem>
                  <FormLabel>Entidad</FormLabel>
                  <Select onValueChange={onChange} value={value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione la entidad" />
                    </SelectTrigger>
                    <SelectContent >
                      {
                        listEntities?.map((obj) => {
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
            <Button className='my-3' type="submit">{id === null ? 'Crear' : 'Editar'}</Button>

          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
