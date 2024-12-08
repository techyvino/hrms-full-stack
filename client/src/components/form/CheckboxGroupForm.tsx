'use client'

import type * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { useFormContext } from 'react-hook-form'

import { Checkbox } from '@/components/ui/checkbox'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { cn } from '@/lib/utils'

export interface CheckBoxGroupProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  name: string
  label: React.ReactNode
  description?: React.ReactNode
  options: ItemOption[]
  containerClassName?: HTMLDivElement['className']
}

export const CheckboxGroupForm = ({ containerClassName, name, label, description, options }: CheckBoxGroupProps) => {
  const { control } = useFormContext()
  return (
    <div className={cn(containerClassName)}>
      <FormField
        control={control}
        name={name}
        render={() => (
          <FormItem className="pb-2">
            <FormLabel>{label}</FormLabel>
            <FormDescription>{description}</FormDescription>
            <div className="flex flex-col gap-2 px-4">
              {options?.map((item, index) => (
                <FormField
                  key={item?.value || item?.name || `${item?.name}-${index}`}
                  control={control}
                  name={name}
                  render={({ field: { value = [], onChange, ...restFields } }) => {
                    return (
                      <FormItem key={item?.value} className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={value?.includes(item?.value)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? onChange([...value, item.value])
                                : onChange(value?.filter((val: string) => val !== item.value))
                            }}
                            {...restFields}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">{item.name}</FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
