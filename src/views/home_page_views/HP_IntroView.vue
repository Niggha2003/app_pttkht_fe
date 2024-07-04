<script setup>
import HP_HeaderComponent from '@/components/home_page_components/HP_HeaderComponent.vue'
import HP_FooterComponent from '@/components/home_page_components/HP_FooterComponent.vue'
import { ref } from 'vue'
import Editor from 'primevue/editor'
import Quill from 'quill'
import ImageUploader from 'quill-image-uploader'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.bubble.css'

const value = ref('')

// Custom fonts
const fonts = ['Arial', 'Verdana']

// Register custom fonts with Quill
const Font = Quill.import('formats/font')
Font.whitelist = fonts
Quill.register(Font, true)
Quill.register('modules/imageUploader', ImageUploader)

const modules = {
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

        fetch('http://localhost:5000/api/upload_image/paragraph', {
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
</script>

<template>
  <HP_HeaderComponent :activeIndex="1"></HP_HeaderComponent>
  <div class="card">
    <Editor
      v-model="value"
      editorStyle="height: 320px, width: 50%"
      :modules="modules"
      :pt="{ toolbar: { style: 'display: none;' } }"
    />
  </div>
  {{ value }}
  <HP_FooterComponent></HP_FooterComponent>
</template>
