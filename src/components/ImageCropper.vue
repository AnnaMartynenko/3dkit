<template>
  <div>
    <input type="file" accept="image/*" @change="onFile" />
    <div v-if="dataUrl" style="max-width:400px">
      <img ref="imgRef" :src="dataUrl" style="max-width:100%" />
    </div>
    <div v-if="dataUrl">
      <button @click="crop">Crop & Upload</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'

export default {
  emits: ['uploaded'],
  setup(_, { emit }) {
    const imgRef = ref(null)
    let cropper = null
    const dataUrl = ref(null)

    function onFile(e) {
      const f = e.target.files[0]
      if (!f) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        dataUrl.value = ev.target.result
        // init cropper on next tick
        setTimeout(() => initCropper(), 50)
      }
      reader.readAsDataURL(f)
    }

    function initCropper() {
      if (cropper) cropper.destroy()
      cropper = new Cropper(imgRef.value, { aspectRatio: 1, viewMode: 1 })
    }

    function crop() {
      if (!cropper) return
      const canvas = cropper.getCroppedCanvas({ width: 800, height: 800 })
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob)
        emit('uploaded', { blob, url })
      }, 'image/jpeg', 0.9)
    }

    onMounted(() => {})

    return { imgRef, dataUrl, onFile, crop }
  },
}
</script>
