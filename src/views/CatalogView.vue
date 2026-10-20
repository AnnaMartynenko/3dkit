<script setup>
import { ref, computed } from 'vue'
import { products as initialProducts } from '../data/products'
import useCart from '../stores/cart'

const products = ref(initialProducts.map(p => ({ ...p })))
const categories = computed(() => [...new Set(products.value.map(p => p.category))])
const { addToCart } = useCart()

function updatePrice(product, value) {
  const v = Number(value)
  if (!Number.isNaN(v)) product.price = v
}
</script>

<template>
  <section class="page">
    <h1>Каталог товарів</h1>

    <div v-for="category in categories" :key="category" style="margin-bottom:2rem">
      <h2>{{ category }}</h2>
      <div class="grid">
        <div class="card" v-for="p in products.filter(x => x.category === category)" :key="p.id">
          <img :src="p.image" :alt="p.title" />
          <h3>{{ p.title }}</h3>
          <div class="price-row">
            <label>Ціна: </label>
            <input type="number" v-model.number="p.price" @change="updatePrice(p, p.price)" />
            <span>грн</span>
          </div>
          <button @click="addToCart(p, 1)">Додати в кошик</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.page { padding: 2rem }
.grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(220px,1fr)); gap:1rem }
.card { border:1px solid #e5e5e5; padding:1rem; border-radius:6px; display:flex; flex-direction:column; gap:0.5rem }
.card img { width:100%; height:160px; object-fit:cover; border-radius:4px }
.price-row { display:flex; align-items:center; gap:0.5rem }
input[type="number"] { width:90px }
button { margin-top:auto; padding:0.5rem; cursor:pointer }
</style>
