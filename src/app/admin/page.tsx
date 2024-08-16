import { getDocuments } from '@/api/admin/documents-api'
import { getEntities } from '@/api/admin/entities-api'
import { getEquipments } from '@/api/admin/equipments-api'
import { getUsers } from '@/api/admin/users-api'
import { type EntityStructure } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'
import { FaHouse, FaFile, FaVolcano, FaMap, FaUser } from 'react-icons/fa6'
import { getSession } from 'next-auth/react'
import { authOptions } from '@/lib/authOptions'
import { getServerSession } from 'next-auth'
import CardAdmin from '@/components/admin/card-admin'

const getData = async (token: any): Promise<any> => {
  try {
    const entities = await getEntities()
    const documents = await getDocuments(1, token).then(async (d) => { return await d.json() })
    const plants = entities?.data.data.filter((obj: EntityStructure) => obj.type === 4).length
    const areas = entities?.data.data.filter((obj: EntityStructure) => obj.type === 5).length
    const plans = entities?.data.data.filter((obj: EntityStructure) => obj.type === 6).length
    const equipments = await getEquipments()
    const users = await getUsers()

    const response = {
      entities: {
        plants,
        areas
      },
      equipments: equipments.data.data.length,
      documents: documents?.count,
      plans,
      users: users.data.data.length
    }

    return response

  } catch (error: any) {
    // if (error.status === 401 && error.message === 'Token vencido, se redirigirá al login') {
    //   throw new OwnExpTokenError('Token vencido, se redirigirá al login', 401)
    // }
    console.log(error)

    // throw new Error('Error en admin dashboard')
  }
  // const response = await getEntities()
  // if (response.status !== 200) {
  //   throw new Error('Error en respuesta')
  // }
  // return response.data.data.filter((obj: EntityStructure) => obj.type !== 6)
}

export default async function Admin() {
  const session = await getServerSession(authOptions)

  const response = await getData(session?.access_token)

  const cardArray = [
    {
      id: 1,
      title: 'Entidades',
      length: response?.entities,
      icon: <FaHouse size={50} />,
      route: '/admin/entities'
    },
    {
      id: 2,
      title: 'Documentos',
      length: response?.documents,
      icon: <FaFile size={50} />,
      route: '/admin/documents'
    },
    {
      id: 3,
      title: 'Equipos',
      length: response?.equipments,
      icon: <FaVolcano size={50} />,
      route: '/admin/equipments'
    },
    {
      id: 4,
      title: 'Planos',
      length: response?.plans,
      icon: <FaMap size={50} />,
      route: '/admin/plans'
    },
    {
      id: 5,
      title: 'Usuarios',
      length: response?.users,
      icon: <FaUser size={50} />,
      route: '/admin/users'
    }
  ]
  return (
    <div className='flex flex-col justify-center items-center h-full p-2'>
      <h1 className='text-left w-full'>DASHBOARD</h1>
      <div className='flex flex-col justify-center items-center h-full'>
        {
          <Link href={cardArray[0].route}>
            <CardAdmin modLength={cardArray[0]} className='-mt-20 mb-10' />
          </Link>
        }
        <div className='grid lg:grid-cols-2 sm:grid-cols-1 gap-10'>
          {
            cardArray.filter((obj) => obj.id > 1).map((card) => {
              return (
                <Link href={card.route} key={card.id}>
                  <CardAdmin modLength={card} />
                </Link>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}
