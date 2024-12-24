'use client'
import type { ColumnDef } from '@tanstack/react-table'
import { CalendarClock } from 'lucide-react'
import Link from 'next/link'

import type { User } from '@/app/admin/schema'

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'gender',
    header: 'Gender',
  },
  {
    accessorKey: 'mobile_no',
    header: 'Mobile No',
  },
  {
    accessorKey: 'department',
    header: 'Department',
  },
  {
    accessorKey: 'designation',
    header: 'Designation',
  },
  {
    accessorKey: 'role_name',
    header: 'Role',
  },
  {
    accessorKey: 'site_name',
    header: 'Site',
  },
  {
    accessorKey: 'joined_date',
    header: 'Joined Date',
  },
  {
    accessorKey: 'live_tracker_enabled',
    header: 'Live Tracker',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'id',
    header: 'Attendance',
    cell: ({ row }) => {
      return (
        <Link className="flex items-center rounded-md px-4 py-2" href={`admin/attendance/${row?.getValue('id')}`}>
          <CalendarClock className="hover:stroke-blue-700" />
        </Link>
      )
    },
  },
]
