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
import { usePermission } from '@/hooks/usePermission'
import { USER_STATUS_OPTIONS } from '@/types/enums'

export default function Users() {
  const [params, setParams] = useState<{ page: number; limit: number; search: string; status?: string }>({ page: 1, limit: 10, search: "" })
  const [status, setStatus] = useState<string | null>(null)

  const { setOpen } = useUserStore();
  const { hasPermission } = usePermission();
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

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setParams((prev) => ({ ...prev, status: value, page: 1 }));
  }

  const filters: FilterConfig[] = [
    { key: 'name', value: params.search, type: 'search', placeholder: 'Search by name...', onChange: handleSearchChange },
    { key: 'status', value: status, type: 'select', placeholder: 'Search by status...', options: USER_STATUS_OPTIONS, onChange: handleStatusChange },
  ]

  const handleUserAdd = () => {
    setOpen("add");
  }

  if (loading) return <GlobalLoader variant="default" text="Loading Users..." />
  if (error) return (
    <PageLayout>
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-500 font-semibold">Error loading users</p>
          <p className="text-gray-600 mt-2">{error.message}</p>
        </div>
      </div>
    </PageLayout>
  )
  if (!listData?.data || listData.data.length === 0) return (
    <PageLayout>
      <PageHeader 
        title="User List" 
        buttonLabel={hasPermission('users.create') ? "Add User" : undefined}
        description="Manage your the user here" 
        onButtonClick={hasPermission('users.create') ? handleUserAdd : undefined}
      />
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-gray-500 font-semibold">No users found</p>
          <p className="text-gray-400 mt-2">Start by adding your first user</p>
        </div>
      </div>
      <MutateUserModal />
    </PageLayout>
  )

  return (
    <PageLayout>
      <PageHeader 
        title="User List" 
        buttonLabel={hasPermission('users.create') ? "Add User" : undefined}
        description="Manage your the user here" 
        onButtonClick={hasPermission('users.create') ? handleUserAdd : undefined}
      />
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
