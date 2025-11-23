import { Edit, Eye, Trash } from 'lucide-react'
import { Role } from '../types/role.types';
import { useRoleStore } from '../store/role-store';

const RoleListActions = ({ role }: { role: Role }) => {
  const { setOpen, setCurrentRow } = useRoleStore();

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
      <Eye onClick={handleRoleView} className='h-4 w-4 cursor-pointer text-green-500 hover:text-green-600' />
      <Edit onClick={handleRoleEdit} className='h-4 w-4 cursor-pointer text-blue-500 hover:text-blue-600' />
      <Trash onClick={handleRoleDelete} className='h-4 w-4 cursor-pointer text-red-500 hover:text-red-600' />
    </div>
  )
}

export default RoleListActions
