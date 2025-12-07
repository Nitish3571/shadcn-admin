import { useState } from 'react';
import { FilterConfig } from '@/components/shared/table/filter-toolbar';
import { useGetActivityLogs } from './services/activity-logs.services';
import { generateDynamicColumns } from './components/activity-logs.column';
import { ActivityLogDetailModal } from './components/activity-log-detail-modal';
import { ActivityLogDeleteModal } from './components/activity-log-delete-modal';
import { DataTablePage } from '@/components/shared/table/data-table-page';
import { ActivityLog, LOG_NAME_OPTIONS, EVENT_OPTIONS } from './types/activity-log.types';
import { ExportButton } from '@/components/shared/export-button';

export default function ActivityLogs() {
  const [params, setParams] = useState<{
    page: number;
    limit: number;
    search: string;
    log_name?: string;
    event?: string;
  }>({
    page: 1,
    limit: 10,
    search: '',
  });
  const [logName, setLogName] = useState<string | null>(null);
  const [event, setEvent] = useState<string | null>(null);

  const { data: listData, isFetching: loading, error }: any = useGetActivityLogs(params);

  const handleSearchChange = (value: string) => {
    setParams((prev) => ({ ...prev, search: value, page: 1 }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setParams((prev) => ({ ...prev, limit: pageSize, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
  };

  const handleLogNameChange = (value: string) => {
    setLogName(value || null);
    setParams((prev) => {
      const newParams = { ...prev, page: 1 };
      if (value) {
        newParams.log_name = value;
      } else {
        delete newParams.log_name;
      }
      return newParams;
    });
  };

  const handleEventChange = (value: string) => {
    setEvent(value || null);
    setParams((prev) => {
      const newParams = { ...prev, page: 1 };
      if (value) {
        newParams.event = value;
      } else {
        delete newParams.event;
      }
      return newParams;
    });
  };

  const filters: FilterConfig[] = [
    {
      key: 'search',
      value: params.search,
      type: 'search',
      placeholder: 'Search activity logs...',
      onChange: handleSearchChange,
    },
    {
      key: 'log_name',
      value: logName,
      type: 'select',
      placeholder: 'Filter by type...',
      options: LOG_NAME_OPTIONS,
      onChange: handleLogNameChange,
    },
    {
      key: 'event',
      value: event,
      type: 'select',
      placeholder: 'Filter by event...',
      options: EVENT_OPTIONS,
      onChange: handleEventChange,
    },
  ];

  return (
    <DataTablePage<ActivityLog>
      title="Activity Logs"
      description="View and manage system activity logs"
      data={listData}
      loading={loading}
      error={error}
      generateColumns={generateDynamicColumns}
      filters={filters}
      currentPage={params.page}
      pageSize={params.limit}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
      emptyTitle="No activity logs found"
      emptyDescription="Activity logs will appear here as users interact with the system"
      hasActiveFilters={!!(params.search || params.log_name || params.event)}
      loadingText="Loading Activity Logs..."
      headerActions={
        <ExportButton
          endpoint="activity-logs/export"
          filename="activity_logs"
          permission="activity_logs.export"
          params={{ search: params.search, log_name: params.log_name, event: params.event }}
        />
      }
    >
      <ActivityLogDetailModal />
      <ActivityLogDeleteModal />
    </DataTablePage>
  );
}
