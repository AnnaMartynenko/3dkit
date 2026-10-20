<template>
  <div class="admin-page">
    <h2>Admin Dashboard</h2>
    <p v-if="!isAdmin">You are not authorized.</p>
    <div v-else>
      <button @click="addNew">Add New Product</button>
      <div v-for="p in products" :key="p.id">
        <admin-product-editor :product="p" @save="saveProduct" @delete="deleteProduct" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import AdminProductEditor from '../components/AdminProductEditor.vue'
import defaultProducts from '../data/products'
import useUser from '../stores/user'

export default {
  components: { AdminProductEditor },
  setup() {
    const u = useUser()
    const isAdmin = u.isAdmin()
    const products = ref([])

    function load() {
      const saved = localStorage.getItem('admin_products')
      products.value = saved ? JSON.parse(saved) : defaultProducts
    }

    function saveProduct(prod) {
      const idx = products.value.findIndex(p => p.id === prod.id)
      if (idx === -1) products.value.push(prod)
      else products.value.splice(idx, 1, prod)
      localStorage.setItem('admin_products', JSON.stringify(products.value))
      alert('Saved')
    }

    function deleteProduct(id) {
      const idx = products.value.findIndex(p => p.id === id)
      if (idx !== -1) products.value.splice(idx, 1)
      localStorage.setItem('admin_products', JSON.stringify(products.value))
    }

    function addNew() {
      products.value.push({ id: 'p' + Date.now(), category: '', title: '', price: 0, image: '' })
    }

    onMounted(load)

    return { isAdmin, products, saveProduct, deleteProduct, addNew }
  },
}
</script>

<style scoped>
.admin-page { max-width:900px; margin:20px auto }
</style>
