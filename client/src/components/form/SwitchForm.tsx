import type * as SwitchPrimitives from '@radix-ui/react-switch'
import type { FC } from 'react'
import { useFormContext } from 'react-hook-form'

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

export interface SwitchFormProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  name: string
  label?: React.ReactNode
  description?: React.ReactNode
}

export const SwitchForm: FC<SwitchFormProps> = ({
  name = '',
  label = '',
  description = '',
  required,
  className,
  ...rest
}) => {
  const { control, formState, getFieldState } = useFormContext()

  const { error } = getFieldState(name, formState)

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full py-2">
          <div className="flex items-center align-middle">
            <div className="flex items-center">
              <FormControl>
                <Switch
                  {...field}
                  {...rest}
                  required={required}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className={cn(error?.message && 'border-destructive focus-visible:ring-destructive', className)}
                />
              </FormControl>
            </div>
            <FormLabel className="px-2">
              {label}
              {required ? '*' : ''}
            </FormLabel>
          </div>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
