export default function (object, value) {
  for (let key in object) {
    if (object[key] === value) {
      return key
    }
  }
  return null // Trả về null nếu không tìm thấy giá trị
}
