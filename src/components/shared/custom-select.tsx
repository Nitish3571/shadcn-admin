import {
    Select as BaseSelect,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import * as React from 'react';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps
    extends React.ComponentPropsWithoutRef<typeof BaseSelect> {
    options: SelectOption[];
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
    (
        {
            className,
            options,
            placeholder = 'Select an option',
            disabled,
            ...props
        },
        ref
    ) => {
        return (
            <div>
                <BaseSelect disabled={disabled} {...props}>
                    <SelectTrigger
                        ref={ref}
                        className={cn(
                            'h-10 w-full min-w-[160px] rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground',
                            'focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background',
                            'disabled:cursor-not-allowed disabled:opacity-50 p-5',
                            className
                        )}
                    >
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent className="rounded-md border border-input bg-background text-foreground shadow-lg">
                        {options.map((option) => (
                            <SelectItem
                                key={option.value}
                                value={option.value}
                                className="cursor-pointer px-3 py-2 hover:bg-accent hover:text-accent-foreground"
                            >
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </BaseSelect>
            </div>
        );
    }
);

Select.displayName = 'Select';

export { Select, type SelectOption };

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
// import { Select, SelectOption } from "@/components/ui/select"

interface CustomSelectProps {
    name: string;
    label: string;
    placeholder?: string;
    disabled?: boolean;
    form: UseFormReturn; // Adjust type as needed, e.g., use `UseFormReturn` from react-hook-form
    options: SelectOption[];
}

const CustomSelect = ({
    name,
    label,
    placeholder = 'Select an option',
    disabled = false,
    form,
    options,
    ...props
}: CustomSelectProps) => (
    <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
            <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                    <Select
                        options={options}
                        placeholder={placeholder}
                        disabled={disabled}
                        value={field.value}
                        className="w-full"
                        onValueChange={field.onChange}
                        aria-required="true"
                        {...props}
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />
);

export default CustomSelect;
 