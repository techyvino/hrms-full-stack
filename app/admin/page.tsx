'use client'
import { Button, Input } from '@nextui-org/react'
import { SearchIcon } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect } from 'react'

import { columns } from '@/app/admin/columns'
import { DataTable } from '@/app/admin/data-table'
import type { UserListResponse } from '@/app/admin/schema'
import { useDebounce } from '@/hooks/useDebounce'
import { useFetch } from '@/hooks/useFetch'
import { userUrl } from '@/lib/urls'

const Page = () => {
  const { isLoading, data, fetcher } = useFetch<UserListResponse>()

  const [query, setQuery] = React.useState('')

  const searchTerm = useDebounce(query)

  useEffect(() => {
    fetcher(`${userUrl.userList}?q=${searchTerm}`)
  }, [searchTerm])

  return (
    <div className="p-4">
      <h3 className="p-2">Employees</h3>
      <div className="flex items-center justify-between">
        <Input
          classNames={{
            base: 'm-3 md:w-[45%] w-full',
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
      <DataTable columns={columns} data={data || []} isLoading={isLoading} />
    </div>
  )
}

export default Page
