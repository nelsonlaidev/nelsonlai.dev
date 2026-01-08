import { useFormattedDate } from '@/hooks/use-formatted-date'

type FormattedDateCellProps = {
  date: Date
}

function FormattedDateCell(props: FormattedDateCellProps) {
  const { date } = props

  const formattedDate = useFormattedDate(date, { formatName: 'long' })

  return formattedDate ?? '--'
}

export default FormattedDateCell
