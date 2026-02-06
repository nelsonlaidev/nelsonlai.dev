import { ChartBarIcon, ChartLineIcon, ChartPieIcon } from 'lucide-react'

import { Demo, DemoItem } from '../ui/demo'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

function SelectDemo() {
  return (
    <Demo title='Select'>
      <SelectBasic />
      <SelectSizes />
      <SelectWithIcons />
      <SelectWithGroups />
      <SelectItemAligned />
    </Demo>
  )
}

function SelectBasic() {
  const items = [
    { label: 'Select a fruit', value: null },
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Blueberry', value: 'blueberry' },
    { label: 'Grapes', value: 'grapes' },
    { label: 'Pineapple', value: 'pineapple' },
  ]
  return (
    <DemoItem title='Basic'>
      <Select items={items}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select items={items} disabled>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value} disabled>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select items={items}>
        <SelectTrigger aria-invalid>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </DemoItem>
  )
}

function SelectSizes() {
  const items = [
    { label: 'Select a fruit', value: null },
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Blueberry', value: 'blueberry' },
  ]

  return (
    <DemoItem title='Sizes'>
      <Select items={items}>
        <SelectTrigger size='sm'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select items={items}>
        <SelectTrigger size='default'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </DemoItem>
  )
}

function SelectWithIcons() {
  const items = [
    {
      label: (
        <div className='flex items-center gap-2'>
          <ChartLineIcon />
          Chart Type
        </div>
      ),
      value: null,
    },
    {
      label: (
        <div className='flex items-center gap-2'>
          <ChartLineIcon />
          Line
        </div>
      ),
      value: 'line',
    },
    {
      label: (
        <div className='flex items-center gap-2'>
          <ChartBarIcon />
          Bar
        </div>
      ),
      value: 'bar',
    },
    {
      label: (
        <div className='flex items-center gap-2'>
          <ChartPieIcon />
          Pie
        </div>
      ),
      value: 'pie',
    },
  ]
  return (
    <DemoItem title='With Icons'>
      <Select items={items}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </DemoItem>
  )
}

function SelectWithGroups() {
  const fruits = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Blueberry', value: 'blueberry' },
  ]
  const vegetables = [
    { label: 'Carrot', value: 'carrot' },
    { label: 'Broccoli', value: 'broccoli' },
    { label: 'Spinach', value: 'spinach' },
  ]
  const allItems = [{ label: 'Select a fruit', value: null }, ...fruits, ...vegetables]

  return (
    <DemoItem title='With Groups & Labels'>
      <Select items={allItems}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            {fruits.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Vegetables</SelectLabel>
            {vegetables.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </DemoItem>
  )
}

function SelectItemAligned() {
  const items = [
    { label: 'Select a fruit', value: null },
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Blueberry', value: 'blueberry' },
    { label: 'Grapes', value: 'grapes', disabled: true },
    { label: 'Pineapple', value: 'pineapple' },
  ]

  return (
    <DemoItem title='Item Aligned'>
      <Select items={items}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent alignItemWithTrigger>
          <SelectGroup>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value} disabled={item.disabled}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </DemoItem>
  )
}

export default SelectDemo
