'use client'

import { useFormContext } from 'react-hook-form'

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

export interface SelectFormProps {
  name: string
  label: React.ReactNode
  options: ItemOption[]
  placeholder?: string
  description?: React.ReactNode
  containerClassName?: HTMLDivElement['className']
}

export const SelectForm = ({
  containerClassName,
  name,
  label,
  options = [],
  placeholder = 'Select',
  description,
}: SelectFormProps) => {
  const { control } = useFormContext()

  return (
    <div className={cn(containerClassName)}>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options?.map((option) => (
                  <SelectItem key={option?.value || option?.name} value={option?.value}>
                    {option?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>{description}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
