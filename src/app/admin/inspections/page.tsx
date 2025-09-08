'use client'
import { getUsers } from '@/api/admin/users-api'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import React, { useEffect, useMemo, useState } from 'react'
import { FaPlus } from 'react-icons/fa6'
import axios from 'axios'
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];


const Inspections = () => {
  const [openInspection, setOpenInspection] = useState(false)
  const [openNewInspection, setOpenNewInspection] = useState(false)
  const [equipments, setEquipments] = useState([])
  const [users, setUsers] = useState([])

  const [filterBy, setFilterBy] = useState<string>("1")
  const [search, setSearch] = useState("")
  const [selectedItem, setSelectedItem] = useState<any>(null)

  const [allInspections, setAllInspections] = useState<any[]>([])

  const [value, onChange] = useState<Value>(new Date());

  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/inspection/');
      console.log(response.data); // Los datos de la respuesta
      return response;
    } catch (error) {
      console.error('Error en la petición:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchData().then((response) => {
      setAllInspections(response.data)
      // console.log("Data inspections:", data)
    })
      .catch((error) => {
        console.error('Error fetching inspections:', error)
      })
  }, [])

  useEffect(() => {
    fetch('/data/tag-criticidad-id_equipment.json')
      .then((response) => response.json())
      .then((data) => {
        setEquipments(data)
      })
      .catch((error) => {
        // Handle any errors
      })

    getUsers().then((data) => {
      setUsers(data.data.data)
    })
  }, [])

  console.log("All inspections:", allInspections)

  const filteredData = useMemo(() => {
    if (filterBy === "1") {
      return equipments.filter((eq) =>
        eq["TAG-HIJO"]?.toLowerCase().includes(search.toLowerCase())
      )
    } else {
      return users.filter((u) =>
        u.name?.toLowerCase().includes(search.toLowerCase())
      )
    }
  }, [filterBy, search, equipments, users])

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-row justify-between items-center'>
        <h1 className='text-xl font-bold'>Inspections</h1>
        <div className='flex flex-row gap-2 w-2/5'>
          <Select onValueChange={(value) => setFilterBy(value)} >
            <SelectTrigger className='w-1/3'>
              <SelectValue placeholder="Seleccione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='1'>Equipos</SelectItem>
              <SelectItem value='2'>Usuarios</SelectItem>
            </SelectContent>
          </Select>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Buscar...'
          />
        </div>
        <Button onClick={() => setOpenNewInspection(true)} className='gap-2'>
          <FaPlus></FaPlus>
          Nuevo
        </Button>
      </div>
      <div >
        <div className='sticky top-0 z-10'>
          <Table>
            <TableHeader>
              <TableRow className='bg-gray-300'>
                <TableHead className='font-bold w-[5%]'>N°</TableHead>
                <TableHead className='font-bold w-[10%]'>Prior.</TableHead>
                <TableHead className='font-bold w-[20%]'>Equipo</TableHead>
                <TableHead className='font-bold w-[25%]'>Titulo</TableHead>
                <TableHead className='font-bold w-[15%]'>Creado por</TableHead>
                {/* <TableHead classNaite font-bold w-[15%]'>Enviado a</TableHead> */}
                <TableHead className='font-bold w-[10%]'>Estado</TableHead>
                <TableHead className='font-bold w-[10%]'>Acciones</TableHead>
              </TableRow>
            </TableHeader>
          </Table>
        </div>
        <div className='overflow-auto flex z-0 max-h-[630px] bg-white rounded-b-md' >
          <Table>
            <TableBody >
              {
                allInspections?.map((inspection, index) => (
                  <TableRow key={inspection.id} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                    <TableCell className='w-[5%]'>{inspection.inspection_id}</TableCell>
                    <TableCell className='w-[10%]'>{inspection.priority}</TableCell>
                    <TableCell className='w-[20%]'>{inspection.equipment_name}</TableCell>
                    <TableCell className='w-[25%]'>{inspection.title}</TableCell>
                    <TableCell className='w-[15%]'>{inspection.author}</TableCell>
                    {/* <TableCell className='w-[15%]'>{inspection.assigned_to}</TableCell> */}
                    <TableCell className='w-[10%]'>{inspection.status}</TableCell>
                    <TableCell className='w-[10%]'>
                      <button
                        onClick={() => {
                          setSelectedItem(inspection)
                          setOpenInspection(true)
                        }}
                        className='bg-[#002645] text-white py-2 px-2 rounded-md hover:bg-[#004175]'>
                        Revisar
                      </button>
                      {/* <Button onClick={() => {
                        setSelectedItem(inspection)
                        setOpenInspection(true)
                      }}>
                        Atender
                      </Button> */}
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </div>
      </div>
      {/* Inspeccion en detalle */}
      <Dialog open={openInspection} onOpenChange={setOpenInspection}>
        <DialogContent className="bg-gray-200 min-w-[50%] max-h-[80%] flex flex-col">
          <DialogTitle>
            Inspección {selectedItem ? selectedItem.inspection_id : ''}
          </DialogTitle>
          <div className='gap-2 flex flex-col text-xs overflow-auto'>
            <div className='flex flex-row gap-4'>
              <div className='flex flex-row items-center gap-2'>
                <h1 className='font-bold'>N° Aviso:</h1>
                <Input disabled className='p-2 bg-white rounded-md border text-xs' value={selectedItem ? String(selectedItem.inspection_id).padStart(7, '0') : ''} />
              </div>
              <div className='flex flex-row items-center gap-2'>
                <h1 className='font-bold'>Clase de aviso:</h1>
                <Input disabled className='p-2 bg-white rounded-md border text-xs' value={selectedItem ? selectedItem.type : ''} />
              </div>
            </div>
            <div className='flex flex-row items-center gap-2'>
              <h1 className='font-bold'>Titulo:</h1>
              <Input disabled className='p-2 bg-white rounded-md border text-xs' value={selectedItem ? selectedItem.title : ''} />
            </div>
            <div className='flex flex-row gap-5'>
              <div className='flex flex-row items-center gap-2 w-1/3'>
                <h1 className='font-bold'>Ubicacion Tecnica:</h1>
                <Input disabled className='p-2 bg-white rounded-md border text-xs' value={selectedItem ? selectedItem.technique_location : ''} />
              </div>
              <div className='flex flex-row items-center gap-2 w-2/3'>
                <h1 className='font-bold'>Nombre de equipo:</h1>
                <Input disabled className='p-2 bg-white rounded-md border text-xs' value={selectedItem ? selectedItem.equipment_name : ''} />
              </div>
            </div>
            <div className='gap-2 flex flex-col'>
              <div className='flex flex-col gap-2'>
                <h1 className='font-bold'>Descripcion tecnica:</h1>
                <Textarea disabled className='resize-none text-xs' value={selectedItem?.description} />
              </div>
              <div className='flex flex-col gap-2'>
                <h1 className='font-bold'>Archivos adjuntos:</h1>
                <div className='bg-white h-32 w-full'></div>
              </div>
            </div>
            <div className='flex flex-row gap-5'>
              <div className='flex flex-row gap-2'>
                <h1 className='font-bold'>Grupo Planif.:</h1>
                <Input />
              </div>
              <div className='flex flex-row gap-2'>
                <h1 className='font-bold'>Pto. Tbjo. Resp.:</h1>
                <Input />
              </div>
            </div>
            <div className='flex flex-row gap-5'>
              <div className='flex flex-row gap-2'>
                <h1 className='font-bold'>Autor del aviso:</h1>
                <Input />
              </div>
              <div className='flex flex-row gap-2'>
                <h1 className='font-bold'>Fecha de aviso:</h1>
                <Input />
              </div>
            </div>
            <div className='flex flex-row gap-5'>
              <div className='flex flex-row gap-2'>
                <h1 className='font-bold'>Inicio deseado:</h1>
                <DateTimePicker
                  onChange={onChange}
                  value={value}
                  disableClock
                  dayPlaceholder='dd'
                  monthPlaceholder='mm'
                  yearPlaceholder='aaaa'
                  format="y-MM-dd" // muestra solo fecha
                  clearIcon={null} // oculta el icono de limpiar
                  calendarIcon={null} // oculta el icono del calendario
                  className='bg-white'
                />
              </div>
              <div className='flex flex-row gap-2'>
                <h1 className='font-bold'>Fin deseado:</h1>
                <DateTimePicker
                  hourPlaceholder='hh'
                  minutePlaceholder='mm'
                  onChange={onChange}
                  value={value}
                  disableCalendar
                  format="hh:mm" // muestra solo fecha
                  clearIcon={null} // oculta el icono de limpiar
                  calendarIcon={null} // oculta el icono del calendario
                  className='bg-white'
                />
              </div>
            </div>
            <div className='flex flex-row gap-5'>
              <div className='flex flex-row gap-2'>
                <h1 className='font-bold'>Prioridad:</h1>
                <Select>
                  <SelectTrigger className='w-[150px]'>
                    <SelectValue placeholder='Seleccionar prioridad' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='critico'>Critico</SelectItem>
                    <SelectItem value='medio'>Media</SelectItem>
                    <SelectItem value='bajo'>Baja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>



          </div>
          <DialogFooter>
            <Button onClick={() => setOpenInspection(false)} variant='destructive'>
              Cerrar
            </Button>
            <Button onClick={() => { /* TODO: Implementar acción de atención */ }}>
              Atender
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={openNewInspection} onOpenChange={setOpenNewInspection}>
        <DialogContent>
          <DialogTitle>
            Nueva Inspección
          </DialogTitle>
          <div>
            <p>Detalles de la inspección 1</p>
            <p>Información adicional sobre la inspección 1</p>
            <p>Notas sobre la inspección 1</p>
            <p>Comentarios sobre la inspección 1</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setOpenNewInspection(false)} variant='destructive'>
              Cerrar
            </Button>
            <Button onClick={() => { /* TODO: Implementar acción de atención */ }}>
              Proceder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Inspections