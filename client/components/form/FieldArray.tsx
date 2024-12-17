'use client'

import type { FC } from 'react'

import SelectField from './SelectField'

interface FieldArrayProps {
  fields: any[]
}
const FieldArray: FC<FieldArrayProps> = ({ fields }) => {
  return (
    <>
      {fields.map((field) => {
        const { hide, ...rest } = field

        return !hide && <SelectField key={field?.name} {...rest} />
      })}
    </>
  )
}

export default FieldArray
