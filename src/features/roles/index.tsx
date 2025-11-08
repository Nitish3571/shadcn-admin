import { PageHeader } from '@/components/shared/layout/page-header'
import PageLayout from '@/components/shared/layout/page-layout'
import { columns } from './components/users-columns'
import { UsersDialogs } from './components/users-dialogs'
import { UsersTable } from './components/users-table'
import UsersProvider from './context/users-context'
import { useGetRole } from './services/role.hook'

export default function Roles() {
  // const { setOpen } = useUsers()
  const { data: listData, isLoading: loading, error }: any = useGetRole()
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!listData) return <div>No data found</div>

  return (
    <UsersProvider>
      <PageLayout>
        <PageHeader title='Role List' buttonLabel='Add Role' description='Manage your the role here' onButtonClick={() => { }} />
        <UsersTable data={listData?.data} columns={columns} />
      </PageLayout>
      <UsersDialogs />
    </UsersProvider>
  )
}
