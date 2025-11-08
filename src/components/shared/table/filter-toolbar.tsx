import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

import useDebounce from "@/hooks/use-debounce";
import { Select } from "../custom-select";
import { Input } from "@/components/ui/input";


export type FilterType = "search" | "select" | "date"; // etc

export interface FilterConfig {
  type: FilterType;
  key: string;
  placeholder?: string;
  value?: string | DateRange | any;
  options?: Option[];
  onChange?: (value: any) => void;
}

interface DataTableToolbarProps {
  filters?: FilterConfig[];
  className?: string;
  searchValue?: string;
}

export interface Option {
  label: string;
  value: string;
}

interface DataTableToolbarProps {
  filters?: FilterConfig[];
  className?: string;
}

export function DataTableToolbarCompact({
  filters = [],
  className = "",
}: Readonly<DataTableToolbarProps>) {
  const searchFilter = filters.find((f) => f.type === "search");
  const [search, setSearch] = useState(searchFilter?.value ?? "");
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    if (searchFilter?.onChange) {
      searchFilter.onChange(debouncedSearch);
    }
  }, [debouncedSearch]);

  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      <div className="flex flex-1 items-center space-x-4">
        {filters.map((filter) => {
          if (filter.type === "search") {
            return (
              <Input
                key={filter.key}
                type="search"
                placeholder={filter.placeholder ?? "Search..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-[150px] lg:w-[350px]"
              />
            );
          }

          if (filter.type === "select") {
            return (
              <Select
                key={filter.key}
                options={filter.options ?? []}
                value={filter.value}
                placeholder={filter.placeholder}
                onValueChange={filter.onChange ?? (() => {})}
              />
            );
          }

          //   if (filter.type === "date") {
          //     return (
          //       <DateRangePicker
          //         key={filter.key}
          //         className="w-[300px]"
          //         selected={filter.value as DateRange | undefined}
          //         onChange={(range) => filter.onChange?.(range)}
          //       />
          //     );
          //   }

          return null;
        })}
      </div>
    </div>
  );
}
