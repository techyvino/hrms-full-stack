// import type { ReactNode } from 'react'

// const formTypes = {
//   text: 'text',
//   email: 'email',
//   search: 'search',
//   url: 'url',
//   password: 'password',
//   tel: 'tel',
//   number: 'number',
//   checkbox: 'checkbox',
//   checkboxGroup: 'checkboxGroup',
//   radio: 'radio',
//   radioGroup: 'radioGroup',
//   normalSelect: 'normalSelect',
//   select: 'select',
//   textArea: 'textArea',
//   autoComplete: 'autoComplete',
//   switch: 'switch',
//   file: 'file',
//   date: 'date',
//   time: 'time',
//   datetime: 'datetime-local',
//   slider: 'slider',
//   selectTag: 'selectTag',
// }

// const SelectField: (props: fieldType) => ReactNode = (props) => {
//   const { type = 'text', ...exceptTypeProps } = props

//   switch (type) {
//     case formTypes.text:
//     case formTypes.email:
//     case formTypes.url:
//     case formTypes.password:
//     case formTypes.tel:
//     case formTypes.number:
//     case formTypes.file:
//     case formTypes.date:
//     case formTypes.time:
//     case formTypes.datetime:
//       return <CrInput {...(props as CrInputProps)} />
//     case formTypes.search:
//       return <CrInput {...(props as CrInputProps)} />
//     case formTypes.textArea:
//       return <CrTextArea {...exceptTypeProps} />
//     case formTypes.checkbox:
//       return <CrCheckBoxInput {...exceptTypeProps} />
//     case formTypes.radio:
//       return <CrRadioGroup {...(exceptTypeProps as CrRadioGroupProps)} />
//     case formTypes.radioGroup:
//       return <CrRadioGroup {...(exceptTypeProps as CrRadioGroupProps)} />
//     case formTypes.select:
//       return <CrSelectInput {...(exceptTypeProps as CrSelectProps)} />
//     case formTypes.autoComplete:
//       return <CrAutoComplete {...exceptTypeProps} />
//     case formTypes.switch:
//       return <CrSwitch {...exceptTypeProps} />
//     case formTypes.checkboxGroup:
//       return <CrCheckBoxGroup {...(exceptTypeProps as CrCheckBoxGroupProps)} />
//     default:
//       return <p className="text-danger">Invalid Field</p>
//   }
// }

// export default SelectField
