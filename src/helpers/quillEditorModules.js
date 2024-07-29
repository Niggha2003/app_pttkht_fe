import Quill from 'quill'
import ImageUploader from 'quill-image-uploader'

// Custom fonts cho quill
const fonts = ['Arial', 'Verdana', 'Times', 'Courier']

// Register custom fonts cho Quill
const Font = Quill.import('formats/font')
Font.whitelist = fonts
Quill.register(Font, true)

// dùng cái này để khi upload ảnh chuyển src của ảnh về dạng url
Quill.register('modules/imageUploader', ImageUploader)

export default {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote', 'code-block'],
    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
    [{ direction: 'rtl' }], // text direction

    [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: fonts }],
    [{ align: [] }],

    ['link', 'image'], // link and image
    ['clean'] // remove formatting button
  ],
  imageUploader: {
    upload: async (file) => {
      return new Promise((resolve, reject) => {
        const formData = new FormData()
        formData.append('file', file)

        fetch(import.meta.env.VITE_VUE_APP_SERVER_URL + '/upload_image/paragraph', {
          method: 'POST',
          body: formData
        })
          .then((response) => response.json())
          .then((result) => {
            resolve(result.imageUrl)
          })
          .catch((error) => {
            reject('Upload failed')
            console.error('Error:', error)
          })
      })
    }
  }
}
