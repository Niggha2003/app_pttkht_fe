import { get } from '@/utils/httpRequest'

// type ở đây có thể là working, account
// lấy ra mã hiện tại và trả về mã mới sau mã hiện tại
export default async function (path, type) {
  const listResult = await get(path)
  console.log(listResult)
  if (listResult.length > 0) {
    const latestValue = listResult[listResult.length - 1]
    if (type == 'working') {
      const oldCode = latestValue.accountTraining.accountCode
      // do mã bắt đầu của tài khoản worker là hs
      const oldIndex = oldCode.split('hs')[1]

      // Chuyển chuỗi thành số nguyên
      let num = parseInt(oldIndex, 10)

      // Tăng số lên 1
      num += 1

      // Chuyển số ngược lại thành chuỗi
      let newIndex = num.toString()

      // Giữ nguyên độ dài bằng cách thêm các số 0 vào đầu nếu cần thiết
      while (newIndex.length < 3) {
        newIndex = '0' + newIndex
      }
      return 'hs' + newIndex
    }
    if (type == 'account') {
      const oldCode = latestValue.accountCode
      // do mã bắt đầu của tài khoản worker là hs
      const oldIndex = oldCode.split('nv')[1]

      // Chuyển chuỗi thành số nguyên
      let num = parseInt(oldIndex, 10)

      // Tăng số lên 1
      num += 1

      // Chuyển số ngược lại thành chuỗi
      let newIndex = num.toString()

      // Giữ nguyên độ dài bằng cách thêm các số 0 vào đầu nếu cần thiết
      while (newIndex.length < 3) {
        newIndex = '0' + newIndex
      }
      return 'nv' + newIndex
    }
  }
  return -1
}
