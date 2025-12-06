import { PageHeader } from '@/components/shared/layout/page-header'
import PageLayout from '@/components/shared/layout/page-layout'
import { FilterConfig } from '@/components/shared/table/filter-toolbar'
import { GlobalTable } from '@/components/shared/table/global-table'
import GlobalFilterSection from '@/components/shared/table/global-table-filters'
import { useMemo, useState } from 'react'
import GlobalLoader from '@/components/shared/global-loader'
import { useRoleStore } from './store/role-store'
import { useGetRoles } from './services/roles.services'
import { generateDynamicColumns } from './components/roles.column'
import { MutateRoleModal } from './components/role-actions'
import { RoleDeleteModal } from './components/role-delete-modal'
import { usePermission } from '@/hooks/usePermission'
import { USER_STATUS_OPTIONS } from '@/types/enums'

export default function Users() {
  const [params, setParams] = useState({ page: 1, limit: 10, search: "" })
  const [status, setStatus] = useState<string | null>(null)

  const { setOpen } = useRoleStore();
  const { hasPermission } = usePermission();
  const { data: listData, isFetching: loading, error }: any = useGetRoles(params)

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
    { key: 'status', value: status, type: 'select', placeholder: 'Search by status...', options: USER_STATUS_OPTIONS, onChange: (value: string) => setStatus(value) },
  ]

  const handleRoleAdd = () => {
    setOpen("add");
  }

  if (loading) return <GlobalLoader variant="default" text="Loading Roles..." />
  if (error) return (
    <PageLayout>
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-500 font-semibold">Error loading roles</p>
          <p className="text-gray-600 mt-2">{error.message}</p>
        </div>
      </div>
    </PageLayout>
  )
  if (!listData?.data || listData.data.length === 0) return (
    <PageLayout>
      <PageHeader 
        title="Role List" 
        buttonLabel={hasPermission('roles.create') ? "Add Role" : undefined}
        description="Manage your the role here" 
        onButtonClick={hasPermission('roles.create') ? handleRoleAdd : undefined}
      />
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-gray-500 font-semibold">No roles found</p>
          <p className="text-gray-400 mt-2">Start by adding your first role</p>
        </div>
      </div>
      <MutateRoleModal />
    </PageLayout>
  )

  return (
    <PageLayout>
      <PageHeader 
        title="Role List" 
        buttonLabel={hasPermission('roles.create') ? "Add Role" : undefined}
        description="Manage your the role here" 
        onButtonClick={hasPermission('roles.create') ? handleRoleAdd : undefined}
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
      <MutateRoleModal />
      <RoleDeleteModal />
    </PageLayout>
  )
}
