'use client'
import type * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { useFormContext } from 'react-hook-form'

import { Checkbox } from '@/components/ui/checkbox'
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { cn } from '@/lib/utils'

export interface CheckBoxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  name: string
  label: React.ReactNode
  description?: React.ReactNode
  containerClassName?: HTMLDivElement['className']
}

export const CheckboxForm = ({ containerClassName, name, label, description }: CheckBoxProps) => {
  const { control } = useFormContext()
  return (
    <div className={cn(containerClassName)}>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border p-4 shadow">
            <FormControl>
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>{label}</FormLabel>
              <FormDescription>{description}</FormDescription>
            </div>
          </FormItem>
        )}
      />
    </div>
  )
}
