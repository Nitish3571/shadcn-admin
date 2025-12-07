import { useState } from 'react'
import { FilterConfig } from '@/components/shared/table/filter-toolbar'
import { useGetUsers } from './services/users.services'
import { useUserStore } from './store/user-store'
import { MutateUserModal } from './components/user-actions'
import { generateDynamicColumns } from './components/users.column'
import { UserDeleteModal } from './components/user-delete-modal'
import { usePermission } from '@/hooks/usePermission'
import { USER_STATUS_OPTIONS } from '@/types/enums'
import { DataTablePage } from '@/components/shared/table/data-table-page'
import { User } from './types/user.types'
import { ExportButton } from '@/components/shared/export-button'
import { useTranslation } from 'react-i18next'

export default function Users() {
  const { t } = useTranslation();
  const [params, setParams] = useState<{ page: number; limit: number; search: string; status?: string }>({ 
    page: 1, 
    limit: 10, 
    search: "" 
  })
  const [status, setStatus] = useState<string | null>(null)

  const { setOpen } = useUserStore();
  const { hasPermission } = usePermission();
  const { data: listData, isFetching: loading, error }: any = useGetUsers(params)

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
    { 
      key: 'name', 
      value: params.search, 
      type: 'search', 
      placeholder: t('search_by_name'), 
      onChange: handleSearchChange 
    },
    { 
      key: 'status', 
      value: status, 
      type: 'select', 
      placeholder: t('filter_by_status'), 
      options: USER_STATUS_OPTIONS, 
      onChange: handleStatusChange 
    },
  ]

  const handleUserAdd = () => {
    setOpen("add");
  }

  return (
    <DataTablePage<User>
      title={t('user_list')}
      description={t('manage_users')}
      buttonLabel={hasPermission('users.create') ? t('add_user') : undefined}
      onButtonClick={hasPermission('users.create') ? handleUserAdd : undefined}
      data={listData}
      loading={loading}
      error={error}
      generateColumns={generateDynamicColumns}
      filters={filters}
      currentPage={params.page}
      pageSize={params.limit}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
      emptyTitle={t('no_users_found')}
      emptyDescription={t('start_adding_users')}
      hasActiveFilters={!!(params.search || params.status)}
      loadingText={t('loading_users')}
      headerActions={
        <ExportButton
          endpoint="users/export"
          filename="users"
          permission="users.export"
          params={{ search: params.search, status: params.status }}
        />
      }
    >
      <MutateUserModal />
      <UserDeleteModal />
    </DataTablePage>
  )
}
