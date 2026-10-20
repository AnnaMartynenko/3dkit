<script setup>
import { ref } from 'vue'
import { cartItems, cartTotal, clearCart } from '../stores/cart'

const name = ref('')
const phone = ref('')
const address = ref('')

function placeOrder() {
  const order = {
    customer: { name: name.value, phone: phone.value, address: address.value },
    items: cartItems.value,
    total: cartTotal.value,
    createdAt: new Date().toISOString(),
  }
  // Для простоти — поки що просто лог і повідомлення користувачу
  console.log('Order placed', order)
  alert('Дякуємо! Ваше замовлення прийнято.')
  clearCart()
}
</script>

<template>
  <section class="page">
    <h1>Оформлення замовлення</h1>
    <div v-if="cartItems.length === 0">Ваш кошик порожній.</div>
    <div v-else>
      <label>Ім'я:<br/><input v-model="name" /></label>
      <label>Телефон:<br/><input v-model="phone" /></label>
      <label>Адреса:<br/><input v-model="address" /></label>
      <h3>Разом: {{ cartTotal }} грн</h3>
      <button @click="placeOrder">Підтвердити замовлення</button>
    </div>
  </section>
</template>

<style scoped>
.page { padding: 2rem }
input { display:block; margin-bottom:8px; padding:6px; width:100%; max-width:420px }
button { padding:8px 12px }
</style>
