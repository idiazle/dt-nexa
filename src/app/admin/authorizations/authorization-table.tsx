'use client'
import React, { useCallback, useMemo, useState } from 'react'
import { AuthorizationStructure} from '@/lib/utils'
import { DataTable } from './data-table'
import { columnsAuthorizations } from './columns'
import { useRouter } from 'next/navigation'
import { deleteGroupById } from '@/api/admin/users-api'
import { toast } from '@/components/ui/use-toast'
import AuthorizationDialog from '@/components/admin/authorizations/authorization-dialog'
import AlertDeleteDialog from '@/components/general/alert-delete-dialog'

interface UserTableStructure {
  data: AuthorizationStructure[]
}

export default function AuthorizationTable({ data }: UserTableStructure) {

  const [selectedAuthoriz, setSelectedAuthoriz] = useState<AuthorizationStructure | null>(null)

  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [openAlertDelete, setOpenAlertDelete] = useState<boolean>(false)
  const router = useRouter()

  const onDelete = useCallback(async (authoriz: any) => {
    setOpenAlertDelete(true)
    setSelectedAuthoriz(authoriz)
  }, []);
  const onEdit = useCallback((authoriz: any) => {
    setSelectedAuthoriz(authoriz);
    setDialogOpen(true);
  }, []);

  const delAuthorization = async () => {
    if (selectedAuthoriz !== null) {
        try {
            const response = await deleteGroupById(selectedAuthoriz.id)
            if (response.status === 200) {
                router.refresh()
                toast({
                    duration: 3000,
                    variant: 'destructive',
                    title: 'Eliminación ',
                    description: 'Autorización eliminada correctamente'
                })
            }
        } catch (error) {
            throw new Error('Error al eliminar la entidad')
        }
    }
}

  const columns = useMemo(() => columnsAuthorizations({ onEdit, onDelete }), [])

  return (
    <div>
      <DataTable columns={columns} data={data} />
      {
        dialogOpen && selectedAuthoriz !== null ? <AuthorizationDialog id={selectedAuthoriz.id} setDialogOpen={setDialogOpen} dialogOpen={dialogOpen} /> : null
      }
      {
        openAlertDelete && selectedAuthoriz !== null ? <AlertDeleteDialog open={openAlertDelete} setOpen={setOpenAlertDelete} executeMethod={delAuthorization} objName={selectedAuthoriz.name} /> : null
      }
    </div>
  )
}
