"use client"

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
import { Button } from "../ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { FaAnglesDown } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa6";
import { FaLock } from "react-icons/fa6";
import { signIn, useSession } from 'next-auth/react'
import { toast } from "../ui/use-toast"
import { useRouter } from "next/navigation"

const formSchema = z.object({
    username: z.string().min(2).max(50),
    password: z.string()
})

export default function LoginForm() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    const router = useRouter()

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const sendForm = {
              userdata: values.username,
              password: values.password,
              redirect: false
            }
            const res = await signIn('credentials', sendForm)
            // console.log('THIS IS RESPONSE', res)
      
            if (res !== null && res !== undefined) {
              if (res.status === 200) {
                toast({
                  duration: 3000,
                  variant: 'default',
                  title: 'Datos correctos',
                  description: 'Ingreso exitoso'
                })
                router.push('/user')
                // router.refresh()
                // setLoading(false)
              }
              if (res.error !== null) {
                toast({
                  duration: 3000,
                  variant: 'destructive',
                  title: 'Error',
                  description: `${res?.error}`
                })
                // setLoading(false)
              }
            }
          } catch (error) {
            // console.log('MY ERROR', error)
            toast({
              duration: 3000,
              variant: 'destructive',
              title: 'Eliminación ',
              description: 'Error'
            })
            // setLoading(false)
          }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex flex-row items-center justify-start gap-1">
                                <FaRegUser />
                                <p>Usuario</p>
                            </FormLabel>
                            <FormControl>
                                <Input className="bg-white border-none text-black" placeholder="Usuario Salares" {...field} />
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
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex flex-row items-center justify-start gap-1">
                                <FaLock />
                                <p>Contraseña</p>
                            </FormLabel>
                            <FormControl>
                                <Input type="password" className="bg-white border-none text-black" placeholder="*****" {...field} />
                            </FormControl>
                            {/* <FormDescription>
                                This is your public display name.
                            </FormDescription> */}
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className="w-full mt-10 flex flex-row justify-between items-center" type="submit" >
                    <p className="uppercase">Ingresar</p>
                    <FaAnglesDown className="-rotate-90" size={20} />
                </Button>
            </form>
        </Form>
    )
}
