'use client'
import { Button, Input } from '@nextui-org/react'
import { Loader, SearchIcon } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect } from 'react'

import { columns } from '@/app/admin/columns'
import { DataTable } from '@/app/admin/data-table'
import type { UserListResponse } from '@/app/admin/schema'
import { useDebounce } from '@/hooks/useDebounce'
import { useFetch } from '@/hooks/useFetch'
import { getDatesOfMonth } from '@/lib/date-utils'
import { userUrl } from '@/lib/urls'

const Page = () => {
  const { isLoading, response, fetcher } = useFetch<UserListResponse>()

  const [query, setQuery] = React.useState('')

  const searchTerm = useDebounce(query)

  useEffect(() => {
    fetcher(`${userUrl.userList}?q=${searchTerm}`)
  }, [searchTerm])

  const year = new Date().getFullYear()

  const month = new Date().getMonth() + 1

  console.log('getDatesOfMonth', getDatesOfMonth(year, month))

  return (
    <div className="p-4">
      <h3 className="p-2">Employees</h3>
      <div className="flex items-center justify-between">
        <Input
          classNames={{
            base: 'my-3 w-[45%]',
          }}
          name="search"
          placeholder="Search with Name, Email and Mobile number..."
          startContent={<SearchIcon />}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Link href={'admin/register'}>
          <Button>Add Employee</Button>
        </Link>
      </div>
      {isLoading ? <Loader className="animate-spin" /> : <DataTable columns={columns} data={response?.data || []} />}
    </div>
  )
}

export default Page
