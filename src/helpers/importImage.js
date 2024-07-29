export default function importImage(urlName, name) {
  var targetImg =
    import.meta.env.VITE_VUE_APP_SERVER_IMAGE_URL +
    urlName +
    '/' +
    name +
    `?t=${new Date().getTime()}`

  // trả về đường dẫn của hình ảnh
  return targetImg
}
