import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Image from 'next/image'
import LoginForm from './login-form'

export default function LoginCard() {
    return (
        <Card className='bg-transparent border-none w-1/5 flex flex-col justify-center items-center gap-5 rounded-2xl'>
            <CardHeader>
                <div className='flex flex-col justify-center items-center'>
                    <Image
                        style={{
                            width: 'auto',
                            height: 'auto'
                        }}
                        src="/img/icons/portal-digital.png"
                        width={200}
                        height={200}
                        alt="Picture of the author"
                    />
                    <p className='text-2xl'>Portal Digital</p>
                </div>
            </CardHeader>
            <CardContent className='w-full'>
                <LoginForm />
            </CardContent>
            {/* <CardFooter>
                <p>Card Footer</p>
            </CardFooter> */}
        </Card>

    )
}
