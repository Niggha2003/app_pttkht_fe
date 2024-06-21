export default function getMonthDifference(date1, date2) {
  let maxDate
  let minDate
  if (date1 > date2) {
    maxDate = date1
    minDate = date2
  } else {
    maxDate = date2
    minDate = date1
  }
  const yearMin = minDate.getFullYear()
  const yearMax = maxDate.getFullYear()
  const monthMin = minDate.getMonth()
  const monthMax = maxDate.getMonth()

  return (yearMax - yearMin) * 12 + (monthMax - monthMin)
}
