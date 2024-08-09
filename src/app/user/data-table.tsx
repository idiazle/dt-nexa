"use client"
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
    TableRow,
} from "@/components/ui/table"
import { useContext, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { OptionAsideContext } from '@/context/option-aside-context'

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        autoResetPageIndex: false,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection
        }
    })
    const [selectToolValue, setSelectToolValue] = useState<string>('')

    const {option} = useContext(OptionAsideContext)
    console.log(option);
    

    return (

        <div className='h-full'>
            {/* <div className="flex items-center py-4">
                <Input
                    placeholder="Filtrar nombre..."
                    value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
                    onChange={(event) =>
                        table.getColumn('email')?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
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
            <div className='mb-3'>
                <Select value={selectToolValue} onValueChange={(value: string) => {
                    setSelectToolValue(value)
                    if (value === '1') {
                        // setBulkDialogEdit(true)
                    }
                }}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Herramientas" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem disabled={table.getFilteredSelectedRowModel().rows.length === 0} value="1">Edición masiva</SelectItem>
                        <SelectItem disabled value="2">Descarga grupal</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <div className="flex-1 text-sm text-muted-foreground mb-3">
                    {table.getFilteredSelectedRowModel().rows.length} de{' '}
                    {table.getFilteredRowModel().rows.length} columna(s) seleccionados.
                </div>
            </div> */}
            <div className="rounded-md border border-slate-500/40 h-full w-full flex flex-col">
                <ScrollArea className='max-h-[80vh] w-full rounded-md'>
                    <Table wrapperClassName='overflow-clip'>
                        <TableHeader className="bg-[#1bb398] sticky top-0">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="border-none">
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead className="text-white h-8 text-[12px] text-center" key={header.id}>
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
                        <TableBody className='bg-[#f8f8fd]'>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        className="border-none hover:bg-slate-200"
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="p-2 px-4 text-[11px] text-center">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <ScrollBar orientation="horizontal" />

                </ScrollArea>
                {/* <div className="h-3 w-3"></div> */}
                <div className="flex items-center justify-end px-2 pt-3">
                    {/* <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div> */}
                    <div className="flex flex-row justify-center items-center mb-5">
                        <div className="flex flex-row justify-center items-center space-x-2">
                            <p className="text-sm font-medium">Elementos por página</p>
                            <Select
                                value={`${table.getState().pagination.pageSize}`}
                                onValueChange={(value: any) => {
                                    table.setPageSize(Number(value))
                                }}
                            >
                                <SelectTrigger className="h-6 w-[60px] bg-[#4bb398] border-none">
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
                        </div>
                        <div className="flex w-[100px] items-center justify-center text-sm font-medium ">
                            Página {table.getState().pagination.pageIndex + 1} de{' '}
                            {table.getPageCount()}
                        </div>

                        <div className="flex items-center space-x-2">
                            <Button
                                variant={'outline'}
                                className="hidden h-7 w-7 p-0 lg:flex bg-[#4bb398] border-none"
                                onClick={() => { table.setPageIndex(0) }}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <DoubleArrowLeftIcon className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                className="h-7 w-7 p-0 bg-[#4bb398] border-none"
                                onClick={() => { table.previousPage() }}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <ChevronLeftIcon className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                className="h-7 w-7 p-0 bg-[#4bb398] border-none"
                                onClick={() => { table.nextPage() }}
                                disabled={!table.getCanNextPage()}
                            >
                                <ChevronRightIcon className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                className="hidden h-7 w-7 p-0 lg:flex bg-[#4bb398] border-none"
                                onClick={() => { table.setPageIndex(table.getPageCount() - 1) }}
                                disabled={!table.getCanNextPage()}
                            >
                                <DoubleArrowRightIcon className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
