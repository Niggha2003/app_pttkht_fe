export default function (dateString) {
  // Tạo một đối tượng Date từ chuỗi ngày tháng
  let date = new Date(dateString)

  // Lấy ngày, tháng và năm từ đối tượng Date
  let year = date.getFullYear()
  let month = String(date.getMonth() + 1).padStart(2, '0') // Tháng bắt đầu từ 0 nên cần cộng thêm 1 và định dạng lại chuỗi
  let day = String(date.getDate()).padStart(2, '0') // Định dạng lại chuỗi ngày

  // Tạo chuỗi ngày mới
  let newDateString = `${day}-${month}-${year}`
  return newDateString
}
