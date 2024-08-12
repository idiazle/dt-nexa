'use client'
import { UserStructure } from '@/lib/utils'
import React, { useCallback, useMemo, useState } from 'react'
import { DataTable } from './data-table'
import { columnsUsers } from './columns'
import { useRouter } from 'next/navigation'
import { deleteUserById } from '@/api/admin/users-api'
import { toast } from '@/components/ui/use-toast'
import UserDialog from '@/components/admin/users/user-dialog'
import AlertDeleteDialog from '@/components/general/alert-delete-dialog'

interface UserTableStructure {
    data: UserStructure[]
}

export default function UsersTable({ data }: UserTableStructure) {

    const [selectedUser, setSelectedUser] = useState<UserStructure | null>(null)
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    const [openAlertDelete, setOpenAlertDelete] = useState<boolean>(false)
    const router = useRouter()

    const onDelete = useCallback(async (user: any) => {
        setOpenAlertDelete(true)
        setSelectedUser(user)
    }, []);
    const onEdit = useCallback((user: any) => {
        setSelectedUser(user);
        setDialogOpen(true);
    }, []);

    const delEntity = async () => {
        if (selectedUser !== null) {
            try {
                const response = await deleteUserById(selectedUser.id)
                if (response.status === 200) {
                    router.refresh()
                    toast({
                        duration: 3000,
                        variant: 'destructive',
                        title: 'Eliminación ',
                        description: 'Usuario eliminado correctamente'
                    })
                }
            } catch (error) {
                throw new Error('Error al eliminar el usuario')
            }
        }
    }

    const columns = useMemo(() => columnsUsers({ onEdit, onDelete }), [])
    return (
        <div>
            <DataTable columns={columns} data={data} />
            {
                dialogOpen && selectedUser !== null ? <UserDialog id={selectedUser.id} setDialogOpen={setDialogOpen} dialogOpen={dialogOpen} /> : null
            }
            {
                openAlertDelete && selectedUser !== null ? <AlertDeleteDialog open={openAlertDelete} setOpen={setOpenAlertDelete} executeMethod={delEntity} objName={selectedEntity.name} /> : null
            }
        </div>
    )
}
