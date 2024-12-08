'use client'

import type * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import type { FC } from 'react'
import { useFormContext } from 'react-hook-form'

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'

export interface FormRadioGroupProps extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
  name: string
  label: React.ReactNode
  options: ItemOption[]
  containerClassName?: HTMLDivElement['className']
  radioItemProps?: React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
}

export const RadioGroupForm: FC<FormRadioGroupProps> = ({
  containerClassName = 'w-full',
  name,
  label,
  options = [],
  radioItemProps,
}) => {
  const { control } = useFormContext()

  return (
    <div className={cn(containerClassName)}>
      <FormField
        control={control}
        name={name}
        render={({ field: { value, onChange, ...restFields } }) => (
          <FormItem className="pb-2">
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={onChange} defaultValue={value} {...restFields}>
                <div className="flex flex-col gap-2 px-4">
                  {options.map((item, index) => (
                    <FormItem
                      key={item?.value || item?.name || `name-${index}`}
                      className="flex items-center space-x-3 space-y-0"
                    >
                      <FormControl>
                        <RadioGroupItem {...radioItemProps} value={item?.value} />
                      </FormControl>
                      <FormLabel className="font-normal">{item?.name}</FormLabel>
                    </FormItem>
                  ))}
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
