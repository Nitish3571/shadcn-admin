import { PageHeader } from '@/components/shared/layout/page-header'
import PageLayout from '@/components/shared/layout/page-layout'
import { FilterConfig } from '@/components/shared/table/filter-toolbar'
import { GlobalTable } from '@/components/shared/table/global-table'
import GlobalFilterSection from '@/components/shared/table/global-table-filters'
import { useState } from 'react'
import { columns } from './components/users-columns'
import UsersProvider from './context/users-context'
import { useGetUsers } from './services/user.hook'
import GlobalLoader from '@/components/shared/global-loader'

export default function Users() {
  const [params, setParams] = useState({ page: 1, limit: 10, search: "" })
  const [status, setStatus] = useState<string | null>(null)
  const { data: listData, isFetching: loading, error }: any = useGetUsers(params)
  if (loading) return <GlobalLoader variant='default' text='Loading Users ....' />
  if (error) return <div>Error: {error.message}</div>
  if (!listData) return <div>No data found</div>

  const handleSearchChange = (value: string) => {
    setParams((prev) => ({ ...prev, search: value }))
  }
  const handlePageSizeChange = (pageSize: number) => {
    setParams((prev) => ({ ...prev, limit: pageSize, page: 1 }))
  }
  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }))
  }

  const filters: FilterConfig[] = [
    { key: 'name', value: params.search, type: 'search', placeholder: 'Search by name...', onChange: handleSearchChange },
    { key: 'status', value: status, type: 'select', placeholder: 'Search by status...', options: [{ label: 'Active', value: '1' }, { label: 'Inactive', value: '2' }, { label: 'Invited', value: '3' }, { label: 'Suspended', value: '4' }], onChange: (value: string) => setStatus(value) },
  ]
  return (
    <UsersProvider>
      <PageLayout>
        <PageHeader title='User List' buttonLabel='Add User' description='Manage your the user here' onButtonClick={() => { }} />
        <GlobalFilterSection filters={filters} />
        <GlobalTable
          data={listData?.data}
          columns={columns}
          totalCount={listData?.total}
          currentPage={params.page}
          pageSize={params.limit}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          isPaginationEnabled={true}
          loading={loading}
        />
      </PageLayout>
      {/* <UsersDialogs /> */}
    </UsersProvider>
  )
}
