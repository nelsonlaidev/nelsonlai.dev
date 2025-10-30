import { Button } from '@repo/ui/components/button'
import { Checkbox } from '@repo/ui/components/checkbox'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet
} from '@repo/ui/components/field'
import { Input } from '@repo/ui/components/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/components/select'
import { Textarea } from '@repo/ui/components/textarea'

const FieldDemo = () => {
  return (
    <div className='w-full max-w-md'>
      <form>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Payment Method</FieldLegend>
            <FieldDescription>All transactions are secure and encrypted</FieldDescription>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor='name'>Name on Card</FieldLabel>
                <Input id='name' placeholder='Evil Rabbit' required />
              </Field>
              <Field>
                <FieldLabel htmlFor='card-number'>Card Number</FieldLabel>
                <Input id='card-number' placeholder='1234 5678 9012 3456' required />
                <FieldDescription>Enter your 16-digit card number</FieldDescription>
              </Field>
              <div className='grid grid-cols-3 gap-4'>
                <Field>
                  <FieldLabel htmlFor='month'>Month</FieldLabel>
                  <Select defaultValue=''>
                    <SelectTrigger id='month'>
                      <SelectValue placeholder='MM' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='01'>01</SelectItem>
                      <SelectItem value='02'>02</SelectItem>
                      <SelectItem value='03'>03</SelectItem>
                      <SelectItem value='04'>04</SelectItem>
                      <SelectItem value='05'>05</SelectItem>
                      <SelectItem value='06'>06</SelectItem>
                      <SelectItem value='07'>07</SelectItem>
                      <SelectItem value='08'>08</SelectItem>
                      <SelectItem value='09'>09</SelectItem>
                      <SelectItem value='10'>10</SelectItem>
                      <SelectItem value='11'>11</SelectItem>
                      <SelectItem value='12'>12</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor='year'>Year</FieldLabel>
                  <Select defaultValue=''>
                    <SelectTrigger id='year'>
                      <SelectValue placeholder='YYYY' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='2024'>2024</SelectItem>
                      <SelectItem value='2025'>2025</SelectItem>
                      <SelectItem value='2026'>2026</SelectItem>
                      <SelectItem value='2027'>2027</SelectItem>
                      <SelectItem value='2028'>2028</SelectItem>
                      <SelectItem value='2029'>2029</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor='cvv'>CVV</FieldLabel>
                  <Input id='cvv' placeholder='123' required />
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>
          <FieldSeparator />
          <FieldSet>
            <FieldLegend>Billing Address</FieldLegend>
            <FieldDescription>The billing address associated with your payment method</FieldDescription>
            <FieldGroup>
              <Field orientation='horizontal'>
                <Checkbox id='same-as-shipping' defaultChecked />
                <FieldLabel htmlFor='same-as-shipping' className='font-normal'>
                  Same as shipping address
                </FieldLabel>
              </Field>
            </FieldGroup>
          </FieldSet>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor='optional-comments'>Comments</FieldLabel>
                <Textarea id='optional-comments' placeholder='Add any additional comments' className='resize-none' />
              </Field>
            </FieldGroup>
          </FieldSet>
          <Field orientation='horizontal'>
            <Button type='submit'>Submit</Button>
            <Button variant='outline' type='button'>
              Cancel
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}

export default FieldDemo
