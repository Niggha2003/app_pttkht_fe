export default function importImage(urlName, name) {
  var targetImg = import.meta.env.VITE_VUE_APP_SERVER_IMAGE_URL + urlName + '/' + name

  // trả về hình ảnh của đường dẫn tới
  return targetImg
}
