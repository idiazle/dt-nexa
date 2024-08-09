import EntityDialog from '@/components/admin/entities/entity-dialog'
import FormEntity from '@/components/admin/entities/form-entity'
import React from 'react'

export default function page() {
  return (
    <div className='h-full w-full'>
      <div className='flex flex-row justify-between items-center'>
        <h1 className='font-semibold text-2xl'>Entidades: Plantas y Áreas</h1>
        <EntityDialog id={null} />
      </div>
    </div>
  )
}
