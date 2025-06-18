"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "../ui/button"
import { FaUser } from "react-icons/fa6";
import { FaLock } from "react-icons/fa6";
import { signIn, useSession } from 'next-auth/react'
import { toast } from "../ui/use-toast"
import { redirect, useRouter } from "next/navigation"
import { useState } from "react"
import { EyeIcon } from "lucide-react"
import { EyeClosedIcon } from "@radix-ui/react-icons"

const formSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string()
})

export default function LoginForm() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [showPass, setShowPass] = useState<boolean>(false)

  if (status === 'authenticated') {
    location.href = '/menu'
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const sendForm = {
        userdata: values.username,
        password: values.password,
        redirect: false
      }
      const res = await signIn('credentials', sendForm)

      if (res !== null && res !== undefined) {
        if (res.status === 200) {
          toast({
            duration: 3000,
            variant: 'default',
            title: 'Datos correctos',
            description: 'Ingreso exitoso'
          })
          router.push('/menu')
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
    <div className="flex flex-col justify-center items-start">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex flex-row items-center justify-start gap-1">
                  <FaUser size={20} />
                  <p>Usuario:</p>
                </FormLabel>
                <FormControl>
                  <Input className="bg-white border-none text-black" placeholder="usuario@user.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex flex-row items-center justify-between gap-1">
                  <div className="flex flex-row items-center justify-start gap-1">
                    <FaLock size={20} />
                    <p>Contraseña:</p>
                  </div>
                </FormLabel>
                <FormControl>
                  <div className="flex flex-row items-center justify-start">
                    <Input type={showPass ? "text" : 'password'} className="bg-white border-none text-black" placeholder="*************" {...field} />
                    <Button type="button" onClick={() => setShowPass(!showPass)} size={'icon'} variant={'outline'} className="ml-1 bg-[#001f39] hover:bg-[#133958] hover:text-white text-white">
                      {!showPass ? <EyeIcon /> : <EyeClosedIcon />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full mt-10 flex flex-row justify-center items-center bg-[#dc611d]" type="submit" >
            <p className="uppercase text-white">Ingresar</p>
          </Button>
        </form>
      </Form>
    </div>
  )
}
