import CryptoJS from 'crypto-js'

export default function (string) {
  return CryptoJS.MD5(string).toString()
}
