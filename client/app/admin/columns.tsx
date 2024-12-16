'use client'

import { User } from '@/app/admin/schema'
import { ColumnDef } from '@tanstack/react-table'
import { CalendarClock } from 'lucide-react'
import Link from 'next/link'

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
    header: 'View Attendance',
    cell: ({ row }) => {
      return (
        <Link href={`admin/attendance/${row?.getValue('id')}`} className="px-4 py-2 rounded-md flex items-center">
          <CalendarClock className="hover:stroke-blue-700" />
        </Link>
      )
    },
  },
]
