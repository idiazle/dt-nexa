'use client'
import { useEffect, useState } from "react"
import { FaEye, FaX } from "react-icons/fa6"
import { Label } from "../ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"

interface SpareDialogProps {
  openSpare: boolean
  setOpenSpare: (open: boolean) => void
  equipmentSelected: any | null
  setEquipmentSelected: (equipment: any | null) => void
  reportesFiltrados: any[]
}

const SparesDialog = ({ openSpare, setOpenSpare, equipmentSelected, setEquipmentSelected, reportesFiltrados }: SpareDialogProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [equipmentByCriticidad, setEquipmentByCriticidad] = useState<any[]>([])
  const [componentsFilterData, setComponentsFilterData] = useState<any[]>([])

  const [repuestosData, setRepuestosData] = useState<any[]>([])
  const [repuestosFilterData, setRepuestosFilterData] = useState<any[]>([])

  const [ndVbData, setNdVbData] = useState<any[]>([])
  const [itemsNdVbData, setItemNdVbData] = useState<any[]>([])

  const [openMm60RepuestoDialog, setOpenMm60RepuestoDialog] = useState(false)

  const [sparesData, setSparesData] = useState<any[]>([])
  const [sparesFilterByEquipment, setSparesFilterByEquipment] = useState<any[]>([])

  const [reparacionData, setReparacionData] = useState<any[]>([])
  const [selectedReparacion, setSelectedReparacion] = useState<any | null>(null)

  const [listEquipments, setListEquipments] = useState<any[]>([])
  const [listFilterEquipments, setListFilterEquipments] = useState<any[]>([])

  useEffect(() => {
    fetch(`/data/tag-criticidad-id_equipment.json`).then(response => response.json()).then(data => {
      console.log("Datos de criticidad:", data)
      setEquipmentByCriticidad(data)
    })
    fetch(`/data/zglmp085-general.json`).then(response => response.json()).then(data => {
      console.log("Datos de repuestos:", data)
      setRepuestosData(data)
    })
    fetch('/data/mm60-general.json').then(response => response.json()).then(data => {
      console.log("Datos de ND VB:", data)
      setNdVbData(data)
    })
    fetch('/data/spares.json').then(response => response.json()).then(data => {
      console.log("Datos de spares:", data)
      setSparesData(data)
    })
    fetch('/data/status_reparación_externa_12.08.25.json').then(response => response.json()).then(data => {
      console.log("Datos de reparación:", data)
      setReparacionData(data)
    })
    fetch('/data/spares-tac.json').then(response => response.json()).then(data => {
      console.log("Datos de equipos:", data)
      setListEquipments(data)
    })

  }, [])

  const searchComponentsByEquipment = () => {
    const resp = equipmentByCriticidad.filter(item => item.ID_EQUIPMENT === equipmentSelected?.entity_id.id)
    setComponentsFilterData(resp)
  }

  useEffect(() => {
    searchComponentsByEquipment()
  }, [equipmentSelected, equipmentByCriticidad])

  const searchRepuestobyComponent = (technic_location: string) => {
    const resp = repuestosData.filter(item => item["Ubicación técnica"] === technic_location)
    setRepuestosFilterData(resp)
  }

  const searchInfoNdVbByRepuesto = (repuesto: string) => {
    const resp = ndVbData.filter(item => item["Material"] === repuesto)
    setItemNdVbData(resp)
  }

  const searchSparesByEquipment = () => {
    const resp = sparesData.filter(item => item.tag === componentsFilterData[0]?.["TAG RESUMEN"])
    console.log("Spares filtrados por equipo:", resp)
    setSparesFilterByEquipment(resp)
  }

  useEffect(() => {
    searchSparesByEquipment()
  }, [componentsFilterData])

  const searchReparacionBySpare = (tag_repuesto: string) => {
    const resp = reparacionData.filter(item => item["Ubicación técnica"].includes(tag_repuesto))
    console.log("Reparación filtrada por spare:", resp)
    setSelectedReparacion(resp)
  }

  const addUbicacionTecnica = (spare: any) => {
    const resp = listEquipments.filter(item => item["Descrip_UT"].includes(spare.spare) && item["TAG RESUMEN"] === spare.tag)

    const reparacionesEnProceso: any[] = []

    reparacionData.map((reparacion: any, index: number) => {
      resp.map((equipo: any, idx: number) => {
        if (equipo["TAG-HIJO"] === reparacion["Ubicación técnica"]) {
          reparacionesEnProceso.push({ ...reparacion, equipo })
        }
      })
    })
  }

  const [condicionEquipo, setCondicionEquipo] = useState<any>(null);

  useEffect(() => {
    const tagResumen = componentsFilterData[0]?.["TAG RESUMEN"] || "";
    console.log("TAG RESUMEN:", tagResumen);
    if (!tagResumen) return;

    // Filtrar por TAG
    const filtrados = reportesFiltrados.filter(item => item["TAG"]?.includes(tagResumen));

    if (filtrados.length === 0) {
      setCondicionEquipo(null);
      return;
    }

    // Buscar el de mayor semana
    const ultimoReporte = filtrados.reduce((max, item) =>
      item.SEMANA > max.SEMANA ? item : max
    );

    setCondicionEquipo(ultimoReporte);

  }, [reportesFiltrados, componentsFilterData]);

  console.log("Condición del equipo:", condicionEquipo);

  return (
    <div className={`absolute flex flex-col h-[94%] right-0 top-14 bottom-0 ${openSpare ? 'w-[50%] opacity-100' : 'w-0 opacity-0'} bg-slate-300 z-50 border rounded-l-md p-2`}>
      <div className='p-2 bg-[#002645] rounded-md flex flex-row justify-between items-center w-full'>
        <h1 className='text-white font-bold'>SPARE - REPUESTOS</h1>
        <FaX className='text-white right-2 top-2 cursor-pointer hover:bg-gray-300 p-1 rounded-md' onClick={() => {
          setOpenSpare(false)
          setEquipmentSelected(null)
          setCondicionEquipo(null);
        }} size={20} />
      </div>
      <div className='px-2 py-4 overflow-y-auto flex flex-row gap-4'>
        <div className='flex flex-row gap-2 items-center w-1/4'>
          <Label className='font-bold'>Condición:</Label>
          <div className={`flex w-full px-2 py-1 rounded-md text-sm
            ${condicionEquipo?.["CONDICION ACT."] === 'ALARMA' ? 'bg-[#F20000]' :
              condicionEquipo?.["CONDICION ACT."] === 'PRECAUCION' ? 'bg-[#FFC000]' :
                condicionEquipo?.["CONDICION ACT."] === 'TOLERABLE' ? 'bg-[#FFFF00]' :
                  condicionEquipo?.["CONDICION ACT."] === 'NORMAL' ? 'bg-[#00A049]' :
                    condicionEquipo?.["CONDICION ACT."] === 'NORMAL' ? 'bg-[#B0B0B0]' :
                      'bg-white'}`}>
            {
              condicionEquipo?.SEMANA && condicionEquipo?.["CONDICION ACT."]
                ? `S${condicionEquipo.SEMANA} - ${condicionEquipo["CONDICION ACT."]}`
                : "Sin condición"
            }
          </div>
        </div>
        <div className='flex flex-row gap-2 items-center w-1/5'>
          <Label className='font-bold'>Equipo:</Label>
          <div className='flex bg-white w-full px-2 py-1 rounded-md text-sm'>
            {componentsFilterData[0]?.["TAG RESUMEN"]}
          </div>
        </div>
        <div className='flex flex-row gap-2 items-center w-1/2'>
          <Label className='font-bold'>Familia:</Label>
          <div className='flex bg-white w-full px-2 py-1 rounded-md text-sm'>
            {componentsFilterData[0]?.Descrip_UT}
          </div>
        </div>
      </div>
      <Tabs defaultValue="installed" className='h-[85%] '>
        <TabsList className='flex flex-row w-full bg-white rounded-md gap-1'>
          <TabsTrigger value="installed" className='w-1/2 bg-gray-300 hover:bg-gray-500 hover:text-white'>Instalados</TabsTrigger>
          <TabsTrigger value="spare" className='w-1/2 bg-gray-300 hover:bg-gray-500 hover:text-white'>Spare</TabsTrigger>
        </TabsList>
        <TabsContent value="installed" className=''>
          {/* Lista de componentes instalados y seleccionados en el mapa */}
          <div className="h-full">
            <h1 className="font-bold text-lg">Lista de Equipos</h1>
            <div className="bg-white max-h-[350px] flex flex-col">
              <div className="overflow-y-auto flex-1">
                <Table className="w-full">
                  <TableHeader className="bg-gray-200 sticky top-0 z-10">
                    <TableRow>
                      <TableHead className="w-[3%]">N°</TableHead>
                      <TableHead className="w-[30%]">Equipo</TableHead>
                      <TableHead className="w-[30%]">TAG</TableHead>
                      <TableHead className="w-[10%]">Criticidad</TableHead>
                      {/* <TableHead className="w-[20%]">Estado</TableHead> */}
                      <TableHead className="w-[5%]">Condición</TableHead>
                      <TableHead className="w-[5%]">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {componentsFilterData && componentsFilterData.length > 0 &&
                      componentsFilterData.map((component: any, index) => (
                        <TableRow key={index}>
                          <TableCell className="w-[3%]">{index + 1}</TableCell>
                          <TableCell className="w-[30%]">{component["Descrip_UT"]}</TableCell>
                          <TableCell className="w-[10%]">{component["TAG-HIJO"]}</TableCell>
                          <TableCell className="w-[20%]">{component["Criticidad"]}</TableCell>
                          {/* <TableCell className="w-[30%]">{component["ESTADO"]}</TableCell> */}
                          <TableCell className="w-[5%]">{component["CONDICION"]}</TableCell>
                          <TableCell className="w-[5%] flex flex-row gap-1">
                            <Button
                              onClick={() => {
                                searchRepuestobyComponent(component["TAG-HIJO"])
                              }}>
                              Rep.
                            </Button>
                            <Button
                              onClick={() => {
                                searchRepuestobyComponent(component["TAG-HIJO"])
                              }}>
                              Mod.
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
          {/* Lista de repuestos segun el componente seleccionado */}
          <div className='mt-4'>
            <h1 className='font-bold text-lg'>Lista de Repuestos </h1>
            <div className="bg-white h-[350px] flex flex-col">
              <Table className="w-full">
                <TableHeader className="bg-gray-200">
                  <TableRow>
                    <TableHead className='w-[12%]'>Componente</TableHead>
                    <TableHead className='w-[33%]'>Texto breve del material</TableHead>
                    {/* <TableHead className='w-[10%]'>Ubicación Técnica</TableHead> */}
                    <TableHead className='w-[15%]'>Tipo de material</TableHead>
                    <TableHead className='w-[10%]'># posición</TableHead>
                    <TableHead className='w-[10%]'>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
              <div className="overflow-y-auto flex-1">
                <Table className="w-full">
                  <TableBody>
                    {
                      repuestosFilterData.length > 0 ? repuestosFilterData.map((obj: any, index: number) => {
                        return (
                          <TableRow
                            key={index}
                            className="">
                            <TableCell className='w-[12%]'>{obj["Componente"]}</TableCell>
                            <TableCell className='w-[33%]'>{obj["Texto breve de material"]}</TableCell>
                            {/* <TableCell className='w-[10%]'>{obj.["Tipo material"]}</TableCell> */}
                            <TableCell className='w-[15%]'>{obj["Tipo material"]}</TableCell>
                            <TableCell className='w-[10%]'>{obj["Núm.posición"]}</TableCell>
                            <TableCell className='w-[10%]'>
                              <Button
                                onClick={() => {
                                  setOpenMm60RepuestoDialog(true)
                                  // searchMm60ByRepuesto(obj.component)
                                  searchInfoNdVbByRepuesto(obj["Componente"])
                                }}
                              >
                                <FaEye size={20} color='white' />
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      }) : (
                        repuestosFilterData.length > 0 ? (
                          repuestosFilterData.map((obj: any, index: number) => {
                            return (
                              <TableRow key={index} className="">
                                <TableCell className='w-[12%]'>{obj["Componente"]}</TableCell>
                                <TableCell className='w-[33%]'>{obj["Texto breve de material"]}</TableCell>
                                {/* <TableCell className='w-[10%]'>{obj.["Tipo material"]}</TableCell> */}
                                <TableCell className='w-[15%]'>{obj["Tipo material"]}</TableCell>
                                <TableCell className='w-[10%]'>{obj["Núm. posición"]}</TableCell>
                                <TableCell className='w-[10%]'></TableCell>
                              </TableRow>
                            )
                          })
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className=" text-center italic">No existe repuestos para el componente seleccionado</TableCell>
                          </TableRow>
                        )
                      )
                    }
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="spare">
          <div className=' h-full'>
            <h1 className='font-bold text-lg'>Lista de Equipos </h1>
            <div className="bg-white max-h-[300px] flex flex-col">
              <Table className="w-full">
                <TableHeader className="bg-gray-200">
                  <TableRow>
                    <TableHead className="w-[30%]">Equipo</TableHead>
                    <TableHead className="w-[15%]">Spare</TableHead>
                    <TableHead className="w-[15%]">Estado</TableHead>
                    <TableHead className="w-[30%]">Ubicación/Comentario</TableHead>
                    <TableHead className="w-[10%]">Stock</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
              <div className="overflow-y-auto flex-1">
                <Table className="w-full">
                  <TableBody>
                    {
                      sparesFilterByEquipment && sparesFilterByEquipment.length > 0 ? sparesFilterByEquipment.map((obj: any, index: number) => {
                        return (
                          <TableRow
                            key={index}
                            onClick={() => {
                              // setSelectedIndex(index);
                              // searchinfoRepairEquipment(obj)
                              searchReparacionBySpare(obj.tag)
                              addUbicacionTecnica(obj)
                            }}
                            className={`hover:bg-green-300 cursor-pointer ${selectedIndex === index ? 'bg-green-300' : ''}`}>
                            <TableCell className="w-[30%]">{obj.equipo}</TableCell>
                            <TableCell className="w-[15%]">{obj.spare}</TableCell>
                            <TableCell className="w-[15%]">{obj.estado}</TableCell>
                            <TableCell className="w-[30%]">{obj.ubicación_comentario}</TableCell>
                            <TableCell className="w-[10%]">{obj.stock}</TableCell>
                          </TableRow>
                        )
                      }) : (
                        <TableRow>
                          <TableCell colSpan={5} className=" text-center italic">No existe spare</TableCell>
                        </TableRow>
                      )
                    }
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
          <div className='mt-5'>
            {
              selectedReparacion && selectedReparacion.length > 0 ? (
                <>
                  <h1 className='font-bold text-lg'>Información: </h1>
                  <div className="bg-white flex flex-col">
                    <div className='flex flex-row items-center p-2 gap-2'>
                      <Label className='font-bold text-md w-1/3'>Ubicación Técnica:</Label>
                      <h1 className='text-md bg-gray-200 p-1 rounded-md w-full'>{selectedReparacion[0]["Ubicación técnica"]}</h1>
                    </div>
                    <div className='flex flex-row items-center p-2 gap-2'>
                      <Label className='font-bold text-md w-1/3'>Lugar de reparación:</Label>
                      <h1 className='text-md bg-gray-200 p-1 rounded-md w-full'>{selectedReparacion[0]["Pto.tbjo.responsable"]}</h1>
                    </div>
                    <div className='flex flex-row items-center p-2 gap-2'>
                      <Label className='font-bold text-md w-1/3'>Fecha de entrega:</Label>
                      <h1 className='text-md bg-gray-200 p-1 rounded-md w-full'>{selectedReparacion[0]["Fecha Entrega"]}</h1>
                    </div>
                    <div className='flex flex-row items-center p-2 gap-2'>
                      <Label className='font-bold text-md w-1/3'>Aviso:</Label>
                      <h1 className='text-md bg-gray-200 p-1 rounded-md w-full'>{selectedReparacion[0]["Aviso"]}</h1>
                    </div>
                    <div className='flex flex-row items-center p-2 gap-2'>
                      <Label className='font-bold text-md w-1/3'>Orden:</Label>
                      <h1 className='text-md bg-gray-200 p-1 rounded-md w-full'>{selectedReparacion[0]["Orden"]}</h1>
                    </div>
                    <div className='flex flex-row items-center p-2 gap-2'>
                      <Label className='font-bold text-md w-1/3'>Status Aprobación:</Label>
                      <h1 className='text-md bg-gray-200 p-1 rounded-md w-full'>{selectedReparacion[0]["Status Aprobación"]}</h1>
                    </div>
                    <div className='flex flex-row items-center p-2 gap-2'>
                      <Label className='font-bold text-md w-1/3'>Status Ejecución:</Label>
                      <h1 className='text-md bg-gray-200 p-1 rounded-md w-full'>{selectedReparacion[0]["Status Ejecución"]}</h1>
                    </div>
                    <div className='flex flex-row items-center p-2 gap-2'>
                      <Label className='font-bold text-md w-1/3'>Texto breve operación:</Label>
                      <h1 className='text-md bg-gray-200 p-1 rounded-md w-full'>{selectedReparacion[0]["Texto breve operación"]}</h1>
                    </div>
                  </div>
                </>
              )
                :
                <>
                  <h1 className='text-md bg-gray-200 p-1 rounded-md'>No hay información disponible</h1>
                </>

            }

          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={openMm60RepuestoDialog} onOpenChange={() => { setOpenMm60RepuestoDialog(false) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalles del Repuesto segun MM60</DialogTitle>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead># Repuesto</TableHead>
                <TableHead>Car. Plan. Nec.</TableHead>
                <TableHead>Criticidad</TableHead>
                <TableHead>Cantidad Base</TableHead>
                <TableHead>Stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                itemsNdVbData && itemsNdVbData.length > 0 ? itemsNdVbData.map((obj: any, index: number) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>{obj["Material"]}</TableCell>
                      <TableCell>{obj["Caract.planif.nec."]}</TableCell>
                      <TableCell>{obj["Indicador ABC"]}</TableCell>
                      <TableCell>{obj["Cantidad base"]}</TableCell>
                      <TableCell>1</TableCell>
                    </TableRow>
                  )
                }) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center italic">No hay información disponible</TableCell>
                  </TableRow>
                )
              }
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SparesDialog


{/* <div className={`absolute flex flex-col transition-all duration-500 h-[94%] right-0 top-14 bottom-0 ${openSpare ? 'w-[50%] opacity-100' : 'w-0 opacity-0'} bg-slate-300 z-50 border rounded-l-md p-2`}>
        <div className='p-2 bg-[#002645] rounded-md flex flex-row justify-between items-center w-full'>
          <h1 className='text-white font-bold'>SPARE - REPUESTOS</h1>
          <FaX className='text-white right-2 top-2 cursor-pointer hover:bg-gray-300 p-1 rounded-md' onClick={() => { setOpenSpare(false) }} size={20} />
        </div>
        <div className='px-2 py-4 overflow-y-auto flex flex-row gap-4'>
          <div className='flex flex-row gap-2 items-center w-1/2'>
            <Label className='font-bold'>Equipo:</Label>
            <div className='flex bg-white w-full px-2 py-1 rounded-md'>{equip.tag} - {equip.name}</div>
          </div>
          <div className='flex flex-row gap-2 items-center w-1/2'>
            <Label className='font-bold'>Familia:</Label>
            <div className='flex bg-white w-full px-2 py-1 rounded-md'>Faja de alimentacion</div>
          </div>
        </div>
        <Tabs defaultValue="installed" className='h-[85%] '>
          <TabsList className='flex flex-row w-full bg-white rounded-md gap-1'>
            <TabsTrigger value="installed" className='w-1/2 bg-gray-300 hover:bg-gray-500 hover:text-white'>Instalados</TabsTrigger>
            <TabsTrigger value="spare" className='w-1/2 bg-gray-300 hover:bg-gray-500 hover:text-white'>Spare</TabsTrigger>
          </TabsList>
          <TabsContent value="installed" className='gap-4'>
            <div className=' h-full'>
              <h1 className='font-bold text-lg'>Lista de Equipos </h1>
              <div className="bg-white max-h-[300px] flex flex-col">
                <Table className="w-full">
                  <TableHeader className="bg-gray-200">
                    <TableRow>
                      <TableHead className="w-[30%]">Equipo</TableHead>
                      <TableHead className="w-[10%]">TAG</TableHead>
                      <TableHead className="w-[20%]">Criticidad</TableHead>
                      <TableHead className="w-[30%]">Estado</TableHead>
                      <TableHead className="w-[5%]">Condición</TableHead>
                      <TableHead className="w-[5%]">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                </Table>
                <div className="overflow-y-auto flex-1">
                  <Table className="w-full">
                    <TableBody>
                      {
                        tempSpare && tempSpare.length > 0 ?
                          tempSpare.filter((obj, index, self) =>
                            index === self.findIndex(o => o.spare === obj.spare)
                          ).map((obj: any, index: number) => {
                            return (
                              <TableRow key={index}
                                className={`hover:bg-green-300 cursor-pointer ${selectedIndex === index ? 'bg-green-300' : ''}`}
                                onClick={() => {
                                  setSelectedIndex(index);
                                  busquedaRepuestos(obj?.id_spare);
                                }}>
                                <TableCell className="w-[30%]">{obj.spare}</TableCell>
                                <TableCell className="w-[10%]">M20</TableCell>
                                <TableCell className="w-[20%]"></TableCell>
                                <TableCell className="w-[30%]">{obj.estado}</TableCell>
                                <TableCell className="w-[5%]">
                                  <FaCircle className={`text-${obj.condicion === 'Bueno' ? 'green' : 'yellow'}-500`} />
                                </TableCell>
                                <TableCell>
                                  <Button
                                    onClick={() => { setOpenModoFallaDialog(true) }}>
                                    <FaEye size={20} color='white' />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          }) : (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center">No hay datos disponibles</TableCell>
                            </TableRow>
                          )
                      }
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
            <div className=''>
              <h1 className='font-bold text-lg'>Lista de Repuestos </h1>
              <div className="bg-white h-[350px] flex flex-col">
                <Table className="w-full">
                  <TableHeader className="bg-gray-200">
                    <TableRow>
                      <TableHead className='w-[12%]'>Componente</TableHead>
                      <TableHead className='w-[33%]'>Texto breve del material</TableHead>
                      <TableHead className='w-[10%]'>Ubicación Técnica</TableHead>
                      <TableHead className='w-[15%]'>Tipo de material</TableHead>
                      <TableHead className='w-[10%]'># posición</TableHead>
                      <TableHead className='w-[10%]'>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                </Table>
                <div className="overflow-y-auto flex-1">
                  <Table className="w-full">
                    <TableBody>
                      {
                        repuestosBySpare.length > 0 ? repuestosBySpare.map((obj: any, index: number) => {
                          return (
                            <TableRow
                              key={index}
                              className="">
                              <TableCell className='w-[12%]'>{obj.component}</TableCell>
                              <TableCell className='w-[33%]'>{obj.material_text}</TableCell>
                              <TableCell className='w-[10%]'>{obj.location}</TableCell>
                              <TableCell className='w-[15%]'>{obj.material_type}</TableCell>
                              <TableCell className='w-[10%]'>{obj.position}</TableCell>
                              <TableCell className='w-[10%]'>
                                <Button
                                  onClick={() => {
                                    setOpenMm60RepuestoDialog(true)
                                    searchMm60ByRepuesto(obj.component)
                                  }}
                                >
                                  <FaEye size={20} color='white' />
                                </Button>
                              </TableCell>
                            </TableRow>
                          )
                        }) : (
                          repuestos.length > 0 ? (
                            repuestos.map((obj: any, index: number) => {
                              return (
                                <TableRow key={index} className="">
                                  <TableCell className='w-[12%]'>{obj.component}</TableCell>
                                  <TableCell className='w-[33%]'>{obj.material_text}</TableCell>
                                  <TableCell className='w-[10%]'>{obj.location}</TableCell>
                                  <TableCell className='w-[15%]'>{obj.material_type}</TableCell>
                                  <TableCell className='w-[10%]'>{obj.position}</TableCell>
                                  <TableCell className='w-[10%]'></TableCell>
                                </TableRow>
                              )
                            })
                          ) : (
                            <TableRow>
                              <TableCell colSpan={6} className=" text-center italic">No existe repuestos de spares</TableCell>
                            </TableRow>
                          )
                        )
                      }
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="spare">
            <div className=' h-full'>
              <h1 className='font-bold text-lg'>Lista de Equipos </h1>
              <div className="bg-white max-h-[300px] flex flex-col">
                <Table className="w-full">
                  <TableHeader className="bg-gray-200">
                    <TableRow>
                      <TableHead className="w-[30%]">Equipo</TableHead>
                      <TableHead className="w-[15%]">Spare</TableHead>
                      <TableHead className="w-[15%]">Estado</TableHead>
                      <TableHead className="w-[30%]">Ubicación</TableHead>
                      <TableHead className="w-[10%]">Stock</TableHead>
                    </TableRow>
                  </TableHeader>
                </Table>
                <div className="overflow-y-auto flex-1">
                  <Table className="w-full">
                    <TableBody>
                      {
                        tempSpare && tempSpare.length > 0 ? tempSpare.map((obj: any, index: number) => {
                          return (
                            <TableRow
                              key={index}
                              onClick={() => {
                                setSelectedIndex(index);
                                searchinfoRepairEquipment(obj)
                              }}
                              className={`hover:bg-green-300 cursor-pointer ${selectedIndex === index ? 'bg-green-300' : ''}`}>
                              <TableCell className="w-[30%]">{obj.equipo}</TableCell>
                              <TableCell className="w-[15%]">{obj.spare}</TableCell>
                              <TableCell className="w-[15%]">{obj.estado}</TableCell>
                              <TableCell className="w-[30%]">{obj.ubicación}</TableCell>
                              <TableCell className="w-[10%]">{obj.stock}</TableCell>
                            </TableRow>
                          )
                        }) : (
                          <TableRow>
                            <TableCell colSpan={5} className=" text-center italic">No existe spare</TableCell>
                          </TableRow>
                        )
                      }
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
            <div className='mt-5'>
              {
                infoRepairSpare ? (
                  <>
                    <h1 className='font-bold text-lg'>Información: </h1>
                    <div className="bg-white h-[350px] flex flex-col">
                      <div className='flex flex-row items-center p-2 gap-2'>
                        <Label className='font-bold text-md w-1/3'>Lugar de reparación:</Label>
                        <h1 className='text-md bg-gray-200 p-1 rounded-md w-full'>{infoRepairSpare.repair_location}</h1>
                      </div>
                      <div className='flex flex-row items-center p-2 gap-2'>
                        <Label className='font-bold text-md w-1/3'>Fecha de entrega:</Label>
                        <h1 className='text-md bg-gray-200 p-1 rounded-md w-full'>{infoRepairSpare.date}</h1>
                      </div>
                      <div className='flex flex-row items-center p-2 gap-2'>
                        <Label className='font-bold text-md w-1/3'>Criticidad:</Label>
                        <h1 className='text-md bg-gray-200 p-1 rounded-md w-full'>{infoRepairSpare.criticidad}</h1>
                      </div>
                      <div className='flex flex-row items-center p-2 gap-2'>
                        <Label className='font-bold text-md w-1/3'>Modos de falla:</Label>
                        <h1 className='text-md bg-gray-200 p-1 rounded-md w-full'>{infoRepairSpare.modo_de_falla}</h1>
                      </div>
                    </div>
                  </>
                )
                  :
                  <>
                    <h1 className='text-md bg-gray-200 p-1 rounded-md'>No hay información disponible</h1>
                  </>

              }

            </div>
          </TabsContent>
        </Tabs>
      </div> */}