import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from '@/components/ui/use-toast'
import { getNodes360ById, postNodes360, putNode360 } from '@/api/admin/nodes360-api'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Nodes360DialogStructure {
  id: number | null
  dialogOpen: boolean
  setDialogOpen: (val: boolean) => void
}

export default function Nodes360Dialog({ id, dialogOpen, setDialogOpen }: Nodes360DialogStructure) {
  const FormSchema = z.object({
    map_shape_data: z.any().nullable(),
    node_type: z.string().min(1, {
      message: 'Elija el tipo de nodo'
    }),
    name: z.string().min(5, {
      message: "Como mínimo debe ser de longitud 5.",
    }),
    caption: z.string().min(5, {
      message: "Como mínimo debe ser de longitud 5.",
    }),
    panorama: z.union([z.instanceof(File), z.string().url(), z.null()]).optional()
  })
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      caption: "",
      map_shape_data: null
    },
  })
  const { toast } = useToast()
  const router = useRouter()
  const [imageSrc, setImageSrc] = useState<any>(null);

  const handleSubmit = async (data: z.infer<typeof FormSchema>) => {

    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('caption', data.caption)
    formData.append('node_type', data.node_type)
    formData.append('map_shape_data', data.map_shape_data)
    if (data.panorama instanceof File) {
      formData.append('panorama', data.panorama);
    }
    formData.append('links', '[]')
    formData.append('markers', '[]')

    if (id === null) {
      try {
        console.log("FORMDATA", data)
        const response = await postNodes360(formData)
        toast({
          duration: 3000,
          variant: 'default',
          title: 'Creación',
          description: 'Nodo creado correctamente'
        })
        setDialogOpen(false)
      }
      catch (error) {
        toast({
          duration: 3000,
          variant: 'destructive',
          title: 'Error',
          description: `Ocurrió un error al intentar crear el nodo ${JSON.stringify(error)}`
        })
        console.log("ERROR", error)
      }
    } else {
      try {
        const response = await putNode360(id, formData)
        toast({
          duration: 3000,
          variant: 'default',
          title: 'Edición',
          description: 'Nodo editador correctamente'
        })
        setDialogOpen(false)
      } catch (error) {
        toast({
          duration: 3000,
          variant: 'destructive',
          title: 'Error',
          description: `Ocurrió un error al intentar editar el nodo ${JSON.stringify(error)}`
        })
        console.log("ERROR", error)
      }
    }
    router.refresh()
  }

  const getApiNode360ById = async () => {
    try {
      const response = await getNodes360ById(Number(id))
      console.log("adad", response.data.data);
      setImageSrc(response.data.data.thumbnail || null);
      form.setValue('name', response.data.data.name);
      form.setValue('map_shape_data', response.data.data.map_shape_data);
      form.setValue('node_type', String(response.data.data.node_type));
      form.setValue('caption', response.data.data.caption);
      form.setValue('panorama', response.data.data.panorama);

    } catch (error) {
      console.log("ERR", error)
    }
  }
  useEffect(() => {
    getApiNode360ById()
  }, [id, dialogOpen])

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id === null ? 'Crear' : 'Editar'} Nodo360</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Foto 1" {...field} />
                  </FormControl>
                  {/* <FormDescription>
                                        This is your public display name.
                                    </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="caption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leyenda</FormLabel>
                  <FormControl>
                    <Input placeholder="Foto caption 1" {...field} />
                  </FormControl>
                  {/* <FormDescription>
                                        This is your public display name.
                                    </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="node_type"
              render={({ field: { value, onChange, ...field } }: any) => (
                <FormItem>
                  <FormLabel>Tipo de Node</FormLabel>
                  <Select onValueChange={onChange} value={value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione el tipo" />
                    </SelectTrigger>
                    <SelectContent >
                      <SelectItem value={String(2)}>Punto de Navegación</SelectItem>
                      <SelectItem value={String(3)}>Punto de Equipo</SelectItem>
                      <SelectItem value={String(4)}>Punto Auxiliar</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {imageSrc && (
              <div className='flex justify-center items-center'>
                <Image src={imageSrc} alt="Previsualización" width={200} height={200} />
              </div>
            )}
            <FormField
              control={form.control}
              name="panorama"
              render={({ field: { value, onChange, ...field } }: any) => (
                <FormItem>
                  <FormLabel>Panorama</FormLabel>
                  <FormControl>
                    <Input type='file' placeholder="shadcn" {...field} onChange={(e) => {
                      if (e.target.files) {
                        onChange(e.target.files[0])
                        const file = e.target.files[0];

                        if (file && file.type.startsWith('image/')) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            setImageSrc(reader.result);
                          };
                          reader.readAsDataURL(file);
                        } else {
                          setImageSrc(null);
                          alert('Por favor selecciona un archivo de imagen válido.');
                        }
                      }
                    }} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">{id === null ? 'Crear' : 'Editar'}</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
