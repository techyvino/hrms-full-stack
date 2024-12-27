/* eslint-disable no-use-before-define */
import { Table, TableBody, TableCell, TableColumn, TableHeader, type TableProps, TableRow } from '@nextui-org/react'
import type { ReactNode } from 'react'
import React from 'react'

export interface CellValue<TData> {
  row: TData
  column: ColumnDef<TData>
  value: TData[keyof TData]
}

export interface ColumnDef<TData> {
  accessorKey: keyof TData
  header: React.ReactNode
  cell?: ({ row, column, value }: CellValue<TData>) => React.ReactNode
  align?: 'start' | 'center' | 'end'
}

export interface NextTableProps<TData> extends TableProps {
  columns: ColumnDef<TData>[]
  data: TData[]
  isLoading?: boolean
}

export default function NextTable<TData>({ columns, data, isLoading, ...props }: NextTableProps<TData>) {
  return (
    <Table {...props}>
      <TableHeader columns={columns}>
        {({ header, align = 'start' }) => (
          <TableColumn key={header?.toString()} align={align}>
            {header}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody isLoading={isLoading} items={data}>
        {(row) => (
          <TableRow>
            {columns.map((column, index) => {
              const value = row[column?.accessorKey]

              return (
                <TableCell key={index}>
                  <div className="">
                    {column?.cell ? column?.cell({ row, column, value }) : (row[column.accessorKey] as ReactNode)}
                  </div>
                </TableCell>
              )
            })}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
