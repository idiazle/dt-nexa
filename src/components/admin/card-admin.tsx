import React from 'react'

import { cn } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface modLengthStructure {
  id: number
  title: string
  length: number | any
  icon: any
  route: string
}

type CardProps = React.ComponentProps<typeof Card> & {
  modLength: modLengthStructure
}


export default function CardAdmin({ className, modLength, ...props }: CardProps) {
  return (
    <Card className={cn('w-[380px]', className, 'hover:bg-slate-300/40 cursor-pointer')} {...props}>
      <CardHeader className='flex flex-row justify-between items-center'>
        <div className='flex flex-col justify-between items-start gap-1'>
          <CardTitle>{modLength.title}</CardTitle>
          {
            modLength.title !== 'Entidades'
              ? <CardDescription>{`${modLength.length > 0 ? `Existe un total de ${modLength.length} ${modLength.title}` : `No existen ${modLength.title}`}`}</CardDescription>
              : <CardDescription>Las entidades están divididas en: </CardDescription>
          }
        </div>
        <div>
          {modLength.icon}
        </div>
      </CardHeader>
      {
        modLength.title === 'Entidades'
          ? <CardContent>
            <Separator />
            <div className='flex flex-row justify-between items-center'>
              <div className='flex flex-col justify-center items-center w-1/2 mt-5 border-r'>
                <h1>Plantas</h1>
                <p>{modLength.length?.plants}</p>
              </div>
              <div className='flex flex-col justify-center items-center w-1/2 mt-5'>
                <h1>Áreas</h1>
                <p>{modLength.length?.areas}</p>
              </div>
            </div>
          </CardContent>
          : null
      }
    </Card>
  )
}
