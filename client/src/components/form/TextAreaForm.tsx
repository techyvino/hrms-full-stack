import type { FC } from 'react'
import { useFormContext } from 'react-hook-form'

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

export interface TextAreaFormProps extends React.ComponentProps<'textarea'> {
  name: string
  containerClassName?: HTMLDivElement['className']
  label?: React.ReactNode
  description?: React.ReactNode
}

export const TextAreaForm: FC<TextAreaFormProps> = ({
  containerClassName = 'w-full',
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
    <div className={cn(containerClassName)}>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {label}
              {required ? '*' : ''}
            </FormLabel>
            <FormControl>
              <Textarea
                {...field}
                {...rest}
                required={required}
                className={cn(error?.message && 'border-destructive focus-visible:ring-destructive', className)}
              />
            </FormControl>
            <FormDescription>{description}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
