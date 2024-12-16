'use client'

import { Controller, useFormContext } from 'react-hook-form'

import { cn } from '@/lib/utils'
import { Checkbox, CheckboxGroup, CheckboxGroupProps as NextUICheckBoxGroup } from '@nextui-org/react'

export interface CheckBoxGroupProps extends NextUICheckBoxGroup {
  name: string
  label: React.ReactNode
  description?: React.ReactNode
  options: ItemOption[]
  valueKey: keyof ItemOption
  displayNameKey: keyof ItemOption
  containerClassName?: HTMLDivElement['className']
}

export const CheckboxGroupForm = ({
  containerClassName,
  name,
  label,
  options,
  isRequired,
  valueKey = 'value',
  displayNameKey = 'label',
  ...rest
}: CheckBoxGroupProps) => {
  const { control, getFieldState, formState } = useFormContext()
  const { error } = getFieldState(name, formState)

  return (
    <div className={cn(containerClassName)}>
      <Controller
        name={name}
        key={name}
        control={control}
        render={({ field: { value: checkBoxValue, onChange, ...restField } }) => {
          return (
            <CheckboxGroup
              label={label}
              value={checkBoxValue}
              onValueChange={(val) => {
                onChange(val)
              }}
              classNames={{
                wrapper: 'gap-4',
              }}
              isRequired={!!isRequired}
              isInvalid={!!error?.message}
              errorMessage={error?.message?.toString()}
              validationBehavior="native"
              {...restField}
              {...rest}
            >
              {Array.isArray(options) &&
                options.map((page, idx) => (
                  <Checkbox key={page?.[valueKey] || `option_${idx + 1}`} value={page?.[valueKey]?.toString() ?? ''}>
                    {page?.[displayNameKey] || 'NA'}
                  </Checkbox>
                ))}
            </CheckboxGroup>
          )
        }}
      />
    </div>
  )
}
