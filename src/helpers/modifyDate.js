export default function (dateString, time = false) {
  // Tạo một đối tượng Date từ chuỗi ngày tháng
  let date = new Date(dateString)

  // Lấy ngày, tháng và năm từ đối tượng Date
  let year = date.getFullYear()
  let month = String(date.getMonth() + 1).padStart(2, '0') // Tháng bắt đầu từ 0 nên cần cộng thêm 1 và định dạng lại chuỗi
  let day = String(date.getDate()).padStart(2, '0') // Định dạng lại chuỗi ngày
  let hour = String(date.getHours()).padStart(2, '0')
  let minute = String(date.getMinutes()).padStart(2, '0')
  // Tạo chuỗi ngày mới
  let newDateString = `${day}/${month}/${year}`

  if (time) {
    newDateString = `${newDateString} - ${hour}:${minute}`
  }
  return newDateString
}
