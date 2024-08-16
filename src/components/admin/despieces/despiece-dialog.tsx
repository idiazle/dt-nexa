import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useSession } from 'next-auth/react'
import { DespieceInfoStructure, EntityStructure, EquipmentStructure } from '@/lib/utils'
import { getEquipments } from '@/api/admin/equipments-api'
import { getEntities } from '@/api/admin/entities-api'
import { getDespieceById, postDespiece, putDespiece } from '@/api/admin/despieces-api'
import { useRouter } from 'next/navigation'
import { MdEditDocument, MdFileUpload } from 'react-icons/md'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import Spinner from '@/components/ui/spinner'
import { Input } from '@/components/ui/input'
import { CheckCircleIcon } from 'lucide-react'
import { FaFileImage, FaFileVideo } from 'react-icons/fa6'

interface DespieceDialogStructure {
  id: number | null
  dialogOpen: boolean
  setDialogOpen: (value: boolean) => void
}


export default function DespieceDialog({ id, dialogOpen, setDialogOpen }: DespieceDialogStructure) {
  const [selOptionDespiece, setSelOptionDespiece] = useState<string>('1')
  const { data: session } = useSession()
  const initialState: {
    description: string
    user_id: number
    equipment_id: string
    control_interactive: string
  } = {
    description: '',
    user_id: Number(session?.user?.id),
    equipment_id: '',
    control_interactive: 'DSPC'
  }
  const [despieceInfo, setDespieceInfo] = useState<DespieceInfoStructure>(initialState)

  const settingControlInteractive = (value: string) => {
    let val

    if (value === '1') {
      val = 'DSPC'
    } else if (value === '2') {
      val = 'PFD'
    } else {
      val = 'CTRL'
    }

    setDespieceInfo({ ...despieceInfo, control_interactive: val })
  }

  const [equipments, setEquipments] = useState<EquipmentStructure[] | null>(null)

  const getAllEquipments = async () => {
    try {
      const response = await getEquipments()
      if (response.status === 200) {
        setEquipments(response.data.data)
      }
    } catch (error: any) {
      throw new Error('Error al obtener los equipos')
    }
  }
  useEffect(() => {
    if (dialogOpen) {
      getAllEquipments()
    }
  }, [id, dialogOpen])

  const [entities, setEntities] = useState<EntityStructure[] | null>(null)

  const getAllEntities = async () => {
    try {
      const response = await getEntities()
      if (response.status === 200) {
        setEntities(response.data.data)
      }
    } catch (error) {
      throw new Error('ERROR AL OBTENER ENTIDADES')
    }
  }

  useEffect(() => {
    if (dialogOpen) {
      getAllEntities()
    }
  }, [dialogOpen])

  const initialFilesState = {
    file: null,
    img_main: null,
    img_gif: null,
    video: null
  }

  const [files, setFiles] = useState<{
    file: File | null
    img_main: File | null
    img_gif: File | null
    video: File | null
  }>(initialFilesState)

  const getDespiece = async () => {
    setDespieceInfo(initialState)
    try {
      if (id !== null) {
        const response = await getDespieceById(id)

        if (response.status === 200) {
          // reader.readAsDataURL(response.data.data.img_main as string)
          // const ss = await fetch(response.data.data.img_main as string)
          //   .then(async (res) => await res.blob())
          //   .then((myBlob) => {
          //     const myFile = new File([myBlob], 'image.jpeg', { type: myBlob.type })
          //     return myFile
          //   })
          // setFiles({
          //   ...files,
          //   img_main: response.data.data.img_main
          // })

          setDespieceInfo(response.data.data as DespieceInfoStructure)
        }
      }
    } catch (error) {
      throw new Error('ERROR EN MODAL DESPIECE')
    }
  }

  useEffect(() => {
    if (id !== null && dialogOpen) {
      getDespiece()
    }
  }, [id, dialogOpen])

  const handleFormChange = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement
    setDespieceInfo({
      ...despieceInfo,
      [target.name]: target.value
    })
  }

  const handleFilesChange = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement
    if (target.files !== null) {
      setFiles({
        ...files,
        [target.name]: target.files[0]
      })
    }
  }
  const [progressUpload, setProgressUpload] = useState<any>(null)
  const [isSaved, setIsSaved] = useState<boolean>(false)
  // const [btnSaveStatus, setBtnSaveStatus] = useState<boolean>(true)
  // const verifyFiles = () => {
  //   let boolStatus
  //   if (despieceInfo?.description === '' || despieceInfo?.equipment_id === '' || files?.file === null || files?.img_gif === null || files?.img_main === null || files?.video === null) {
  //     boolStatus = true
  //   } else {
  //     boolStatus = false
  //   }
  //   setBtnSaveStatus(boolStatus)
  // }
  // useEffect(() => {
  //   verifyFiles()
  // }, [despieceInfo, files])

  const router = useRouter()

  const resetFields = () => {
    setDialogOpen(false)
    setDespieceInfo(initialState)
    setFiles(initialFilesState)
    setIsSaved(false)
    setProgressUpload(null)
  }
  const handleSubmitData = async () => {
    setIsSaved(true)
    const mpart = new FormData()
    mpart.append('description', despieceInfo.description)
    mpart.append('user_id', String(session?.user.id))
    mpart.append('equipment_id', despieceInfo.equipment_id)
    mpart.append('control_interactive', despieceInfo.control_interactive)
    mpart.append('file', files.file ?? '')
    mpart.append('img_gif', files.img_gif ?? '')
    mpart.append('img_main', files.img_main ?? '')
    mpart.append('video', files.video ?? '')
    const config = {
      onUploadProgress: async (progressEvent: any) => {
        const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100)
        setProgressUpload(progress - 1)
      },
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    try {
      if (id === null) {
        const response = await postDespiece(mpart, config)
        if (response.status === 201) {
          router.refresh()
        }
      } else {
        const response = await putDespiece(mpart, Number(id), config)
        if (response.status === 200) {
          router.refresh()
        }
      }
      resetFields()
    } catch (error) {

    }
  }
  return (
    <Dialog open={dialogOpen} onOpenChange={(val) => {
      setDialogOpen(val)
      if (!val) {
        setFiles(initialFilesState)
        setDespieceInfo(initialState)
      }
    }}>
      {

        <DialogTrigger asChild>
          {
            id === null
              ? <Button onClick={() => { setDialogOpen(true) }}>
                Crear despiece
              </Button>
              : <Button variant={'outline'} className='' onClick={() => { setDialogOpen(true) }}>
                <MdEditDocument size={22} />
              </Button>
          }

        </DialogTrigger>

      }
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className='max-h-[95vh] overflow-auto min-w-[80vw]' onPointerDownOutside={(e) => { e.preventDefault() }}>
          <DialogHeader>
            <DialogTitle>{id === null ? 'CREAR' : 'EDITAR'} DESPIECE</DialogTitle>
          </DialogHeader>
          {
            isSaved
              ? progressUpload !== 100
                // eslint-disable-next-line multiline-ternary
                ? <div className='absolute flex justify-center items-center top-0 right-0 left-0 m-auto h-full w-full bg-black/30 backdrop-blur-sm z-30'>
                  {/* <ReloadIcon className="mr-2 h-72 w-52 animate-spin" /> */}
                  <AiOutlineLoading3Quarters className="mr-2 h-72 w-52 animate-spin" />

                  <h1 className='absolute text-lg'>Subiendo {progressUpload} %</h1>
                </div> : null
              : null
          }
          {/* {
            isSaved
              ? progressUpload !== 100
                ? <div className="fixed flex justify-center items-center right-0 top-0 left-0 m-auto h-full w-screen bg-black/30 backdrop-blur-sm z-30">
                  <Progress className="w-[60%]" value={progressUpload}>
                    <CircularProgressLabel>{progressUpload}%</CircularProgressLabel>
                  </Progress>
                </div>
                : null
              : null
          } */}
          <div className='h-full w-full'>
            <div className='flex flex-col gap-2 justify-center items-start mb-3'>
              {/* <p>Seleccione el tipo de interactivo</p> */}
              <Select onValueChange={(val) => {
                setSelOptionDespiece(val)
                settingControlInteractive(val)
              }} value={selOptionDespiece}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el tipo de Interactivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {/* <SelectLabel>Tipos de interactivo</SelectLabel> */}
                    <SelectItem value="1">Despiece</SelectItem>
                    <SelectItem value="2">PFD</SelectItem>
                    <SelectItem value="3">Control</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {
              despieceInfo == null
                ? <div className='flex items-center justify-center'>
                  <Spinner />
                </div>

                : selOptionDespiece === ''
                  ? null

                  : <div className='flex flex-col gap-2'>
                    {
                      despieceInfo.control_interactive === 'DSPC'
                        ? <div className="flex flex-row items-center">
                          <div className="w-1/2">
                            <p >Equipo referenciado:</p>
                          </div>
                          <div className="w-1/2">
                            {
                              equipments == null
                                ? <h1>Cargando</h1>
                                : <Select value={String(despieceInfo.equipment_id)} onValueChange={(e) => {
                                  // console.log(e)

                                  setDespieceInfo({ ...despieceInfo, equipment_id: e })
                                }}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccione el equipo" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {
                                      equipments.map((obj) => {
                                        return (
                                          <SelectItem key={obj.equipment_id} value={String(obj.equipment_id)}>{obj.name}</SelectItem>
                                        )
                                      })
                                    }
                                  </SelectContent>

                                </Select>
                            }
                          </div>
                        </div>
                        : <div className="flex flex-row items-center">
                          <div className="w-1/2">
                            <p >Entidad referenciada:</p>
                          </div>
                          <div className="w-1/2">
                            {
                              entities == null
                                ? <h1>Cargando</h1>
                                : <Select
                                  value={String(despieceInfo.equipment_id)}
                                  onValueChange={(e) => {
                                    setDespieceInfo({ ...despieceInfo, equipment_id: e })
                                  }}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccione el equipo" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {
                                      entities.map((obj) => {
                                        return (
                                          <SelectItem key={obj.id} value={String(obj.id)}>{obj.name}</SelectItem>

                                          // <option key={obj.id} value={obj.id}>{obj.name}</option>
                                        )
                                      })
                                    }
                                  </SelectContent>

                                </Select>
                            }
                          </div>
                        </div>

                    }
                    <div className="flex flex-row items-center">
                      <div className="w-1/2">
                        <p >Descripción:</p>
                      </div>
                      <div className="w-1/2">
                        <Input value={despieceInfo.description} name="description" onChange={handleFormChange}></Input>
                      </div>
                    </div>
                    <div className="flex flex-row items-center">
                      <div className="w-1/2">
                        <p >File:</p>
                      </div>
                      <div className="w-1/2">
                        <Input id='dropzone-file' hidden className='hidden' type='file' name="file" onChange={handleFilesChange}></Input>
                        <label
                          style={{
                            width: '100%',
                            height: '30px',
                            border: '1px solid #eaeaea',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '18px',
                            cursor: 'pointer'
                          }}
                          htmlFor="dropzone-file"
                        >
                          {files.file !== null
                            ? (
                              <p className='flex text-sm flex-row justify-center items-center gap-1'>
                                Nombre: {files.file?.name}
                                <CheckCircleIcon className="text-green-400"></CheckCircleIcon>
                              </p>
                            )
                            : (
                              <div className="flex flex-row justify-center item-center gap-2">
                                <MdFileUpload />
                                <p className="text-sm">
                                  Seleccione su archivo
                                </p>
                              </div>
                            )}
                        </label>
                      </div>
                    </div>
                    <div className="flex flex-row items-center">
                      <div className="w-1/2">
                        <p >Imagen principal:</p>
                      </div>
                      <div className="w-1/2 flex flex-row justify-center items-center">
                        <Input id='dropzone-image' hidden className='hidden' type='file' name="img_main" onChange={handleFilesChange}></Input>
                        {/* {
                          files.img_main !== null
                            ? <Image
                              alt={files?.img_main?.name}
                              src={files?.img_main}
                              width={100}
                              height={100}
                            />
                            : null
                        } */}
                        <label
                          style={{
                            width: '100%',
                            height: '30px',
                            border: '1px solid #eaeaea',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '18px',
                            cursor: 'pointer'
                          }}
                          htmlFor="dropzone-image"
                        >
                          {files.img_main !== null
                            ? (
                              <div className='flex text-sm flex-row justify-center items-center gap-1'>
                                <p>Nombre: {files.img_main?.name}</p>

                                <CheckCircleIcon className="text-green-400"></CheckCircleIcon>

                              </div>
                            )
                            : (
                              <div className="flex flex-row justify-center item-center gap-2">
                                <FaFileImage />
                                <p className="text-sm">
                                  Seleccione su archivo
                                </p>
                              </div>
                            )}
                        </label>
                      </div>
                    </div>
                    <div className="flex flex-row items-center">
                      <div className="w-1/2">
                        <p >Imagen GIF:</p>
                      </div>
                      <div className="w-1/2">
                        <Input id='dropzone-gif' hidden className='hidden' type='file' name="img_gif" onChange={handleFilesChange}></Input>
                        <label
                          style={{
                            width: '100%',
                            height: '30px',
                            border: '1px solid #eaeaea',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '18px',
                            cursor: 'pointer'
                          }}
                          htmlFor="dropzone-gif"
                        >
                          {files.img_gif !== null
                            ? (
                              <p className='flex text-sm flex-row justify-center items-center gap-1'>
                                Nombre: {files.img_gif?.name}
                                <CheckCircleIcon className="text-green-400"></CheckCircleIcon>
                              </p>
                            )
                            : (
                              <div className="flex flex-row justify-center item-center gap-2">
                                <FaFileImage />
                                <p className="text-sm">
                                  Seleccione su archivo
                                </p>
                              </div>
                            )}
                        </label>
                      </div>
                    </div>
                    <div className="flex flex-row items-center">
                      <div className="w-1/2">
                        <p >Video:</p>
                      </div>
                      <div className="w-1/2">
                        <Input id='dropzone-video' hidden className='hidden' type='file' name="video" onChange={handleFilesChange}></Input>
                        <label
                          style={{
                            width: '100%',
                            height: '30px',
                            border: '1px solid #eaeaea',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '18px',
                            cursor: 'pointer'
                          }}
                          htmlFor="dropzone-video"
                        >
                          {files.video !== null
                            ? (
                              <p className='flex text-sm flex-row justify-center items-center gap-1'>
                                Nombre: {files.video?.name}
                                <CheckCircleIcon className="text-green-400"></CheckCircleIcon>
                              </p>
                            )
                            : (
                              <div className="flex flex-row justify-center item-center gap-2">
                                <FaFileVideo />
                                <p className="text-sm">
                                  Seleccione su archivo
                                </p>
                              </div>
                            )}
                        </label>
                      </div>
                    </div>

                  </div>
            }
          </div>
          <DialogFooter>
            <Button type="button" onClick={() => {
              handleSubmitData()
            }}>Guardar</Button>
            <Button type="button" onClick={() => {
              setDialogOpen(false)
              setDespieceInfo(initialState)
              setFiles(initialFilesState)
            }}>Cancelar</Button>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
