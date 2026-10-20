<script setup>
import { cartItems, cartTotal, removeFromCart, addToCart } from '../stores/cart'
import { computed } from 'vue'

const items = cartItems
const total = cartTotal

function dec(item) {
  if (item.quantity > 1) addToCart(item, -1)
  else removeFromCart(item.id)
}

function inc(item) {
  addToCart(item, 1)
}
</script>

<template>
  <section class="page">
    <h1>Кошик</h1>
    <div v-if="items.length === 0">Кошик порожній.</div>
    <div v-else>
      <table>
        <tr v-for="it in items" :key="it.id">
          <td style="padding:8px">{{ it.title }}</td>
          <td style="padding:8px">{{ it.price }} грн</td>
          <td style="padding:8px">
            <button @click="dec(it)">-</button>
            {{ it.quantity }}
            <button @click="inc(it)">+</button>
          </td>
          <td style="padding:8px">{{ (it.price * it.quantity) }} грн</td>
          <td style="padding:8px"><button @click="removeFromCart(it.id)">Видалити</button></td>
        </tr>
      </table>
      <h3>Разом: {{ total }} грн</h3>
      <RouterLink to="/checkout"><button>Оформити замовлення</button></RouterLink>
    </div>
  </section>
</template>

<style scoped>
.page { padding: 2rem }
table { width:100%; border-collapse:collapse }
td { border-bottom:1px solid #eee }
button { padding:4px 8px }
</style>
