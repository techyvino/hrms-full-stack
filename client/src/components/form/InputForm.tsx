import type { FC } from 'react'
import React from 'react'
import { useFormContext } from 'react-hook-form'

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import type { InputProps } from '@/components/ui/input'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export interface InputFormProps extends InputProps {
  name: string
  containerClassName?: HTMLDivElement['className']
  label?: React.ReactNode
  description?: React.ReactNode
}

export const InputForm: FC<InputFormProps> = ({
  containerClassName = 'w-full',
  name = '',
  type = 'text',
  label = '',
  description = '',
  required,
  ...rest
}) => {
  const { control } = useFormContext()

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
              <Input {...field} {...rest} type={type} required={required} />
            </FormControl>
            <FormDescription>{description}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
