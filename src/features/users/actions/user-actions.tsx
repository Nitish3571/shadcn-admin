import { Edit, Eye, Trash } from 'lucide-react'
import { User } from '../types/user.types';
import { useUserStore } from '../store/user-store';
import { usePermission } from '@/hooks/usePermission';
import { useAuthStore } from '@/stores/authStore';

const UserListActions = ({ user }: { user: User }) => {
  const { setOpen, setCurrentRow } = useUserStore();
  const { hasPermission } = usePermission();
  const currentUser = useAuthStore((state) => state.userInfo);
  
  // Check if this is the current logged-in user
  const isCurrentUser = currentUser?.id === user.id;
  
  const handleUserEdit = () => {
    setCurrentRow(user);
    setOpen("edit");
  }
  
  const handleUserView = () => {
    setCurrentRow(user);
    setOpen("view");
  }
  
  const handleUserDelete = () => {
    setCurrentRow(user);
    setOpen("delete");
  }
  
  return (
    <div className="flex items-center gap-1.5">
      {hasPermission('users.view') && (
        <Eye onClick={handleUserView} className="h-4 w-4 cursor-pointer text-green-500 hover:text-green-600" />
      )}
      {hasPermission('users.edit') && (
        <Edit onClick={handleUserEdit} className="h-4 w-4 cursor-pointer text-blue-500 hover:text-blue-600" />
      )}
      {/* Don't show delete button for current user */}
      {hasPermission('users.delete') && !isCurrentUser && (
        <Trash onClick={handleUserDelete} className="h-4 w-4 cursor-pointer text-red-500 hover:text-red-600" />
      )}
    </div>
  )
}

export default UserListActions
