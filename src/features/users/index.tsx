import { PageHeader } from '@/components/shared/layout/page-header'
import PageLayout from '@/components/shared/layout/page-layout'
import { FilterConfig } from '@/components/shared/table/filter-toolbar'
import { GlobalTable } from '@/components/shared/table/global-table'
import GlobalFilterSection from '@/components/shared/table/global-table-filters'
import { useMemo, useState } from 'react'
import { useGetUsers } from './services/users.services'
import GlobalLoader from '@/components/shared/global-loader'
import { useUserStore } from './store/user-store'
import { MutateUserModal } from './components/user-actions'
import { generateDynamicColumns } from './components/users.column'
import { UserDeleteModal } from './components/user-delete-modal'

export default function Users() {
  const [params, setParams] = useState({ page: 1, limit: 10, search: "" })
  const [status, setStatus] = useState<string | null>(null)

  const { setOpen } = useUserStore();
  const { data: listData, isFetching: loading, error }: any = useGetUsers(params)

  // Generate dynamic columns based on API response
  const columns = useMemo(() => {
    if (listData?.datatable_column) {
      return generateDynamicColumns(listData.datatable_column);
    }
    if (listData?.column) {
      return generateDynamicColumns(listData.column);
    }
    return generateDynamicColumns();
  }, [listData?.datatable_column, listData?.column]);

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
    { key: 'status', value: status, type: 'select', placeholder: 'Search by status...', options: [
      { label: 'Active', value: '1' },
      { label: 'Inactive', value: '2' },
      { label: 'Invited', value: '3' },
      { label: 'Suspended', value: '4' }
    ], onChange: (value: string) => setStatus(value) },
  ]

  const handleUserAdd = () => {
    setOpen("add");
  }

  if (loading) return <GlobalLoader variant="default" text="Loading Users ...." />
  if (error) return <div>Error: {error.message}</div>
  if (!listData) return <div>No data found</div>

  return (
    <PageLayout>
      <PageHeader title="User List" buttonLabel="Add User" description="Manage your the user here" onButtonClick={handleUserAdd} />
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
      <MutateUserModal />
      <UserDeleteModal />
    </PageLayout>
  )
}
