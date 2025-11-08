import { Row } from '@tanstack/react-table'
import { Edit, Trash } from 'lucide-react'
import { useUsers } from '../context/users-context'
import { User } from '../data/schema'

interface DataTableRowActionsProps {
  row: Row<User>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useUsers()

  const handleEdit = () => {
    setCurrentRow(row.original)
    setOpen('edit')
  }

  const handleDelete = () => {
    setCurrentRow(row.original)
    setOpen('delete')
  }

  return (
    <div className='flex gap-2'>
      <Edit onClick={handleEdit}  className='cursor-pointer' size={20}/>
      <Trash onClick={handleDelete} className='cursor-pointer text-red-400' size={20}/>
    </div>
  )
}
