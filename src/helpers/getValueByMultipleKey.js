export default function (obj, path) {
  const parts = path.split('.') // Tách chuỗi thành mảng ['hg', 'nk']
  let current = obj

  for (const part of parts) {
    current = current[part] // Truy cập từng cấp của đối tượng
    if (current === undefined) {
      return undefined // Nếu bất kỳ cấp nào không tồn tại, trả về undefined
    }
  }

  return current
}
