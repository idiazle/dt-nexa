'use client'
import { getEquipments } from '@/api/admin/equipments-api'
import { deleteReportCondById, getReportsCond, postReportCond } from '@/api/admin/reports-api'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ChangeEvent, useEffect, useState } from 'react'
import { FaCircle } from 'react-icons/fa6'

const Reports = () => {
  const [equipments, setEquipments] = useState<any[]>([])
  const [reports, setReports] = useState<any[]>([])
  const [documentFile, setDocumentFile] = useState<File | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [loading, setLoading] = useState(false)

  const [data, setData] = useState<any>({
    equipment: 0,
    filename: '',
    cond: 0
  })

  const getAllEquipments = () => {
    getEquipments().then((resp) => {
      if (resp.status === 200) {
        console.log('Equipos obtenidos', resp.data.data)
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
  const handleSubmit = (e: any) => {
    setLoading(true)
    const formData = new FormData()
    formData.append('file', documentFile as Blob)
    formData.append('equipment', data.equipment)
    formData.append('cond', data.cond.toString())
    formData.append('filename', data.filename)
    console.log('formData', formData)
    postReportCond(formData).then((resp) => {
      if (resp.status === 201) {
        console.log('Reporte generado')
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
        alert('Reporte eliminado')
      } else {
        console.log('Error al eliminar el reporte')
      }
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

  return (
    <div className='p-2'>
      <div className='flex flex-row justify-between items-center '>
        <div className='flex flex-row justify-between items-center '>
          <h1 className='text-lg font-bold'>Reportes</h1>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'>
            Generar Reporte
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
                      <SelectItem value="1">Alarma</SelectItem>
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
                onClick={() => {
                  handleSubmit(data)
                  setOpenDialog(false)
                }}
                className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'>
                Generar
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
            <TableRow className='sticky top-0  font-bold'>
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
                <TableHead>{index + 1}</TableHead>
                <TableHead>{report.filename}</TableHead>
                <TableHead className='flex flex-row items-center gap-2'>
                  <FaCircle className={report.cond === 1 ? 'text-red-500' : report.cond === 2 ? 'text-yellow-600' : report.cond === 3 ? 'text-yellow-400' : report.cond === 4 ? 'text-green-500' : report.cond === 5 ? 'text-gray-600' : report.cond === 6 ? 'text-gray-300' : ''} />
                  {report.cond === 1 ? 'Alarma' : report.cond === 2 ? 'Precaucion' : report.cond === 3 ? 'Tolerable' : report.cond === 4 ? 'Normal' : report.cond === 5 ? 'No Monitoreado' : report.cond === 6 ? 'No Aplica' : ''}</TableHead>
                <TableHead>{reconigzeEquipment(report.equipment)}</TableHead>
                <TableHead className='flex flex-row items-center w-full gap-2'>
                  <Button disabled>Ver reporte</Button>
                  <Button disabled>Editar</Button>
                  <Button disabled>Actualizar</Button>
                  <Button onClick={() => { removeReport(report.id) }} className='bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded'>Eliminar</Button>
                </TableHead>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default Reports
