'use client'
import { getGroupById, getPermissions, postGroup, putGroup } from '@/api/admin/users-api'
import { PermissionsListStructure, PermissionsStructure } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,

  DialogFooter,

  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FaCircleArrowLeft, FaCircleArrowRight, FaFilePen } from 'react-icons/fa6'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/components/ui/use-toast'

interface AuthorizationDialogStructure {
  id: number | null
  dialogOpen: boolean
  setDialogOpen: (value: boolean) => void
}
interface SonPermission extends PermissionsStructure {
  isChecked: boolean
}
interface FatherPermission extends PermissionsListStructure {
  isChecked: boolean
  permissions: SonPermission[]
}


export default function AuthorizationDialog({ id, dialogOpen, setDialogOpen }: AuthorizationDialogStructure) {
  const router = useRouter()
  const [permissionsGet, setPermissionsGet] = useState<FatherPermission[] | null>(null)
  const [permissionSearch, setPermissionSearch] = useState<FatherPermission[] | null>(null)
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([])
  const getAllPermissions = async () => {
    try {
      const response = await getPermissions()
      const rpta = response.data.data.map((perm: FatherPermission) => {
        return {
          ...perm,
          permissions: perm.permissions.map((obj: SonPermission) => {
            return {
              ...obj,
              isChecked: false
            }
          }),
          isChecked: false
        }
      })
      // console.log(rpta)
      if (id !== null) {
        // console.log('Ejecutando')
        try {
          const response = await getGroupById(id)
          const data = response.data.data
          setGroupName(data.name as string)
          const ss = data.user_permissions.flatMap((obj: any) => obj.permissions_id)
          const permissionsSacados: any[] = []

          const filterWithIdPerms = rpta.map((obj: FatherPermission) => {
            let cont = 0
            return {
              ...obj,
              permissions: obj.permissions.map((per) => {
                const ss2 = ss.find((obx: number) => obx === per.id)
                ss.map((objS3: number) => {
                  if (objS3 === per.id) {
                    return cont++
                  } else {
                    return 0
                  }
                })
                // cont = ss2.length
                if (ss2 !== undefined) {
                  return {
                    ...per,
                    isChecked: true
                  }
                } else {
                  return per
                }
              }),
              isChecked: cont === 4
            }
          })

          setPermissionsGet(filterWithIdPerms as FatherPermission[])
        } catch (error) {
          throw new Error('Error al obtener el grupo')
        }
      } else {
        setPermissionsGet(rpta as FatherPermission[])
      }
    } catch (error) {
      throw new Error('Error getting permissions')
    }
  }

  useEffect(() => {
    if (dialogOpen) {
      getAllPermissions()
    }
  }, [dialogOpen])
  const [query, setQuery] = useState<string>('')

  const searchPermissions = () => {
    if (permissionsGet !== null) {
      const filterList = permissionsGet?.filter(item => {
        const res = item.content_type_name
        return res.toLowerCase().includes(query.toLowerCase())
      })
      setPermissionSearch(filterList)
    }
  }
  useEffect(() => {
    searchPermissions()
  }, [query, permissionsGet])

  const settingPerms = () => {
    const endSelPerms = permissionsGet?.flatMap(obj => obj.permissions.filter(obj2 => obj2.isChecked)).map(xxx => xxx.id)
    setSelectedPermissions(endSelPerms ?? [])
  }

  useEffect(() => {
    if (permissionsGet !== null) {
      settingPerms()
    }
  }, [permissionsGet])

  const handleChangeCheckbox = (checked: boolean, father: any, ele: any) => {
    if (checked) {
      setPermissionsGet(prevstate => prevstate?.map((obj) => {
        return {
          ...obj,
          permissions: obj.permissions.map((perm) => {
            if (perm.id === ele.id) {
              return {
                ...perm,
                isChecked: true
              }
            } else {
              return perm
            }
          })
        }
      }) ?? null)
      // setSelectedPermissions([...selectedPermissions, ele])
    } else {
      setPermissionsGet(prevstate => prevstate?.map((obj) => {
        return {
          ...obj,
          permissions: obj.permissions.map((perm) => {
            if (perm.id === ele.id) {
              return {
                ...perm,
                isChecked: false
              }
            } else {
              return perm
            }
          })
        }
      }) ?? null)
      // const filtered = selectedPermissions?.filter(item => {
      //   return item.id !== ele.id
      // })
      // setSelectedPermissions(filtered)
    }
    setPermissionsGet(prevstate => prevstate?.map((obj) => {
      let cont = 0
      obj.permissions.map((per) => {
        if (per.isChecked) {
          return cont++
        } else {
          return 0
        }
      })
      return {
        ...obj,
        isChecked: cont === 4
      }
    }) ?? null)
  }

  const handleFatherCheckbox = (checked: boolean, obj: any) => {
    if (checked) {
      setPermissionsGet(prevstate => prevstate?.map((perm) => {
        if (perm.content_type_name === obj.content_type_name) {
          return {
            ...perm,
            isChecked: true,
            permissions: perm.permissions.map((obj) => {
              return {
                ...obj,
                isChecked: true
              }
            })
          }
        } else {
          return perm
        }
      }) ?? null)
    } else {
      setPermissionsGet(prevstate => prevstate?.map((perm) => {
        if (perm.content_type_name === obj.content_type_name) {
          return {
            ...perm,
            isChecked: false,
            permissions: perm.permissions.map((obj) => {
              return {
                ...obj,
                isChecked: false
              }
            })
          }
        } else {
          return perm
        }
      }) ?? null)
    }
  }

  const addRemoveAllPerms = (opType: string) => {
    if (opType === 'add') {
      setPermissionsGet(prevstate => prevstate?.map((perm) => {
        return {
          ...perm,
          isChecked: true,
          permissions: perm.permissions.map((obj) => {
            return {
              ...obj,
              isChecked: true
            }
          })
        }
      }) ?? null)
    } else {
      setPermissionsGet(prevstate => prevstate?.map((perm) => {
        return {
          ...perm,
          isChecked: false,
          permissions: perm.permissions.map((obj) => {
            return {
              ...obj,
              isChecked: false
            }
          })
        }
      }) ?? null)
    }
  }

  const [groupName, setGroupName] = useState<string>('')
  const { toast } = useToast()
  const saveData = async () => {
    const sendR = {
      name: groupName,
      permissions: selectedPermissions
    }
    if (id === null) {
      try {
        const response = await postGroup(sendR)
        if (response.status === 201) {
          toast({
            duration: 3000,
            variant: 'default',
            title: 'Creación',
            description: 'Grupo creado correctamente'
          })
          router.refresh()
          setDialogOpen(false)
        }
      } catch (error) {
        throw new Error('Error al crear grupo')
      }
    } else {
      if (id !== null) {
        try {
          const response = await putGroup(id, sendR)
          if (response.status === 200) {
            toast({
              duration: 3000,
              variant: 'default',
              title: 'Edición',
              description: 'Grupo editado correctamente'
            })
            router.refresh()
            setDialogOpen(false)
          }
        } catch (error) {
          throw new Error('Error al editar grupo')
        }
      }
    }
    setSelectedPermissions([])
    setGroupName('')
  }
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {/* <DialogTrigger asChild>
        {
          id === null
            ? <p >
              Crear Grupo
            </p>
            : <p  >
              <FaFilePen size={18} />
            </p>
        }
      </DialogTrigger> */}
      {
        dialogOpen
          ? <DialogContent className="max-h-[80vh] h-full overflow-hidden max-w-[55vw]">
            <DialogHeader>
              <DialogTitle>{id === null ? 'Crear' : 'Editar'} grupo </DialogTitle>
              {/* <DialogDescription className='flex flex-row gap-5'>
                                <p>Se muestra el listado de permisos que posee el grupo elegido:</p>
                            </DialogDescription> */}
            </DialogHeader>
            <div className="flex flex-col p-2 h-full overflow-auto">
              <div className='flex flex-col gap-2 w-1/2'>
                <Label htmlFor="name">Nombre</Label>
                <Input value={groupName} type="text" id="name" placeholder="name" onChange={(e) => { setGroupName(e.target.value) }} />
              </div>
              <Separator className='my-3' />
              <div className='p-3 h-5/6 flex flex-row gap-3'>
                <div className='h-full w-full flex flex-col justify-center items-center'>
                  <div className='w-full border p-2'>
                    <div className='flex flex-row justify-between items-center'>
                      <h1>Permisos Disponibles</h1>
                      <Button variant={'ghost'} onClick={() => { addRemoveAllPerms('add') }} className='flex flex-row gap-2 mt-2 h-8 w-40'>
                        <p className='text-xs'>Seleccionar todo</p>
                        <FaCircleArrowRight size={16} />
                      </Button>
                    </div>
                    <Input
                      className='my-2 w-full'
                      value={query}
                      onChange={e => { setQuery(e.target.value) }}
                      placeholder='-- Filtros --'
                    />
                  </div>
                  <div className='h-full overflow-auto w-full border-x border-b p-2'>
                    {
                      permissionSearch !== null && permissionSearch?.length === 0
                        ? <h1>No existe el permiso respecto al criterio de búsqueda ingresados</h1>
                        : permissionSearch?.map((obj, index) => {
                          return (
                            <div key={index}>
                              <div className='flex flex-row gap-3 justify-between items-center'>
                                <p>{index + 1 + '. ' + obj.content_type_name.replaceAll('"', '')}</p>
                                <Checkbox defaultChecked={obj.isChecked} checked={obj.isChecked} onCheckedChange={(val: boolean) => { handleFatherCheckbox(val, obj) }} />
                              </div>
                              {
                                obj.permissions.map((perm) => {
                                  return (
                                    <li key={perm.id} className="flex items-center gap-2 text-sm m-1 mx-3">
                                      <Checkbox defaultChecked={perm.isChecked} checked={perm.isChecked} onCheckedChange={(val: boolean) => { handleChangeCheckbox(val, obj, perm) }} />
                                      - {perm.codename.split('_')[0]}
                                    </li>
                                  )
                                })
                              }
                            </div>
                          )
                        })

                    }
                  </div>

                </div>
                <Separator orientation='vertical' />
                {/* <div className='flex flex-col justify-center items-center gap-3'>
                  <FaCircleArrowRight />
                  <FaCircleArrowLeft />
                </div> */}
                <div className='h-full w-full flex flex-col justify-center items-center'>
                  <div className='w-full border p-2'>
                    <div className='flex flex-row justify-between items-center'>
                      <h1>Permisos Elegidos</h1>
                      <Button variant={'ghost'} onClick={() => { addRemoveAllPerms('remove') }} className='flex flex-row gap-2 mt-2 h-8 w-32'>
                        <FaCircleArrowLeft size={16} />
                        <p className='text-xs'>Eliminar todo</p>
                      </Button>
                    </div>

                  </div>
                  <div className='h-full overflow-auto w-full border-x border-b p-2'>
                    {
                      permissionSearch?.filter(obj => (obj.permissions.filter((oe) => oe.isChecked)).length > 0)?.map((obj, index) => {
                        return (
                          <div key={index}>
                            <p>{index + 1 + '. ' + obj.content_type_name.replaceAll('"', '')}</p>
                            {
                              obj.permissions.filter(obj2 => obj2.isChecked).map((perm) => {
                                return (
                                  <li key={perm.id} className="flex items-center gap-2 text-sm m-1 mx-3">
                                    - {perm.codename.split('_')[0]}
                                  </li>
                                )
                              })
                            }
                          </div>
                        )
                      }) ?? null
                    }
                    {/* <h1>{JSON.stringify(selectedPermissions)}</h1> */}
                    {/* {

                      selectedPermissions?.map((obj, index) => {
                        return (
                          <div key={index}>
                            <p>{index + 1 + '. ' + obj.content_type_name.replaceAll('"', '')}</p>
                            {
                              obj.permissions.map((perm) => {
                                return (
                                  <li key={perm.id} className="flex items-center gap-2 text-sm m-1 mx-3">
                                    - {perm.codename}
                                  </li>
                                )
                              })
                            }
                          </div>
                        )
                      }) ?? null
                    } */}
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="">
              <div className='flex flex-row justify-end items-center gap-3 w-full'>
                <Button onClick={async () => { await saveData() }} className='w-1/5' type="button" variant="secondary" >
                  {id === null ? 'Guardar' : 'Editar'}
                </Button>
                <Button onClick={() => { setDialogOpen(false) }} className='w-1/5' type="button" variant="secondary">
                  Cerrar
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
          : null
      }

    </Dialog>
  )
}
