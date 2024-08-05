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
        <Card className='bg-white/20 border border-white w-1/5 h-[550px] flex flex-col justify-center items-center gap-5 rounded-2xl'>
            <CardHeader>
                <div className='flex justify-center items-center'>
                    <Image
                        style={{
                            width: 'auto',
                            height: 'auto'
                        }}
                        src="/img/icons/login-logo.png"
                        width={200}
                        height={200}
                        alt="Picture of the author"
                    />
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
