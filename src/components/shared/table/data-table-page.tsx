import { ReactNode, useMemo, useRef, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { PageHeader } from '@/components/shared/layout/page-header';
import PageLayout from '@/components/shared/layout/page-layout';
import { FilterConfig } from '@/components/shared/table/filter-toolbar';
import { GlobalTable } from '@/components/shared/table/global-table';
import GlobalFilterSection from '@/components/shared/table/global-table-filters';
import GlobalLoader from '@/components/shared/global-loader';

interface DataTablePageProps<TData> {
  // Header props
  title: string;
  description?: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
  
  // Data props
  data: any;
  loading: boolean;
  error?: any;
  
  // Column generation
  generateColumns: (columnConfig?: any[]) => ColumnDef<TData>[];
  
  // Filter props
  filters?: FilterConfig[];
  
  // Pagination props
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  
  // Empty state
  emptyTitle?: string;
  emptyDescription?: string;
  hasActiveFilters?: boolean;
  
  // Loading text
  loadingText?: string;
  
  // Additional content (modals, etc.)
  children?: ReactNode;
}

export function DataTablePage<TData>({
  title,
  description,
  buttonLabel,
  onButtonClick,
  data: listData,
  loading,
  error,
  generateColumns,
  filters,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  emptyTitle = 'No data found',
  emptyDescription,
  hasActiveFilters = false,
  loadingText = 'Loading...',
  children,
}: DataTablePageProps<TData>) {
  // Track if we've ever loaded data to prevent full-page loader on subsequent loads
  const hasLoadedOnce = useRef(false);
  
  useEffect(() => {
    if (listData) {
      hasLoadedOnce.current = true;
    }
  }, [listData]);

  // Generate dynamic columns based on API response
  const columns = useMemo(() => {
    if (listData?.datatable_column) {
      return generateColumns(listData.datatable_column);
    }
    if (listData?.column) {
      return generateColumns(listData.column);
    }
    return generateColumns();
  }, [listData?.datatable_column, listData?.column, generateColumns]);

  // Show full-page loader only on true initial load (never loaded before)
  const isInitialLoad = loading && !hasLoadedOnce.current;
  
  if (isInitialLoad) {
    return <GlobalLoader text={loadingText} />;
  }
  
  if (error) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-red-500 font-semibold">Error loading data</p>
            <p className="text-gray-600 mt-2">{error.message}</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  const isEmpty = !listData?.data || listData.data.length === 0;
  const defaultEmptyDescription = hasActiveFilters 
    ? 'Try adjusting your filters' 
    : emptyDescription || 'Start by adding your first item';

  return (
    <PageLayout>
      <PageHeader 
        title={title}
        description={description}
        buttonLabel={buttonLabel}
        onButtonClick={onButtonClick}
      />
      
      {filters && filters.length > 0 && (
        <GlobalFilterSection filters={filters} />
      )}
      
      {/* Show empty state if no data and not loading */}
      {!loading && isEmpty ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-gray-500 font-semibold">{emptyTitle}</p>
            <p className="text-gray-400 mt-2">{defaultEmptyDescription}</p>
          </div>
        </div>
      ) : (
        <GlobalTable
          data={listData?.data || []}
          columns={columns}
          totalCount={listData?.total || 0}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          isPaginationEnabled={true}
          loading={loading}
        />
      )}
      
      {/* Additional content like modals */}
      {children}
    </PageLayout>
  );
}
