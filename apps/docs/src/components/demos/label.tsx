import { Checkbox } from '@repo/ui/components/checkbox'
import { Label } from '@repo/ui/components/label'

const LabelDemo = () => {
  return (
    <div className='flex items-center space-x-2'>
      <Checkbox id='terms' />
      <Label htmlFor='terms'>Accept terms and conditions</Label>
    </div>
  )
}

export default LabelDemo
