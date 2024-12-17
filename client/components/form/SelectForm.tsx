'use client'

import type { SelectItemProps, SelectProps } from '@nextui-org/react'
import { Select, SelectItem } from '@nextui-org/react'
import { Controller, useFormContext } from 'react-hook-form'

import { cn } from '@/lib/utils'

export interface SelectFormProps extends SelectProps {
  name: string
  label: React.ReactNode
  options: ItemOption[]
  placeholder?: string
  noLabelText?: string
  description?: React.ReactNode
  isMultiple?: boolean
  containerClassName?: HTMLDivElement['className']
  selectItemProps?: SelectItemProps
  valueKey: keyof ItemOption
  displayNameKey: keyof ItemOption
}

export const SelectForm = ({
  containerClassName,
  name,
  label,
  description,
  selectItemProps,
  options = [],
  isLoading = false,
  isDisabled = false,
  isRequired = false,
  isMultiple = false,
  valueKey = 'value',
  displayNameKey = 'label',
  noLabelText = 'No Label',
  ...rest
}: SelectFormProps) => {
  const { control, getFieldState, formState } = useFormContext()

  const { error } = getFieldState(name, formState)

  return (
    <div className={cn(containerClassName)}>
      <Controller
        key={name}
        control={control}
        name={name}
        render={({ field: { value: selectedKey, onChange, ...restField } }) => {
          return (
            <Select
              key={`select_${name}`}
              aria-label="select-input"
              aria-labelledby="select"
              color={error?.message ? 'danger' : 'default'}
              description={description || ''}
              errorMessage={error?.message?.toString() || ''}
              isDisabled={isDisabled}
              isInvalid={!!error?.message?.toString() || undefined}
              isLoading={isLoading}
              isRequired={!!isRequired}
              items={options || []}
              label={label || ''}
              required={isRequired}
              selectedKeys={isMultiple ? selectedKey : selectedKey ? [selectedKey] : []}
              selectionMode={isMultiple ? 'multiple' : 'single'}
              onSelectionChange={(val) => {
                // For Single Selection
                const singleSelectVal = [...val][0] || ''

                isMultiple ? onChange([...val]) : onChange(singleSelectVal)
              }}
              {...restField}
              {...rest}
            >
              {(option: any) => (
                <SelectItem
                  {...selectItemProps}
                  key={option?.[valueKey]}
                  textValue={option?.[displayNameKey] || ''}
                  value={option?.[valueKey]}
                >
                  {option?.[displayNameKey] || noLabelText}
                </SelectItem>
              )}
            </Select>
          )
        }}
      />
    </div>
  )
}
