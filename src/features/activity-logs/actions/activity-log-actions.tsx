import { Eye, Trash } from 'lucide-react';
import { ActivityLog } from '../types/activity-log.types';
import { useActivityLogStore } from '../store/activity-log-store';
import { usePermission } from '@/hooks/usePermission';

const ActivityLogActions = ({ log }: { log: ActivityLog }) => {
  const { setOpen, setCurrentRow } = useActivityLogStore();
  const { hasPermission } = usePermission();

  const handleView = () => {
    setCurrentRow(log);
    setOpen('view');
  };

  const handleDelete = () => {
    setCurrentRow(log);
    setOpen('delete');
  };

  return (
    <div className="flex items-center gap-1.5">
      <Eye
        onClick={handleView}
        className="h-4 w-4 cursor-pointer text-green-500 hover:text-green-600"
      />
      {hasPermission('activity_logs.delete') && (
        <Trash
          onClick={handleDelete}
          className="h-4 w-4 cursor-pointer text-red-500 hover:text-red-600"
        />
      )}
    </div>
  );
};

export default ActivityLogActions;
