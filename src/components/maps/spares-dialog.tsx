'use client'
import { useEffect, useState } from "react"
import { FaEye, FaX } from "react-icons/fa6"
import { Label } from "../ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

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
    setSelectedIndex(-1);
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
  const [historialCondicionEquipo, setHistorialCondicionEquipo] = useState<any[]>([]);

  useEffect(() => {
    const tagResumen = componentsFilterData[0]?.["TAG RESUMEN"] || "";
    console.log("TAG RESUMEN:", tagResumen);
    if (!tagResumen) return;

    // Filtrar por TAG
    const filtrados = reportesFiltrados.filter(item => item["TAG"]?.includes(tagResumen));
    setHistorialCondicionEquipo(filtrados.reverse());

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

  console.log("Condición del equipo:", historialCondicionEquipo);

  const [openRepuestosDialog, setOpenRepuestosDialog] = useState(false);
  const [openReporteDialog, setOpenReporteDialog] = useState(false);


  // REPUESTOS - FALLAS
  const [repuestosFallaData, setRepuestosFallaData] = useState<any[]>([]);
  const [equipmentsRF, setEquipmentsRF] = useState<any[]>([]);
  const [failureModeRF, setFailureModeRF] = useState<any[]>([]);
  const [consultRF, setConsultRF] = useState({
    "Ubicación técnica": "",
    "Modo de falla": ""
  });
  const [resultRFConsult, setResultRFConsult] = useState<any[]>([]);

  const [openDialogModosFalla, setOpenDialogModosFalla] = useState(false);

  useEffect(() => {
    fetch('/data/repuestos_fallas.json')
      .then((response) => response.json())
      .then((data) => {
        setRepuestosFallaData(data);

        // --- Ubicaciones técnicas únicas ---
        const ubicaciones = Array.from(new Set(data.map((item: any) => item["Ubicación técnica"])));
        setEquipmentsRF(ubicaciones);

        // --- Modos de falla únicos ---
        const modos: string[] = [];
        data.forEach((item: any) => {
          ["Modo Falla 1", "Modo Falla 2", "Modo Falla 3", "Modo Falla 4"].forEach((col) => {
            if (item[col] && !modos.includes(item[col])) {
              modos.push(item[col]);
            }
          });
        });
        setFailureModeRF(modos);
      });
  }, []);

  const filterByLocationAndMode = () => {
    return repuestosFallaData.filter(
      (item: any) =>
        item["Ubicación técnica"] === consultRF["Ubicación técnica"] &&
        ["Modo Falla 1", "Modo Falla 2", "Modo Falla 3", "Modo Falla 4"].some(
          (col) => item[col] === consultRF["Modo de falla"]
        )
    );
  };

  useEffect(() => {
    if (consultRF["Ubicación técnica"] && consultRF["Modo de falla"]) {
      const filtered = filterByLocationAndMode();
      setResultRFConsult(filtered);
    }
  }, [consultRF, repuestosFallaData]);

  console.log("Repuestos por falla:", failureModeRF);

  return (
    <div className={`absolute flex flex-col max-h-[92%] right-0 top-14 bottom-0 ${openSpare ? 'w-[45%] opacity-100' : 'w-0 opacity-0'} bg-slate-300 z-50 border rounded-l-md p-2`}>
      <div className='p-2 bg-[#002645] rounded-md flex flex-row justify-between items-center w-full'>
        <h1 className='text-white font-bold xl:text-sm'>SPARE - REPUESTOS</h1>
        <FaX className='text-white right-2 top-2 cursor-pointer hover:bg-gray-300 p-1 rounded-md' onClick={() => {
          setOpenSpare(false)
          setEquipmentSelected(null)
          setCondicionEquipo(null);
          setSelectedReparacion(null);
        }} size={20} />
      </div>
      <div className='py-2 flex flex-row justify-between gap-4'>
        <div className='flex flex-row gap-2 items-center w-1/3'>
          {/* <Label className='font-bold'>Condición:</Label> */}
          <div className="">
            <h1 className="text-xs font-bold">
              {/* <h1 className="text-xs px-2 py-1 rounded-md bg-white"> */}
              {/* Semana {condicionEquipo?.SEMANA} */}
              Condición:
            </h1>
          </div>
          <div
            onClick={() => setOpenReporteDialog(true)}
            className={`flex w-1/2 px-2 py-1 rounded-md text-xs cursor-pointer
            ${condicionEquipo?.["CONDICION ACT."] === 'ALARMA' ? 'bg-[#F20000]' :
                condicionEquipo?.["CONDICION ACT."] === 'PRECAUCION' ? 'bg-[#FFC000]' :
                  condicionEquipo?.["CONDICION ACT."] === 'TOLERABLE' ? 'bg-[#FFFF00]' :
                    condicionEquipo?.["CONDICION ACT."] === 'NORMAL' ? 'bg-[#00A049]' :
                      condicionEquipo?.["CONDICION ACT."] === 'NORMAL' ? 'bg-[#B0B0B0]' :
                        'bg-white'}`}>
            {
              condicionEquipo?.SEMANA && condicionEquipo?.["CONDICION ACT."]
                ? `${condicionEquipo["CONDICION ACT."]}`
                : "Sin condición"
            }
          </div>
        </div>
        <div className='flex flex-row gap-2 items-center w-2/3'>
          <Label className='font-bold text-xs'>Equipo:</Label>
          <div className='flex bg-white w-full px-2 py-1 rounded-md text-xs'>
            {componentsFilterData[0]?.["TAG RESUMEN"]} - {componentsFilterData[0]?.Descrip_UT}
          </div>
        </div>
        {/* <div className='flex flex-row gap-2 items-center w-1/2'>
          <Label className='font-bold text-xs'>Familia:</Label>
          <div className='flex bg-white w-full px-2 py-1 rounded-md text-xs'>
            {componentsFilterData[0]?.Descrip_UT}
          </div>
        </div> */}
      </div>
      <Tabs defaultValue="installed" className='h-[100%]'>
        <TabsList className='flex flex-row w-full bg-white gap-1'>
          <TabsTrigger value="installed" className='w-1/2 bg-gray-300 hover:bg-gray-500 hover:text-white'>Equipos Instalados</TabsTrigger>
          <TabsTrigger value="spare" className='w-1/2 bg-gray-300 hover:bg-gray-500 hover:text-white'>Spare</TabsTrigger>
          {/* <TabsTrigger value="failure_mode" className='w-1/2 bg-gray-300 hover:bg-gray-500 hover:text-white'>Modo de Falla</TabsTrigger> */}
        </TabsList>
        <TabsContent value="installed" className=''>
          {/* Lista de componentes instalados y seleccionados en el mapa */}
          <div className="h-full">
            {/* <h1 className="font-bold text-lg">Equipos Instalados</h1> */}
            <div className="bg-white max-h-[550px] flex flex-col">
              <div className="overflow-y-auto flex-1">
                <Table className="w-full">
                  <TableHeader className="bg-gray-200 sticky top-0 z-10 text-xs">
                    <TableRow>
                      <TableHead className="w-[3%]">N°</TableHead>
                      <TableHead className="w-[30%]">Equipo</TableHead>
                      <TableHead className="w-[30%]">TAG</TableHead>
                      <TableHead className="w-[10%]">Criticidad</TableHead>
                      {/* <TableHead className="w-[20%]">Estado</TableHead> */}
                      {/* <TableHead className="w-[5%]">Condición</TableHead> */}
                      <TableHead className="w-[5%]">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {componentsFilterData && componentsFilterData.length > 0 &&
                      componentsFilterData.map((component: any, index) => (
                        <TableRow key={index} className="text-xs">
                          <TableCell className="w-[3%]">{index + 1}</TableCell>
                          <TableCell className="w-[30%]">{component["Descrip_UT"]}</TableCell>
                          <TableCell className="w-[10%]">{component["TAG-HIJO"]}</TableCell>
                          <TableCell className="w-[20%]">{component["Criticidad"]}</TableCell>
                          {/* <TableCell className="w-[30%]">{component["ESTADO"]}</TableCell> */}
                          {/* <TableCell className="w-[5%]">{component["CONDICION"]}</TableCell> */}
                          <TableCell className="w-[5%] flex flex-row gap-1">
                            <Button
                              className="hover:bg-gray-500"
                              onClick={() => {
                                setOpenRepuestosDialog(true);
                                searchRepuestobyComponent(component["TAG-HIJO"])
                              }}>
                              Rep.
                            </Button>
                            <Button
                              className="hover:bg-gray-500"
                              onClick={() => {
                                setOpenDialogModosFalla(true);
                                console.log("Componente seleccionado:", component["TAG-HIJO"]);
                                setConsultRF({
                                  "Ubicación técnica": component["TAG-HIJO"],
                                  "Modo de falla": ""
                                });
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
        </TabsContent>

        <TabsContent value="spare" >
          <div className=' h-full'>
            {/* <h1 className='font-bold text-lg'>Lista de Equipos </h1> */}
            <div className="bg-white max-h-[300px] flex flex-col">
              <div>
                <Table className="w-full">
                  <TableHeader className="bg-gray-200 text-sm">
                    <TableRow>
                      <TableHead className="w-[10%]">TAG</TableHead>
                      <TableHead className="w-[30%]">Equipo</TableHead>
                      <TableHead className="w-[15%]">Spare</TableHead>
                      <TableHead className="w-[15%]">Estado</TableHead>
                      <TableHead className="w-[30%]">Ubicación/Comentario</TableHead>
                      <TableHead className="w-[10%]">Stock</TableHead>
                    </TableRow>
                  </TableHeader>
                </Table>
              </div>
              <div className="overflow-y-auto flex-1">
                <Table className="w-full">
                  <TableBody>
                    {
                      sparesFilterByEquipment && sparesFilterByEquipment.length > 0 ? sparesFilterByEquipment.map((obj: any, index: number) => {
                        return (
                          <TableRow
                            key={index}
                            onClick={() => {
                              setSelectedIndex(index);
                              searchReparacionBySpare(obj.tag)
                              addUbicacionTecnica(obj)
                            }}
                            className={`hover:bg-gray-300 text-xs cursor-pointer ${selectedIndex === index ? 'bg-gray-300' : ''}`}>
                            <TableCell className="w-[10%]">{obj.tag}</TableCell>
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
          <div className='mt-2'>
            {
              selectedReparacion && selectedReparacion.length > 0 ? (
                <>
                  <div className="bg-white flex flex-col p-2 gap-2">
                    <h1 className='font-bold bg-slate-200 p-1 rounded-md'>Información de reparación: </h1>
                    <div className='flex flex-row items-center gap-2'>
                      <Label className='font-bold text-xs w-1/3'>Ubicación Técnica:</Label>
                      <h1 className='text-xs bg-gray-200 py-1 px-2 rounded-md w-full'>{selectedReparacion[0]["Ubicación técnica"]}</h1>
                    </div>
                    <div className='flex flex-row items-center gap-2'>
                      <Label className='font-bold text-xs w-1/3'>Lugar de reparación:</Label>
                      <h1 className='text-xs bg-gray-200 py-1 px-2 rounded-md w-full'>{selectedReparacion[0]["Pto.tbjo.responsable"]}</h1>
                    </div>
                    <div className='flex flex-row items-center gap-2'>
                      <Label className='font-bold text-xs w-1/3'>Fecha de entrega:</Label>
                      <h1 className='text-xs bg-gray-200 py-1 px-2 rounded-md w-full'>{selectedReparacion[0]["Fecha Entrega"]}</h1>
                    </div>
                    <div className='flex flex-row items-center gap-2'>
                      <Label className='font-bold text-xs w-1/3'>Aviso:</Label>
                      <h1 className='text-xs bg-gray-200 py-1 px-2 rounded-md w-full'>{selectedReparacion[0]["Aviso"]}</h1>
                    </div>
                    <div className='flex flex-row items-center gap-2'>
                      <Label className='font-bold text-xs w-1/3'>Orden:</Label>
                      <h1 className='text-xs bg-gray-200 py-1 px-2 rounded-md w-full'>{selectedReparacion[0]["Orden"]}</h1>
                    </div>
                    <div className='flex flex-row items-center gap-2'>
                      <Label className='font-bold text-xs w-1/3'>Status Aprobación:</Label>
                      <h1 className='text-xs bg-gray-200 py-1 px-2 rounded-md w-full'>{selectedReparacion[0]["Status Aprobación"]}</h1>
                    </div>
                    <div className='flex flex-row items-center gap-2'>
                      <Label className='font-bold text-xs w-1/3'>Status Ejecución:</Label>
                      <h1 className='text-xs bg-gray-200 py-1 px-2 rounded-md w-full'>{selectedReparacion[0]["Status Ejecución"]}</h1>
                    </div>
                    <div className='flex flex-row items-center gap-2'>
                      <Label className='font-bold text-xs w-1/3'>Texto breve operación:</Label>
                      <h1 className='text-xs bg-gray-200 py-1 px-2 rounded-md w-full'>{selectedReparacion[0]["Texto breve operación"]}</h1>
                    </div>
                  </div>
                </>
              )
                :
                <>
                  <h1 className='text-md bg-gray-200 p-2 rounded-md text-sm text-center italic'>No hay información disponible sobre reparación</h1>
                </>
            }
          </div>
        </TabsContent>

        {/* <TabsContent value="failure_mode">
          <div className="flex flex-col gap-2">
            <div className='h-full gap-2 flex flex-row'>
              <div className="flex flex-row gap-2 items-center w-1/2">
                <Label className='font-bold text-xs w-1/3'>Componente:</Label>
                <Select
                  value={consultRF["Ubicación técnica"]}
                  onValueChange={(value) => setConsultRF({ ...consultRF, "Ubicación técnica": value })}
                >
                  <SelectTrigger className="w-2/3">
                    <SelectValue placeholder="Seleccionar componente" />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      equipmentsRF.map((item: string, index: number) => (
                        <SelectItem key={index} value={item}>{item}</SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-row gap-2 items-center w-1/2">
                <Label className='font-bold text-xs w-1/3'>Modo de Falla:</Label>
                <Select
                  value={consultRF["Modo de falla"]}
                  onValueChange={(value) => setConsultRF({ ...consultRF, "Modo de falla": value })}
                >
                  <SelectTrigger className="w-2/3">
                    <SelectValue placeholder="Seleccionar modo de falla" />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      failureModeRF.map((item: string, index: number) => (
                        <SelectItem key={index} value={item}>{item}</SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='bg-white'>
              <Table>
                <TableHeader>
                  <TableRow className="text-xs bg-gray-200">
                    <TableHead>Ubicacion Tecnica</TableHead>
                    <TableHead>Componente</TableHead>
                    <TableHead>Descripcion</TableHead>
                    <TableHead>Stock</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                    resultRFConsult && resultRFConsult.length > 0 ?
                      resultRFConsult.map((item: any, index: number) => (
                        <TableRow key={index} className="text-xs">
                          <TableCell>{item["Ubicación técnica"]}</TableCell>
                          <TableCell>{item["Componente"]}</TableCell>
                          <TableCell>{item["Texto breve de material"]}</TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      ))
                      :
                      (
                        <TableRow className="text-xs">
                          <TableCell colSpan={3} className="text-center italic">No hay datos disponibles</TableCell>
                        </TableRow>
                      )
                  }
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent> */}
      </Tabs>

      {/* Dialog for MM60 Repuesto */}
      <Dialog open={openMm60RepuestoDialog} onOpenChange={() => { setOpenMm60RepuestoDialog(false) }}>
        <DialogContent className="bg-gray-200">
          <DialogHeader>
            <DialogTitle>Detalles del Repuesto segun MM60</DialogTitle>
          </DialogHeader>
          <div className="text-sm">
            {
              itemsNdVbData && itemsNdVbData.length > 0 ? itemsNdVbData.map((obj: any, index: number) => {
                return (
                  <div key={index} className="bg-white p-2 rounded-md gap-2 flex flex-col text-xs">
                    <div className="flex flex-row gap-2 items-center">
                      <Label className="font-bold w-1/3"># Repuesto:</Label>
                      <h1 className="bg-gray-100 p-2 rounded-md w-full">{obj["Material"]}</h1>
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                      <Label className="font-bold w-1/3">Texto Breve:</Label>
                      <h1 className="bg-gray-100 p-2 rounded-md w-full">{obj["Texto breve de material"]}</h1>
                    </div>
                    <div className="flex flex-row gap-2">
                      <div className="flex flex-row gap-2 items-center w-1/2">
                        <Label className="font-bold w-1/2">Caract. planif. nec.:</Label>
                        <h1 className="bg-gray-100 p-2 rounded-md w-1/2">{obj["Caract.planif.nec."]}</h1>
                      </div>
                      <div className="flex flex-row gap-2 items-center w-1/2">
                        <Label className="font-bold w-1/2">Indicador ABC:</Label>
                        <h1 className="bg-gray-100 p-2 rounded-md w-1/2">{obj["Indicador ABC"]}</h1>
                      </div>
                    </div>
                    <div className="flex flex-row gap-2">
                      <div className="flex flex-row gap-2 items-center w-1/2">
                        <Label className="font-bold w-1/3">Grupo de Compras:</Label>
                        <h1 className="bg-gray-100 p-2 rounded-md w-full">{obj["Grupo de compras"]}</h1>
                      </div>
                      <div className="flex flex-row gap-2 items-center w-1/2">
                        <Label className="font-bold w-1/3">Grupo de Artículos:</Label>
                        <h1 className="bg-gray-100 p-2 rounded-md w-full">{obj["Grupo de artículos"]}</h1>
                      </div>
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                      <Label className="font-bold w-1/3">Última modificación:</Label>
                      <h1 className="bg-gray-100 p-2 rounded-md w-full">{obj["Última modificación"]}</h1>
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                      <Label className="font-bold w-1/3">Autor:</Label>
                      <h1 className="bg-gray-100 p-2 rounded-md w-full">{obj["Autor"]}</h1>
                    </div>
                  </div>
                )
              }) : (
                <h1>No hay información disponible</h1>
              )
            }
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de repuestos */}
      <Dialog open={openRepuestosDialog} onOpenChange={() => { setOpenRepuestosDialog(false) }}>
        <DialogContent className="max-h-[90vh] min-w-[800px] bg-gray-200">
          <DialogHeader>
            <DialogTitle>Repuestos de</DialogTitle>
          </DialogHeader>
          <div className=''>
            {/* <h1 className='font-bold text-lg'>Lista de Repuestos </h1> */}
            <div className="bg-white max-h-[500px] flex flex-col">
              <div>
                <Table className="w-full">
                  <TableHeader className="bg-gray-100">
                    <TableRow className="text-xs">
                      <TableHead className='w-[12%]'>Componente</TableHead>
                      <TableHead className='w-[33%]'>Texto breve del material</TableHead>
                      {/* <TableHead className='w-[10%]'>Ubicación Técnica</TableHead> */}
                      <TableHead className='w-[15%]'>Tipo de material</TableHead>
                      <TableHead className='w-[10%]'># posición</TableHead>
                      <TableHead className='w-[10%]'>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                </Table>
              </div>
              <div className="overflow-y-auto flex-1">
                <Table className="w-full">
                  <TableBody>
                    {
                      repuestosFilterData.length > 0 ? repuestosFilterData.map((obj: any, index: number) => {
                        return (
                          <TableRow
                            key={index}
                            className="text-xs">
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
        </DialogContent>
      </Dialog>

      {/* Dialog de condicion de equipo */}
      <Dialog open={openReporteDialog} onOpenChange={setOpenReporteDialog}>
        <DialogContent className="max-h-[90vh] min-w-[80%] bg-gray-200 flex flex-col">
          <DialogHeader>
            <DialogTitle>CONDICIÓN DE EQUIPO</DialogTitle>
          </DialogHeader>
          <div className="flex flex-row gap-2">
            <div className="flex flex-col bg-white text-xs overflow-y-auto rounded-sm w-3/4 max-h-[calc(70vh-20px)] p-2 gap-2">
              <Label className="font-bold bg-slate-200 p-2 rounded-md">Reporte Actual:</Label>
              <div className="flex flex-row gap-4 w-full">
                <div className="flex flex-row gap-2 items-center w-1/3">
                  <Label className="font-bold">Semana:</Label>
                  <h1 className="bg-gray-100 px-2 py-1 w-full rounded-md">{condicionEquipo?.["SEMANA"]}</h1>
                </div>
                <div className="flex flex-row gap-2 items-center w-1/3">
                  <Label className="font-bold">Condicion:</Label>
                  <h1 className={`px-2 py-1 w-full rounded-md font-bold
                  ${condicionEquipo?.["CONDICION ACT."] === 'ALARMA' ? 'bg-[#F20000]' :
                      condicionEquipo?.["CONDICION ACT."] === 'PRECAUCION' ? 'bg-[#FFC000]' :
                        condicionEquipo?.["CONDICION ACT."] === 'TOLERABLE' ? 'bg-[#FFFF00]' :
                          condicionEquipo?.["CONDICION ACT."] === 'NORMAL' ? 'bg-[#00A049]' :
                            condicionEquipo?.["CONDICION ACT."] === 'NORMAL' ? 'bg-[#B0B0B0]' :
                              'bg-white'}
                    `}>{condicionEquipo?.["CONDICION ACT."]}</h1>
                </div>
                <div className="flex flex-row gap-2 items-center w-1/3">
                  <Label className="font-bold">Fecha:</Label>
                  <h1 className="bg-gray-100 px-2 py-1 w-full rounded-md">{condicionEquipo?.["FECHA"]}</h1>
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <div className="flex flex-row gap-2 items-center w-1/3">
                  <Label className="font-bold">TAG:</Label>
                  <h1 className="bg-gray-100 px-2 py-1 w-full rounded-md">{condicionEquipo?.["TAG"]}</h1>
                </div>
                <div className="flex flex-row gap-2 items-center w-2/3">
                  <Label className="font-bold">Equipo:</Label>
                  <h1 className="bg-gray-100 px-2 py-1 w-full rounded-md">{condicionEquipo?.["ACTIVO"]}</h1>
                </div>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <Label className="font-bold">Área:</Label>
                <h1 className="bg-gray-100 px-2 py-1 w-full rounded-md">{condicionEquipo?.["AREA"]}</h1>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <Label className="font-bold">Diagnóstico/Observación:</Label>
                <h1 className="bg-gray-100 px-2 py-1 w-full rounded-md whitespace-pre-line">
                  {condicionEquipo?.["PLAN DE ACCIÓN"]}
                </h1>
                {/* <Textarea value={condicionEquipo?.["DIAGNÓSTICO / OBSERVACIÓN"]} /> */}
              </div>
              <div className="flex flex-row gap-2 items-center">
                <Label className="font-bold">Plan de acción:</Label>
                <h1 className="bg-gray-100 px-2 py-1 w-full rounded-md whitespace-pre-line">{condicionEquipo?.["PLAN DE ACCIÓN"]}</h1>
                {/* <Textarea value={condicionEquipo?.["PLAN DE ACCIÓN"]} /> */}
              </div>
              <div className="flex flex-row gap-2 items-center">
                <Label className="font-bold">N° de aviso:</Label>
                <h1 className="bg-gray-100 px-2 py-1 w-full rounded-md">{condicionEquipo?.["N° AVISO"]}</h1>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <div className="flex flex-row gap-2 items-center w-1/2">
                  <Label className="font-bold">Técnica:</Label>
                  <h1 className="bg-gray-100 px-2 py-1 w-full rounded-md">{condicionEquipo?.["Técnica"]}</h1>
                </div>
                <div className="flex flex-row gap-2 items-center w-1/2">
                  <Label className="font-bold">Modo de falla:</Label>
                  <h1 className="bg-gray-100 px-2 py-1 w-full rounded-md">{condicionEquipo?.["Modo de falla"] === "" ? "Sin modo de falla registrado" : condicionEquipo?.["Modo de falla"]}</h1>
                </div>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <div className="flex flex-row gap-2 items-center w-1/2">
                  <Label className="font-bold"># Orden de Trabajo:</Label>
                  <h1 className="bg-gray-100 px-2 py-1 w-full rounded-md">{condicionEquipo?.["OT"] === 0 ? "Sin orden de trabajo" : condicionEquipo?.["OT"]}</h1>
                </div>
                <div className="flex flex-row gap-2 items-center w-1/2">
                  <Label className="font-bold">Fecha de inicio extremo:</Label>
                  <h1 className="bg-gray-100 px-2 py-1 w-full rounded-md">{condicionEquipo?.["Fecha Inicio Extremo"] === "" ? "Sin fecha de inicio extremo registrada" : condicionEquipo?.["Fecha Inicio Extremo"]}</h1>
                </div>
              </div>


            </div>
            <div className="bg-white text-xs rounded-sm w-1/4 max-h-[calc(90vh-20px)]">
              <div className="p-2 gap-2 flex flex-col  overflow-auto max-h-[calc(70vh-20px)]">
                <Label className="font-bold bg-slate-200 p-2 rounded-md">Reportes Anteriores:</Label>
                {
                  historialCondicionEquipo.map((reporte, index) => (
                    <div key={index} className="flex flex-row gap-2 items-center p-2 border border-gray-300 bg-gray-100 rounded-md">
                      <div className={`font-bold p-2 rounded-md flex justify-center  ${reporte["CONDICION ACT."] === 'ALARMA' ? 'bg-[#F20000]' :
                        reporte["CONDICION ACT."] === 'PRECAUCION' ? 'bg-[#FFC000]' :
                          reporte["CONDICION ACT."] === 'TOLERABLE' ? 'bg-[#FFFF00]' :
                            reporte["CONDICION ACT."] === 'NORMAL' ? 'bg-[#00A049]' :
                              reporte["CONDICION ACT."] === 'NORMAL' ? 'bg-[#B0B0B0]' :
                                'bg-white'}`}>
                        {reporte["CONDICION ACT."]}
                      </div>
                      <div>
                        <h1>Semana {reporte["SEMANA"]}</h1>
                        <h1>{reporte["Técnica"]}</h1>
                        <h1>{reporte["Modo de falla"] === '' ? "Sin modo de falla" : reporte["Modo de Falla"]}</h1>
                      </div>
                    </div>
                  ))
                }

              </div>
            </div>
          </div>

        </DialogContent>
      </Dialog>

      {/* Dialog Modos de falla segun equipo instalado. */}
      <Dialog open={openDialogModosFalla} onOpenChange={() => setOpenDialogModosFalla(false)}>
        <DialogContent className="min-w-[60vw]">

          <DialogHeader>
            <DialogTitle>Repuestos según ISO 14224</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2 h-[70vh]">
            <div className="flex flex-row gap-2 items-center w-full">
              <Label className='font-bold text-xs'>Componente:</Label>
              <h1 className="bg-gray-100 px-2 py-1 w-full rounded-md">{consultRF["Ubicación técnica"]}</h1>
            </div>
            <div className="flex flex-row gap-2 items-center w-full">
              <Label className='font-bold text-xs w-1/3'>Modo de Falla:</Label>
              <Select
                value={consultRF["Modo de falla"]}
                onValueChange={(value) => setConsultRF({ ...consultRF, "Modo de falla": value })}
              >
                <SelectTrigger className="w-2/3">
                  <SelectValue placeholder="Seleccionar modo de falla" />
                </SelectTrigger>
                <SelectContent>
                  {
                    failureModeRF.map((item: string, index: number) => (
                      <SelectItem key={index} value={item}>{item}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
            <div className=''>
              <div className="sticky top-0 z-10">
                <Table>
                  <TableHeader>
                    <TableRow className="text-xs bg-gray-200">
                      <TableHead>Ubicacion Tecnica</TableHead>
                      <TableHead>Componente</TableHead>
                      <TableHead>Descripcion</TableHead>
                      <TableHead>Stock</TableHead>
                    </TableRow>
                  </TableHeader>
                </Table>
              </div>
              <div className="bg-white flex overflow-auto h-[90%]">
                <Table>
                  <TableBody>
                    {
                      resultRFConsult && resultRFConsult.length > 0 ?
                        resultRFConsult.map((item: any, index: number) => (
                          <TableRow key={index} className="text-xs">
                            <TableCell>{item["Ubicación técnica"]}</TableCell>
                            <TableCell>{item["Componente"]}</TableCell>
                            <TableCell>{item["Texto breve de material"]}</TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        ))
                        :
                        (
                          <TableRow className="text-xs">
                            <TableCell colSpan={3} className="text-center italic">No hay datos disponibles</TableCell>
                          </TableRow>
                        )
                    }
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div >
  )
}

export default SparesDialog
