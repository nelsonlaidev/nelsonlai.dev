import { Checkbox } from '@repo/ui/components/checkbox'
import { Label } from '@repo/ui/components/label'

const CheckboxDemo = () => {
  return (
    <div className='flex flex-col gap-6'>
      <div className='flex items-center gap-3'>
        <Checkbox id='terms' />
        <Label htmlFor='terms'>Accept terms and conditions</Label>
      </div>
      <div className='flex items-start gap-3'>
        <Checkbox id='terms-2' defaultChecked />
        <div className='grid gap-2'>
          <Label htmlFor='terms-2'>Accept terms and conditions</Label>
          <p className='text-sm text-muted-foreground'>
            By clicking this checkbox, you agree to the terms and conditions.
          </p>
        </div>
      </div>
      <div className='flex items-start gap-3'>
        <Checkbox id='toggle' disabled />
        <Label htmlFor='toggle'>Enable notifications</Label>
      </div>
      <Label className='flex items-start gap-3 rounded-lg border p-3 hover:bg-accent/50 has-aria-checked:border-blue-600 has-aria-checked:bg-blue-50 dark:has-aria-checked:border-blue-900 dark:has-aria-checked:bg-blue-950'>
        <Checkbox
          id='toggle-2'
          defaultChecked
          className='data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700'
        />
        <div className='grid gap-1.5 font-normal'>
          <p className='text-sm leading-none font-medium'>Enable notifications</p>
          <p className='text-sm text-muted-foreground'>You can enable or disable notifications at any time.</p>
        </div>
      </Label>
    </div>
  )
}

export default CheckboxDemo
