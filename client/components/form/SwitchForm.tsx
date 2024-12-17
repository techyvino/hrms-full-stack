import type { SwitchProps } from '@nextui-org/react'
import { Switch } from '@nextui-org/react'
import type { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { cn } from '@/lib/utils'

export interface SwitchFormProps extends SwitchProps {
  name: string
  label?: React.ReactNode
}

export const SwitchForm: FC<SwitchFormProps> = ({ name = '', label = '', className, ...rest }) => {
  const { control } = useFormContext()

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, ...restField } }) => {
        return (
          <Switch isSelected={value} {...rest} {...restField}>
            <span className={cn(className)}>{label || ''}</span>
          </Switch>
        )
      }}
    />
  )
}
