import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DataTablePage } from '@/components/shared/table/data-table-page';
import { FilterConfig } from '@/components/shared/table/filter-toolbar';
import { useGetLoginHistory } from './services/login-history.services';
import { generateDynamicColumns } from './components/login-history.column';
import { LoginHistory } from './types/login-history.types';
import { ExportButton } from '@/components/shared/export-button';

export default function LoginHistoryPage() {
  const { t } = useTranslation();
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: '',
  });

  console.log('LoginHistoryPage - Params:', params);
  
  const queryResult = useGetLoginHistory(params);
  const { data: listData, isFetching: loading, error, isError, isSuccess } = queryResult;
  
  console.log('LoginHistoryPage - Query Result:', {
    data: listData,
    loading,
    error,
    isError,
    isSuccess,
    fullResult: queryResult
  });

  const handleSearchChange = (value: string) => {
    setParams((prev) => ({ ...prev, search: value, page: 1 }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setParams((prev) => ({ ...prev, limit: pageSize, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
  };

  const filters: FilterConfig[] = [
    {
      key: 'search',
      value: params.search,
      type: 'search',
      placeholder: t('search_by_ip_device_location'),
      onChange: handleSearchChange,
    },
  ];

  return (
    <DataTablePage<LoginHistory>
      title={t('login_history')}
      description={t('login_history_description')}
      data={listData}
      loading={loading}
      error={error}
      generateColumns={generateDynamicColumns}
      filters={filters}
      currentPage={params.page}
      pageSize={params.limit}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
      emptyTitle={t('no_login_history')}
      emptyDescription={t('login_history_empty_description')}
      loadingText={t('loading_login_history')}
      hasActiveFilters={!!params.search}
      headerActions={
        <ExportButton
          endpoint="login-history/export"
          filename="login-history"
          permission="login_history.export"
          params={{ search: params.search }}
        />
      }
    />
  );
}
