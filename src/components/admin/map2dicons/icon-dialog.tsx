import React from 'react'
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
import { Button } from '@/components/ui/button'
import { postMapsPlans2dIcons } from '@/api/admin/maps2d-api'


interface IconDialogStructure {
    dialogOpen: boolean
    setDialogOpen: (val: boolean) => void
}
export default function IconDialog({ dialogOpen, setDialogOpen }: IconDialogStructure) {
    const formSchema = z.object({
        name: z.string().min(5, {
            message: "Como mínimo debe ser de longitud 5.",
        }),
        file: z.instanceof(File)
    })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    })
    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)

        const formData = new FormData()
        formData.append('name', values.name)
        formData.append('file', values.file)

        try {
            const response = await postMapsPlans2dIcons(formData)
            console.log("MY RESPONSE", response.data.data);
            
        } catch (error) {
            console.log("MY ERROR", error)
        }
    }
    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Crear Icono</DialogTitle>
                    <DialogDescription />
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input placeholder="shadcn" {...field} />
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
                            name="file"
                            render={({ field: { value, onChange, ...field } }: any) => (
                                <FormItem>
                                    <FormLabel>Imagen</FormLabel>
                                    <FormControl>
                                        <Input type='file' placeholder="shadcn" {...field} onChange={(e)=>{
                                            if(e.target.files){
                                                onChange(e.target.files[0])
                                            }
                                        }}/>
                                    </FormControl>
                                    {/* <FormDescription>
                                        This is your public display name.
                                    </FormDescription> */}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
