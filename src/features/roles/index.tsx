import { useState } from 'react'
import { FilterConfig } from '@/components/shared/table/filter-toolbar'
import { useRoleStore } from './store/role-store'
import { useGetRoles } from './services/roles.services'
import { generateDynamicColumns } from './components/roles.column'
import { MutateRoleModal } from './components/role-actions'
import { RoleDeleteModal } from './components/role-delete-modal'
import { usePermission } from '@/hooks/usePermission'
import { DataTablePage } from '@/components/shared/table/data-table-page'
import { Role } from './types/role.types'
import { ExportButton } from '@/components/shared/export-button'

export default function Roles() {
  const [params, setParams] = useState({ page: 1, limit: 10, search: "" })

  const { setOpen } = useRoleStore();
  const { hasPermission } = usePermission();
  const { data: listData, isFetching: loading, error }: any = useGetRoles(params)

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
    { 
      key: 'name', 
      value: params.search, 
      type: 'search', 
      placeholder: 'Search by name...', 
      onChange: handleSearchChange 
    },
  ]

  const handleRoleAdd = () => {
    setOpen("add");
  }

  return (
    <DataTablePage<Role>
      title="Role List"
      description="Manage your the role here"
      buttonLabel={hasPermission('roles.create') ? "Add Role" : undefined}
      onButtonClick={hasPermission('roles.create') ? handleRoleAdd : undefined}
      data={listData}
      loading={loading}
      error={error}
      generateColumns={generateDynamicColumns}
      filters={filters}
      currentPage={params.page}
      pageSize={params.limit}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
      emptyTitle="No roles found"
      emptyDescription="Start by adding your first role"
      hasActiveFilters={!!params.search}
      loadingText="Loading Roles..."
      headerActions={
        <ExportButton
          endpoint="roles/export"
          filename="roles"
          permission="roles.export"
          params={{ search: params.search }}
        />
      }
    >
      <MutateRoleModal />
      <RoleDeleteModal />
    </DataTablePage>
  )
}
