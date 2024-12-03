'use client'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  type SortingState,
  getSortedRowModel,
  type ColumnFiltersState,
  getFilteredRowModel,
  type VisibilityState

} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import SearchDocumentDialog from '@/components/admin/documents/search-document-dialog'
import SearchDocumentBlock from '@/components/admin/documents/search-document-block'

interface DataTableProps<TData, TValue> {
  columns: Array<ColumnDef<TData, TValue>>
  data: TData[]
  pagination: any
  setPagination: (value: any) => void
  setMyData: (value: any) => void
  loading: boolean
  setPressingButtons: (value: any) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination,
  setPagination,
  setMyData,
  setPressingButtons,
  loading
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: true,
    title: true,
    filename: true,
    author: false,
    vendor_status: false,
    vendor_code: false,
    vendor_revision: false,
    vendor_revision_by: false,
    confidential: false,
    client_po_contract: false,
    doc_expiracy: false,
    days_expired: false,
    client_code: false,
    client_revision_alt: false,
    client_revision_by: false,
  })



  const table = useReactTable({
    data,
    columns,

    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
    manualPagination: true,
    pageCount: pagination.totalPages,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination
    },
    // initialState: {
    //   columnVisibility: {

    //   }
    // }
    // initialState:{
    //   pagination:{
    //     pageIndex:pagination.pageIndex,
    //     pageSize:20
    //   }
    // }
  })


  const [openDialog, setOpenDialog] = useState<boolean>(false)



  return (
    <div>
      <div className="flex flex-col  items-center py-4">
        <div className='w-full flex justify-start items-start'>
          {
            !openDialog ?
              <Button variant={'outline'} onClick={() => setOpenDialog(!openDialog)}>
                Buscar Documento
              </Button>
              : null
          }
        </div>
        {
          <div className={`transition-all duration-500 ${!openDialog ? 'hidden' : ''} overflow-hidden my-5`}>
            <SearchDocumentBlock setShow={setOpenDialog} setMyData={setMyData} setPagination={setPagination} />
          </div>
        }

        {/* {
          openDialog ?
            <SearchDocumentDialog setPagination={setPagination} openDialog={openDialog} setOpenDialog={setOpenDialog} setMyData={setMyData} /> : null
        } */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columnas
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter(
                (column) => column.getCanHide()
              )
              .map((column) => {

                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => { column.toggleVisibility(!!value) }
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <h1 className='text-right'>Mostrando {table.getRowCount()} de {pagination.totalDocuments} documentos</h1>
      <div className="rounded-md border">
        <Table wrapperClassName='overflow-clip'>
          <TableHeader className="sticky -top-5 bg-secondary">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length
              ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        className='border' key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )
              : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    {
                      loading ? 'Cargando' : 'No results.'
                    }
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end px-2 pt-3">
        <div className="flex flex-row justify-center items-center">
          {/* <div className="flex flex-row justify-center items-center space-x-2">
            <p className="text-sm font-medium">Elementos por página</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div> */}
          <div className="flex w-[100px] items-center justify-center text-sm font-medium ">
            Página {table.getState().pagination.pageIndex} de{' '}
            {table.getState().pagination.pageSize}
          </div>
          {/* <p>{JSON.stringify(table.getState().pagination)}</p> */}
          {/* <p>{JSON.stringify(table.getPageCount())}</p> */}

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0 lg:flex"
              onClick={() => { table.setPageIndex(1), setPressingButtons((prev: boolean) => !prev) }}
              disabled={table.getState().pagination.pageIndex === 1 ? true : false}
            >
              <DoubleArrowLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => { table.previousPage(), setPressingButtons((prev: boolean) => !prev) }}
              disabled={table.getState().pagination.pageIndex === 1 ? true : false}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => { table.nextPage(), setPressingButtons((prev: boolean) => !prev) }}
              disabled={table.getState().pagination.pageIndex === table.getState().pagination.pageSize ? true : false}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0 lg:flex"
              onClick={() => { table.setPageIndex(table.getState().pagination.pageSize), setPressingButtons((prev: boolean) => !prev) }}
              disabled={table.getState().pagination.pageIndex === table.getState().pagination.pageSize ? true : false}
            >
              <DoubleArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
