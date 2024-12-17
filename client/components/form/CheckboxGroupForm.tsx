'use client'

import type { CheckboxGroupProps as NextUICheckBoxGroup } from '@nextui-org/react'
import { Checkbox, CheckboxGroup } from '@nextui-org/react'
import { Controller, useFormContext } from 'react-hook-form'

import { cn } from '@/lib/utils'

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
        key={name}
        control={control}
        name={name}
        render={({ field: { value: checkBoxValue, onChange, ...restField } }) => {
          return (
            <CheckboxGroup
              classNames={{
                wrapper: 'gap-4',
              }}
              errorMessage={error?.message?.toString()}
              isInvalid={!!error?.message}
              isRequired={!!isRequired}
              label={label}
              validationBehavior="native"
              value={checkBoxValue}
              onValueChange={(val) => {
                onChange(val)
              }}
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
