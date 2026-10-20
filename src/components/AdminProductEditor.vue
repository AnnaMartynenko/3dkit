<template>
  <div class="product-editor">
    <h3>{{ isNew ? 'Add product' : 'Edit product' }}</h3>
    <label>Title<input v-model="local.title" /></label>
    <label>Category<input v-model="local.category" /></label>
    <label>Price<input type="number" v-model.number="local.price" /></label>
    <div>
      <div v-if="local.image">
        <img :src="local.image" style="max-width:200px" />
      </div>
      <image-cropper @uploaded="onImageUploaded" />
    </div>
    <div>
      <button @click="$emit('save', local)">Save</button>
      <button v-if="!isNew" @click="$emit('delete', local.id)">Delete</button>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import ImageCropper from './ImageCropper.vue'

export default {
  props: { product: { type: Object, default: null } },
  components: { ImageCropper },
  setup(props) {
    const isNew = !props.product
    const local = reactive({
      id: props.product?.id || 'p' + Date.now(),
      title: props.product?.title || '',
      category: props.product?.category || '',
      price: props.product?.price || 0,
      image: props.product?.image || '',
    })

    function onImageUploaded({ url }) {
      local.image = url
    }

    return { ...toRefs(local), onImageUploaded, isNew, local }
  },
}
</script>

<style scoped>
.product-editor { border:1px solid #ddd; padding:12px; margin:8px 0 }
img { display:block; margin-top:8px }
</style>
