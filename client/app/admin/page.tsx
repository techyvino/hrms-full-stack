'use client'
import { columns } from '@/app/admin/columns'
import { DataTable } from '@/app/admin/data-table'
import { UserListResponse } from '@/app/admin/schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/useDebounce'
import { useFetch } from '@/hooks/useFetch'
import { getDatesOfMonth } from '@/lib/date-utils'
import { userUrl } from '@/lib/urls'
import { Loader, SearchIcon } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect } from 'react'

const Page = () => {
  const { isLoading, response, fetcher } = useFetch<UserListResponse>()

  const [query, setQuery] = React.useState('')

  const searchTerm = useDebounce(query)

  useEffect(() => {
    fetcher(`${userUrl.userList}?q=${searchTerm}`)
  }, [searchTerm])

  const year = new Date().getFullYear()
  console.log('year:', year)
  const month = new Date().getMonth() + 1
  console.log('month:', month)

  console.log('getDatesOfMonth', getDatesOfMonth(2024, 12))

  return (
    <div className="p-4">
      <h3 className="p-2">Employees</h3>
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search with Name, Email and Mobile number..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          icon={<SearchIcon />}
          iconPosition="left"
          classNames={{
            base: 'my-3 w-[45%]',
          }}
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
