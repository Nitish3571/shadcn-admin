import { Edit, Eye, Trash } from 'lucide-react'
import { User } from '../types/user.types';
import { useUserStore } from '../store/user-store';

const UserListActions = ({ user }: { user: User }) => {
  const { setOpen, setCurrentRow } = useUserStore();
  
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
      <Eye onClick={handleUserView} className="h-4 w-4 cursor-pointer text-green-500 hover:text-green-600" />
      <Edit onClick={handleUserEdit} className="h-4 w-4 cursor-pointer text-blue-500 hover:text-blue-600" />
      <Trash onClick={handleUserDelete} className="h-4 w-4 cursor-pointer text-red-500 hover:text-red-600" />
    </div>
  )
}

export default UserListActions
