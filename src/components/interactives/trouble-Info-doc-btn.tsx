import { getAllAuxList, getDocumentsByArea } from '@/api/admin/documents-api'
import { type OneAuxStructure } from '@/lib/utils'
import React, { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import Spinner from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import ModalViewMedia from '../viewers/modal-viewer'
import TroubleMap2dTable from './trouble-map2d-table'

interface TshootInfDocumButtonsStructure {
  data: any
  setData: (value: any) => void
  trouble: any
  triggerButton: any
  setIsThereInfoDoc: (value: boolean) => void
}
export const TshootInfDocumButtons = ({ data, setData, trouble, triggerButton, setIsThereInfoDoc }: TshootInfDocumButtonsStructure) => {
  // console.log('ABRIENDO', data.equipment_id)

  let parsedProblems = []
  if (trouble != null && trouble.length > 0) {
    const send = trouble.map((obj: any) => {
      return {
        ...obj,
        problem: JSON.parse(obj.problem)
      }
    })
    parsedProblems = send.map((obs: any) => {
      return {
        ...obs,
        problem: obs.problem.problem,
        problem_causes: obs.problem.problem_causes
      }
    })
  }
  const initialFilter = {
    aux_module_id: 'Sin filtro',
    aux_discipline_id: 'Sin filtro',
    aux_type_id: 'Sin filtro'
  }
  const [filterSearch, setFilterSearch] = useState(initialFilter)

  const [modules, setModules] = useState<OneAuxStructure[] | null>(null)
  const [disciplines, setDisciplines] = useState<OneAuxStructure[] | null>(null)
  const [types, setTypes] = useState<OneAuxStructure[] | null>(null)

  const removeDuplicates = (data: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const nombresSet = new Set(data.map((tipo: any) => tipo.name.trim()))
    const tiposUnicos = Array.from(nombresSet).reduce((acc: any, nombre: any) => {
      const tiposConNombre = data.filter((tipo: any) => tipo.name.trim() === nombre.trim())
      const ids = tiposConNombre.map((tipo: any) => tipo.id)
      const tipoUnico = {
        id: ids,
        name: nombre
      }
      // Agregar el objeto al acumulador
      acc.push(tipoUnico)
      return acc
    }, [])
    return tiposUnicos as OneAuxStructure[]
  }
  const getDocsAux = async () => {
    // console.log("ENTRANDo");
    const rpta = await getAllAuxList()
    // getAllAuxList().then((rpta) => {
    // console.log(rpta.data.data.modules)
    setModules(rpta.data.data.modules)
    setDisciplines(removeDuplicates(rpta.data.data.disciplines))
    setTypes(removeDuplicates(rpta.data.data.types))
  }

  useEffect(() => {
    getDocsAux()
  }, [triggerButton])

  const [documentsNoFilter, setDocumentsNoFilter] = useState<null | any>(null)
  const [filteredDocunent, setFilteredDocunent] = useState<any | null>(null)

  // console.log(triggerButton);
  const getDocsByIdSearch = async () => {
    console.log('ENTRANDO')
    setDocumentsNoFilter(null)
    setFilteredDocunent(null)
    setFilterSearch(initialFilter)

    try {
      const response = await getDocumentsByArea(data.equipment_id as number, '3')
      // console.log('MY RESPONSE', response)
      if (response.status === 200) {
        setDocumentsNoFilter(response.data.data)
        setFilteredDocunent(response.data.data)
        // console.log(response.data.data.length)

        if (response.data.data.length > 0) {
          setIsThereInfoDoc(true)
        } else {
          setIsThereInfoDoc(false)
        }
      }
    } catch (error) {
      console.log('error', error)
      setDocumentsNoFilter([])
      setFilteredDocunent([])
    }
  }

  useEffect(() => {
    // setIsThereInfoDoc(true)
    if (data.equipment_id != null) {
      getDocsByIdSearch()
    }
  }, [data.equipment_id, triggerButton])

  // console.log(filterSearch)

  const filteringDocuments = () => {
    const filtered = documentsNoFilter.filter((obj: any) => {
      const moduleMatch = filterSearch.aux_module_id === 'Sin filtro' || String(obj.document_id.aux_module_id.id) === filterSearch.aux_module_id
      // const disciplineMatch = filterSearch.aux_discipline_id === 'Sin filtro' || String(obj.document_id.aux_discipline_id.id) === filterSearch.aux_discipline_id
      const disciplineMatch = filterSearch.aux_discipline_id === 'Sin filtro' || filterSearch.aux_discipline_id.includes(String(obj.document_id.aux_discipline_id.id))
      // const typeMatch = filterSearch.aux_type_id === 'Sin filtro' || String(obj.document_id.aux_type_id.id) === filterSearch.aux_type_id
      const typeMatch = filterSearch.aux_type_id === 'Sin filtro' || filterSearch.aux_type_id.includes(String(obj.document_id.aux_type_id.id))

      return moduleMatch && disciplineMatch && typeMatch
    })
    setFilteredDocunent(filtered)
  }

  const [fileSelected, setFileSelected] = useState<any | null>(null)
  const [openDialogDoc, setOpenDialogDoc] = useState<boolean>(false)
  const handleViewDoc = (file: any) => {
    setFileSelected({
      data: file.document_id
    })
    setOpenDialogDoc(true)
  }
  // console.log(filterSearch.aux_type_id)
  // console.log(filterSearch.aux_type_id.length)
  // console.log(filterSearch.aux_type_id.includes(','))

  return (
    <div className="flex w-full h-full flex-col p-2 bg-[#f1f1f1] border-l border-r border-b border-[#c2c2c2] rounded-b">
      {
        data.operation_type === 1
          ? <div className='h-full p-2 overflow-auto'>
            {
              trouble == null
                ? <p className='text-black'>Cargando</p>
                : trouble.length > 0
                  ? <TroubleMap2dTable problems={parsedProblems} />
                  : <p className='text-black'>No existen registros</p>
            }
          </div>
          : <div className='flex w-full h-full flex-col p-2'>
            <div className='flex flex-row gap-3'>
              {
                modules !== null
                  ? <Select value={filterSearch.aux_module_id} onValueChange={(e) => {
                    setFilterSearch({
                      ...filterSearch,
                      aux_module_id: e
                    })
                  }} >
                    <SelectTrigger className="w-full h-8">
                      <SelectValue placeholder="Módulo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={'Sin filtro'}>Sin filtro</SelectItem>
                      {
                        modules?.map((module: OneAuxStructure) => {
                          return (
                            <SelectItem key={module.id} value={String(module.id)}>{module.name}</SelectItem>
                          )
                        })
                      }
                    </SelectContent>
                  </Select>
                  // <Select
                  //   className='bg-white'
                  //   size="sm"
                  //   onChange={e => handleChangeSelect(e)}
                  //   name="aux_module_id"
                  //   placeholder='Módulo'
                  //   value={filterSearch.aux_module_id}
                  // >
                  //   {
                  //     modules.map((module, index) => {
                  //       return (
                  //         <option key={module.id} value={module.id}>
                  //           {module.name}
                  //         </option>
                  //       );
                  //     })
                  //   }
                  // </Select>
                  : <Spinner />
              }
              <Select value={filterSearch.aux_discipline_id} onValueChange={(e) => {
                setFilterSearch({
                  ...filterSearch,
                  aux_discipline_id: e
                })
              }} >
                <SelectTrigger className="w-full h-8">
                  <SelectValue placeholder="Disciplina" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={'Sin filtro'}>Sin filtro</SelectItem>

                  {
                    disciplines?.map((module: OneAuxStructure) => {
                      return (
                        <SelectItem key={module.id} value={String(module.id)}>{module.name}</SelectItem>
                      )
                    })
                  }
                </SelectContent>
              </Select>
              {/* <Select
                size="sm"
                className='bg-white'
                name="aux_discipline_id"
                onChange={e => { handleChangeSelect(e) }}
                value={filterSearch.aux_discipline_id}
                placeholder='Disciplina'
              >
                {disciplines
                  ? (
                      disciplines.map((discipline, index) => {
                        return (
                      <option key={discipline.id} value={discipline.id}>
                        {discipline.name}
                      </option>
                        )
                      })
                    )
                  : (
                  <option> N / A</option>
                    )}
              </Select> */}
              <Select value={filterSearch.aux_type_id} onValueChange={(e) => {
                setFilterSearch({
                  ...filterSearch,
                  aux_type_id: e
                })
              }} >
                <SelectTrigger className="w-full h-8">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={'Sin filtro'}>Sin filtro</SelectItem>

                  {
                    types?.map((module: OneAuxStructure) => {
                      return (
                        <SelectItem key={module.id} value={String(module.id)}>{module.name}</SelectItem>
                      )
                    })
                  }
                </SelectContent>
              </Select>
              {/* <Select
                size="sm"
                className='bg-white'
                name="aux_type_id"
                value={filterSearch.aux_type_id}
                onChange={e => { handleChangeSelect(e) }}
                isRequired={true}
                placeholder='Tipo'
              >
                {types
                  ? (
                    types.map((e, index) => {
                      return (
                        <option key={index} value={e.id}>
                          {e.name}
                        </option>
                      )
                    })
                  )
                  : (
                    <option> N / A</option>
                  )}
              </Select> */}
              <div className='flex flex-row justify-end items-center'>
                <Button
                  // isDisabled={filterSearch.aux_module_id != '' && filterSearch.aux_discipline_id != '' && filterSearch.aux_type_id != '' ? false : true}
                  onClick={() => { filteringDocuments() }} size={'sm'} className={'bg-[#002a98] h-8 text-white w-28 hover:bg-[#002b987e]'}>Buscar</Button>
              </div>
            </div>
            <div className='mt-5 h-full overflow-auto'>
              {
                data.equipment_id === null || documentsNoFilter === null
                  ? <div className='flex justify-center items-center h-full w-full'>
                    <Spinner />
                  </div>
                  : <div className='mt-1'>
                    <h1 className='text-black font-semibold text-sm'>Documentos</h1>
                    {
                      documentsNoFilter === null
                        ? <p className='text-black'>No existen documentos relacionados a este TAG</p>
                        : <Table>
                          {/* <TableCaption>Cantidad de documentos encontrados: {filteredDocunent.length}</TableCaption> */}
                          <TableHeader>
                            <TableRow className='bg-[#848484]'>
                              <TableHead className='text-white'>Título</TableHead>
                              <TableHead className='text-white'>Código</TableHead>
                              <TableHead className='text-white'>Rev.</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody className='bg-white'>
                            {
                              filteredDocunent?.map((obj: any) => {
                                // console.log(obj);

                                return (
                                  <TableRow style={{ height: 10 }} className='hover:cursor-pointer' key={obj.id} onClick={() => { handleViewDoc(obj) }}>
                                    <TableCell className='text-black'>{obj.document_id?.title}</TableCell>
                                    <TableCell className='text-black' >{obj.document_id?.client?.code_client}</TableCell>
                                    <TableCell className='text-black'>{obj.document_id?.client?.revision_client}</TableCell>
                                  </TableRow>
                                )
                              })
                            }

                          </TableBody>
                        </Table>
                    }
                  </div>
              }
            </div>
            <div className='flex justify-center items-center mt-1'>
              <h1 className='text-black text-sm font-semibold'>Cantidad de documentos encontrados: {filteredDocunent?.length}</h1>
            </div>
            {
              openDialogDoc
                ? <ModalViewMedia setOpen={setOpenDialogDoc} open={openDialogDoc} information={fileSelected} type={'document'} />
                : null
            }

          </div>
      }
    </div>
  )
}
