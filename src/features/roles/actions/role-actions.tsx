import { Edit, Eye, Trash } from 'lucide-react'
import { Role } from '../types/role.types';
import { useRoleStore } from '../store/role-store';
import { usePermission } from '@/hooks/usePermission';

const RoleListActions = ({ role }: { role: Role }) => {
  const { setOpen, setCurrentRow } = useRoleStore();
  const { hasPermission } = usePermission();

  const handleRoleEdit = () => {
    setCurrentRow(role);
    setOpen('edit');
  }

  const handleRoleView = () => {
    setCurrentRow(role);
    setOpen('view');
  }

  const handleRoleDelete = () => {
    setCurrentRow(role);
    setOpen('delete');
  }

  return (
    <div className='flex items-center gap-1.5'>
      {hasPermission('roles.view') && (
        <Eye onClick={handleRoleView} className='h-4 w-4 cursor-pointer text-green-500 hover:text-green-600' />
      )}
      {hasPermission('roles.edit') && (
        <Edit onClick={handleRoleEdit} className='h-4 w-4 cursor-pointer text-blue-500 hover:text-blue-600' />
      )}
      {hasPermission('roles.delete') && (
        <Trash onClick={handleRoleDelete} className='h-4 w-4 cursor-pointer text-red-500 hover:text-red-600' />
      )}
    </div>
  )
}

export default RoleListActions
