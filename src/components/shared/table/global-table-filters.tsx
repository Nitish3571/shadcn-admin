import { DataTableToolbarCompact, FilterConfig } from "./filter-toolbar";


const GlobalFilterSection = ({ filters }: { filters: FilterConfig[] }) => {
  return (
    <div className="">
      <DataTableToolbarCompact filters={filters} />
    </div>
  );
};

export default GlobalFilterSection;
