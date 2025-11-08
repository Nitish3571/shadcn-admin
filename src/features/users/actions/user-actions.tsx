import { Edit, Eye, Trash } from 'lucide-react'
import { User } from '../components/users.column';
import { useUserStore } from '../store/user-store';

const UserListActions = ({ user }: { user: User }) => {
  const {setOpen,currentRow,setCurrentRow}=useUserStore();
  const handleUserEdit = () => {
      console.log("object")
    setCurrentRow(user);
    setOpen("edit");
  }
  const handleUserDelete = () => {
    setCurrentRow(user);
    setOpen("delete");
  }
  return (
    <div className="flex items-center gap-1.5">
      <Edit onClick={handleUserEdit} className="h-4 w-4 cursor-pointer text-blue-500" />
      {/* <Eye className="h-4 w-4 cursor-pointer text-green-500 ml-2" /> */}
      <Trash onClick={handleUserDelete} className="h-4 w-4 cursor-pointer text-red-500 ml-2" />
    </div>
  )
}

export default UserListActions
