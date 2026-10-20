<template>
  <div class="profile-page">
    <h2>Кабінет користувача</h2>
    <div class="profile">
      <label>Прізвище<input v-model="profile.lastName" /></label>
      <label>Ім'я<input v-model="profile.firstName" /></label>
      <label>По батькові<input v-model="profile.middleName" /></label>
      <label>Телефон<input v-model="profile.phone" /></label>
      <label>Email<input v-model="profile.email" disabled /></label>
      <label>Адреса доставки<input v-model="profile.deliveryAddress" /></label>
      <label>Нова Пошта адреса<input v-model="profile.novaPoshtaAddress" /></label>
      <button @click="saveProfile">Save</button>
    </div>

    <section class="orders">
      <h3>Історія замовлень</h3>
      <div v-if="orders.length===0">No orders yet.</div>
      <ul>
        <li v-for="(o, idx) in orders" :key="idx">
          <strong>Order {{ idx + 1 }}</strong> — Status: {{ o.status }} — Total: {{ o.total }}
          <div v-if="o.items">Items: {{ o.items.length }}</div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from 'vue'
import useUser from '../stores/user'

export default {
  setup() {
    const u = useUser()
    const state = reactive({ profile: { ...u.userState.profile }, orders: [] })

    function saveProfile() {
      // In real app persist to backend. Here we save to localStorage per user.
      localStorage.setItem('profile_' + (u.userState.user?.uid || 'guest'), JSON.stringify(state.profile))
      alert('Profile saved locally')
    }

    onMounted(() => {
      const saved = localStorage.getItem('profile_' + (u.userState.user?.uid || 'guest'))
      if (saved) state.profile = JSON.parse(saved)
      u.loadOrders()
      state.orders = u.userState.orders
    })

    return { ...toRefs(state), saveProfile }
  },
}
</script>

<style scoped>
.profile { display:flex; flex-direction:column; max-width:600px }
.profile label { margin:6px 0 }
.orders { margin-top:20px }
</style>
