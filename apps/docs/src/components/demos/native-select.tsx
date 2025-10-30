import { NativeSelect, NativeSelectOption } from '@repo/ui/components/native-select'

const NativeSelectDemo = () => {
  return (
    <NativeSelect>
      <NativeSelectOption value=''>Select status</NativeSelectOption>
      <NativeSelectOption value='todo'>Todo</NativeSelectOption>
      <NativeSelectOption value='in-progress'>In Progress</NativeSelectOption>
      <NativeSelectOption value='done'>Done</NativeSelectOption>
      <NativeSelectOption value='cancelled'>Cancelled</NativeSelectOption>
    </NativeSelect>
  )
}

export default NativeSelectDemo
