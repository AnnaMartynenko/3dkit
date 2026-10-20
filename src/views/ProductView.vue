<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { products } from '../data/products'
import useCart from '../stores/cart'

const route = useRoute()
const id = route.params.id
const product = computed(() => products.find(p => p.id === id) || null)
const { addToCart } = useCart()
</script>

<template>
  <section class="page" v-if="product">
    <h1>{{ product.title }}</h1>
    <img :src="product.image" :alt="product.title" style="max-width:400px; width:100%; height:auto; display:block; margin-bottom:1rem" />
    <p>Ціна: {{ product.price }} грн</p>
    <button @click="addToCart(product, 1)">Додати в кошик</button>
  </section>
  <section class="page" v-else>
    <h1>Товар не знайдено</h1>
  </section>
</template>

<style scoped>
.page { padding: 2rem }
</style>
