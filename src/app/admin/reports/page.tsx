'use client'
import { getEquipments } from '@/api/admin/equipments-api'
import { getNodes360, patchPhotogNodeById } from '@/api/admin/nodes360-api'
import { deleteReportCondById, getReportsCond, postReportCond } from '@/api/admin/reports-api'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import ModalViewMedia from '@/components/viewers/modal-viewer'
import { ChangeEvent, use, useEffect, useState } from 'react'
import { FaCircle, FaTrash } from 'react-icons/fa6'
import { toast } from '@/components/ui/use-toast'
import { DialogDescription } from '@radix-ui/react-dialog'

const Reports = () => {
  const [equipments, setEquipments] = useState<any[]>([])
  const [reports, setReports] = useState<any[]>([])
  const [documentFile, setDocumentFile] = useState<File | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [loading, setLoading] = useState(false)
  const [allNodes, setAllNodes] = useState<any[]>([])
  const [fileSelected, setFileSelected] = useState<any | null>(null)
  const [openDialogDoc, setOpenDialogDoc] = useState<boolean>(false)

  const [data, setData] = useState<any>({
    equipment: 0,
    filename: '',
    cond: 0
  })

  const getAllEquipments = () => {
    getEquipments().then((resp) => {
      if (resp.status === 200) {
        // console.log('Equipos obtenidos', resp.data.data)
        setEquipments(resp.data.data)
      } else {
        console.log('Error al obtener los equipos')
      }
    }).catch((err) => {
      console.log('Error al obtener los equipos', err)
    })

    getReportsCond().then((resp) => {
      if (resp.status === 200) {
        setReports(resp.data.data)
      } else {
        console.log('Error al obtener los reportes')
      }
    }
    ).catch((err) => {
      console.log('Error al obtener los reportes', err)
    })
  }

  useEffect(() => {
    getAllEquipments()
  }, [])

  useEffect(() => {
    getNodes360().then((resp) => {
      if (resp.status === 200) {
        // console.log('Nodos obtenidos', resp.data.data)
        setAllNodes(resp.data.data)
      } else {
        console.log('Error al obtener los nodos')
      }
    }).catch((err) => {
      console.log('Error al obtener los nodos', err)
    })
  }, [])

  const getNodeByEquipmentId = (equipmentId: number, condition: string) => {
    const conditionColors: Record<string, { fill: string; stroke: string }> = {
      '1': { fill: 'rgba(239,68,68,0.4)', stroke: 'rgba(239,68,68,0.8)' },    // rojo
      '2': { fill: 'rgba(202,138,4,0.4)', stroke: 'rgba(202,138,4,0.8)' },    // naranja
      '3': { fill: 'rgba(250,204,21,0.4)', stroke: 'rgba(250,204,21,0.8)' },  // amarillo
      '4': { fill: 'rgba(34,197,94,0.4)', stroke: 'rgba(34,197,94,0.8)' },    // verde
      '5': { fill: 'rgba(75,85,99,0.4)', stroke: 'rgba(75,85,99,0.8)' },      // gris oscuro
      '6': { fill: 'rgba(209,213,219,0.4)', stroke: 'rgba(209,213,219,0.8)' } // gris claro
    }

    const updatedNodes: any[] = []

    let tempNodes: any[] = []
    allNodes.map((node) => {
      const temp = JSON.parse(node.markers)
      temp?.map((v360: any) => {
        if (Number(v360?.equipment_id) === equipmentId) {
          tempNodes.push(node)
        }
      })
    })

    tempNodes.forEach((node) => {
      const markers = JSON.parse(node.markers)
      let updated = false

      markers.forEach((v360: any) => {
        if (Number(v360?.equipment_id) === equipmentId) {
          const color = conditionColors[condition]
          if (color) {
            v360.svgStyle = {
              fill: color.fill,
              stroke: color.stroke,
              strokeWidth: '2px',
            }
            updated = true
          }
        }
      })

      if (updated) {
        node.markers = JSON.stringify(markers)
        updatedNodes.push(node)
        // console.log('Markers del nodo actualizado:', markers)
      }
    })
    // console.log('Update:', updatedNodes)

    // Si deseas guardar los cambios en el backend:
    updatedNodes.forEach((node) => {
      patchPhotogNodeById(node.id, { markers: node.markers })
        .then((resp) => {
          if (resp.status === 200) {
            console.log('Nodo actualizado correctamente:', resp.data)
          } else {
            console.error('Error al actualizar el nodo')
          }
        })
        .catch((err) => {
          console.error('Error al actualizar el nodo', err)
        })
    })
  }


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    })
  }
  const handleSelect = (e: any) => {
    setData({
      ...data,
      equipment: Number(e)
    })
  }
  const handleSelectCond = (e: any) => {
    setData({
      ...data,
      cond: Number(e)
    })
  }

  const handleViewDoc = (file: any) => {
    setFileSelected({
      data: {
        title: file.filename,
        file_url: file.file,
        name: file.filename,
        filename: file.filename,
      }
    })
    setOpenDialogDoc(true)
  }

  const handleSubmit = () => {
    setLoading(true)
    const formData = new FormData()
    formData.append('file', documentFile as Blob)
    formData.append('equipment', data.equipment)
    formData.append('cond', data.cond.toString())
    formData.append('filename', data.filename)
    console.log('formData', formData)
    getNodeByEquipmentId(data.equipment, data.cond.toString())
    postReportCond(formData).then((resp) => {
      if (resp.status === 201) {
        // console.log('Reporte generado')
        setLoading(false)
        setOpenDialog(false)
        setDocumentFile(null)
        setData({
          equipment: 0,
          filename: '',
          cond: 0
        })
        alert('Reporte generado')
      } else {
        console.log('Error al generar el reporte')
      }
      getReportsCond().then((resp) => {
        if (resp.status === 200) {
          setReports(resp.data.data)
        } else {
          console.log('Error al obtener los reportes')
        }
      }).catch((err) => {
        console.log('Error al obtener los reportes', err)
      })
    }).catch((err) => {
      console.log('Error al generar el reporte', err)
    })
  }

  const removeReport = (id: number) => {
    setLoading(true)
    console.log('id', id)
    deleteReportCondById(id).then((resp) => {
      if (resp.status === 200) {
        console.log('Reporte eliminado')
        setLoading(false)
        setOpenDialog(false)
        setDocumentFile(null)
        setData({
          equipment: 0,
          filename: '',
          cond: 0
        })
        toast({
          duration: 2000,
          variant: 'destructive',
          title: 'Eliminación',
          description: 'Reporte eliminado correctamente'
        }
        )
      } else {
        console.log('Error al eliminar el reporte')
      }
      getReportsCond().then((resp) => {
        if (resp.status === 200) {
          setReports(resp.data.data)
        } else {
          console.log('Error al obtener los reportes')
        }
      }).catch((err) => {
        console.log('Error al obtener los reportes', err)
      })
    }).catch((err) => {
      console.log('Error al eliminar el reporte', err)
    })
  }

  const reconigzeEquipment = (equipmentId: number) => {
    const equipment = equipments.find((eq) => eq.equipment_id === equipmentId)
    if (equipment) {
      return `${equipment.tag} - ${equipment.name}`
    }
    return 'Equipo no encontrado'
  }

  const [openAlertDelete, setOpenAlertDelete] = useState<boolean>(false)
  const [reportByDelete, setReportByDelete] = useState<any | null>(null)
  const [openDialogGHistory, setOpenDialogHistory] = useState<boolean>(false)
  const [historyReports, setHistoryReports] = useState<any[]>([])

  console.log('Report ByDelete', reportByDelete)

  return (
    <div className='p-2'>
      <div className='flex flex-row justify-between items-center '>
        <div className='flex flex-row justify-between items-center '>
          <h1 className='text-lg font-bold'>Reportes</h1>
        </div>
        <Dialog open={openDialogGHistory} onOpenChange={setOpenDialogHistory}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>HISTORIAL DE REPORTES</DialogTitle>
              <DialogDescription>
                {fileSelected ? `${reconigzeEquipment(fileSelected?.equipment)}` : 'Equipo: No seleccionado'}
              </DialogDescription>
            </DialogHeader>
            <div>
              <Table>
                <TableHeader>
                  <TableRow className='sticky top-0 font-bold bg-gray-200 text-black'>
                    <TableHead>ID</TableHead>
                    <TableHead>NOMBRE ARCHIVO</TableHead>
                    <TableHead>CONDICIÓN</TableHead>
                    <TableHead>EQUIPO</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className='overflow-auto'>
                  {
                    historyReports.length === 0 ?
                      <TableRow>
                        <TableCell colSpan={4} className='text-center'>No hay reportes en el historial</TableCell>
                      </TableRow>
                      :
                      historyReports?.map((report, index) => (
                        <TableRow key={report.id} className='text-black'>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{report.filename}</TableCell>
                          <TableCell className='flex flex-row items-center gap-2'>
                            <FaCircle className={report.cond === 1 ? 'text-red-500' : report.cond === 2 ? 'text-yellow-600' : report.cond === 3 ? 'text-yellow-400' : report.cond === 4 ? 'text-green-500' : report.cond === 5 ? 'text-gray-600' : report.cond === 6 ? 'text-gray-300' : ''} />
                            {report.cond === 1 ? 'Alarma' : report.cond === 2 ? 'Precaucion' : report.cond === 3 ? 'Tolerable' : report.cond === 4 ? 'Normal' : report.cond === 5 ? 'No Monitoreado' : report.cond === 6 ? 'No Aplica' : ''}
                          </TableCell>
                          <TableCell>{reconigzeEquipment(report.equipment)}</TableCell>
                        </TableRow>
                      ))
                  }
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </Dialog>
        <AlertDialog open={openAlertDelete} onOpenChange={setOpenAlertDelete}>
          <AlertDialogContent>
            <AlertDialogHeader className='flex flex-col justify-center items-center gap-5'>
              <AlertDialogTitle>Alerta de Eliminación</AlertDialogTitle>
              <FaTrash size={50} />
              <AlertDialogDescription>
                Está seguro que desea eliminar <span className='font-bold uppercase'>{reportByDelete?.filename}</span>, esta acción no podrá ser desecha.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className='border-t'>
              <div className='flex flex-row justify-between items-center w-full mt-3 gap-3'>
                <AlertDialogAction className='w-1/2  bg-red-500 hover:bg-red-400'
                  onClick={() => removeReport(reportByDelete?.id)}>
                  Eliminar
                </AlertDialogAction>
                <AlertDialogCancel className='w-1/2'>Cancelar</AlertDialogCancel>
              </div>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger className=''>
            <Button> Crear reporte </Button>
          </DialogTrigger>
          <DialogContent className=''>
            <DialogHeader>
              <DialogTitle>Reporte</DialogTitle>
            </DialogHeader>
            <div className='flex flex-col gap-4'>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Equipo:
                </Label>
                <Select onValueChange={(e) => { handleSelect(e) }}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccione equipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {
                        equipments.map((equipment, index) => (
                          <SelectItem key={index} value={equipment.equipment_id}>
                            {equipment.tag} - {equipment.name}
                          </SelectItem>
                        ))
                      }
                    </SelectGroup>
                  </SelectContent>

                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Archivo:
                </Label>
                <div className='flex flex-col gap-2 col-span-3'>
                  <Input
                    defaultValue={''}
                    type='file'
                    id="dropzone-file"
                    accept=".pdf"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      if (e.target.files != null) {
                        setDocumentFile(e.target.files[0])
                        setData({
                          ...data,
                          filename: e.target.files[0].name
                        })
                      }
                    }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nombre archivo:
                </Label>
                <div className='flex flex-col gap-2 col-span-3 p-2 rounded-md h-9 justify-center'>
                  {documentFile !== null ? documentFile.name : '   '}
                </div>
                {/* <Input name="filename" value={documentFile?.name} className="col-span-3" disabled={true}/> */}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Condición:
                </Label>
                <Select onValueChange={(e) => { handleSelectCond(e) }}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccione equipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="1">Alerta</SelectItem>
                      <SelectItem value="2">Precaución</SelectItem>
                      <SelectItem value="3">Tolerable</SelectItem>
                      <SelectItem value="4">Normal</SelectItem>
                      <SelectItem value="5">No Monitoreado</SelectItem>
                      <SelectItem value="6">No Aplica</SelectItem>
                    </SelectGroup>
                  </SelectContent>

                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={() => { handleSubmit() }}
                disabled={loading}
                className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'>
                {loading ? 'Generando...' : 'Generar'}
              </Button>
              <Button
                onClick={() => {
                  setOpenDialog(false)
                  setDocumentFile(null)
                  setData({
                    equipment: 0,
                    filename: '',
                    cond: 0
                  })
                }}
                type="button"
                variant="outline"
                className='bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded'>
                Cancelar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
      <Separator className="my-4" />
      {/* <Suspense fallback={<div>Cargando...</div>}>
        <DataTable columns={columns} data={data} />
      </Suspense> */}
      <div>
        <Table>
          <TableHeader>
            <TableRow className='sticky top-0 font-bold bg-gray-200 text-black'>
              <TableHead>ID</TableHead>
              <TableHead>NOMBRE ARCHIVO</TableHead>
              <TableHead>CONDICIÓN</TableHead>
              <TableHead>EQUIPO</TableHead>
              <TableHead>ACCIONES</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className='overflow-auto'>
            {reports.map((report, index) => (
              <TableRow key={report.id} className='text-black'>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{report.filename}</TableCell>
                <TableCell className='flex flex-row items-center gap-2'>
                  <FaCircle className={report.cond === 1 ? 'text-red-500' : report.cond === 2 ? 'text-yellow-600' : report.cond === 3 ? 'text-yellow-400' : report.cond === 4 ? 'text-green-500' : report.cond === 5 ? 'text-gray-600' : report.cond === 6 ? 'text-gray-300' : ''} />
                  {report.cond === 1 ? 'Alarma' : report.cond === 2 ? 'Precaucion' : report.cond === 3 ? 'Tolerable' : report.cond === 4 ? 'Normal' : report.cond === 5 ? 'No Monitoreado' : report.cond === 6 ? 'No Aplica' : ''}</TableCell>
                <TableCell>{reconigzeEquipment(report.equipment)}</TableCell>
                <TableCell className='flex flex-row items-center w-full gap-2'>
                  <Button onClick={() => { handleViewDoc(report) }} >Ver reporte</Button>
                  <Button disabled>Editar</Button>
                  <Button disabled>Actualizar</Button>
                  <Button
                    onClick={() => {
                      setFileSelected(report)
                      setOpenDialogHistory(true)
                    }}
                  >Historial</Button>
                  <Button
                    onClick={() => {
                      setOpenAlertDelete(true)
                      setReportByDelete(report)
                    }}
                    className='bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded'>Eliminar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {
        openDialogDoc &&
        <ModalViewMedia
          open={openDialogDoc}
          setOpen={setOpenDialogDoc}
          information={fileSelected}
          type='document'
        />
      }
    </div>
  )
}

export default Reports
