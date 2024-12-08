import React from 'react'
import { useFormContext } from 'react-hook-form'

import type { CommandInput } from '@/components/ui/command'
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from '@/components/ui/multi-select'
import { cn } from '@/lib/utils'

export interface MultiTagSelectFormProps extends React.ComponentPropsWithoutRef<typeof CommandInput> {
  name: string
  label: React.ReactNode
  options: ItemOption[]
  placeholder?: string
  description?: string
  containerClassName?: HTMLDivElement['className']
}

const MultiTagSelectForm = ({
  name,
  containerClassName = 'w-full',
  placeholder = 'Select options',
  options = [],
  label,
  description,
}: MultiTagSelectFormProps) => {
  const { control } = useFormContext()
  return (
    <div className={cn(containerClassName)}>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <MultiSelector onValuesChange={field.onChange} values={field.value}>
              <MultiSelectorTrigger>
                <MultiSelectorInput placeholder={placeholder} />
              </MultiSelectorTrigger>
              <MultiSelectorContent>
                <MultiSelectorList>
                  {options?.map((option) => (
                    <MultiSelectorItem key={option?.value || option?.name} value={option?.value}>
                      {option?.name}
                    </MultiSelectorItem>
                  ))}
                </MultiSelectorList>
              </MultiSelectorContent>
            </MultiSelector>
            <FormDescription>{description}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

export default MultiTagSelectForm
