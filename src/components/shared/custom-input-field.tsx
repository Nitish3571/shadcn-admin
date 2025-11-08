import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

export interface TextInputFieldProps {
  control: any;
  name: string;
  label: string;
  placeholder: string;
  className?: string;
  type?: string;
  autoFocus?: boolean;
  disabled?: boolean;
}

export function TextInputField({
  control,
  name,
  label,
  placeholder,
  className,
  type = "text",
  autoFocus = false,
  disabled = false,
}: Readonly<TextInputFieldProps>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="text-right">{label}</FormLabel>
          <div>
            <FormControl>
              <Input
                type={type}
                placeholder={placeholder}
                className={`p-5 ${className}`}
                autoComplete="off"
                {...field}
                autoFocus={autoFocus}
                disabled={disabled}
              />
            </FormControl>
            <FormMessage className="col-start-3" />
          </div>
        </FormItem>
      )}
    />
  );
}
