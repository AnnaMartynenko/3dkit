<script setup>
import useCart from '../stores/cart'
import useUser, { userState } from '../stores/user'
const { cartCount } = useCart()
const logo = new URL('../assets/logo.svg', import.meta.url).href
const u = useUser()
</script>

<template>
  <header class="site-header">
    <RouterLink to="/" class="logo">
      <img src="" :src="logo" alt="3Dkit" style="height:36px; object-fit:contain; margin-right:8px" />
      3Dkit
    </RouterLink>
    <nav class="nav">
      <RouterLink to="/">Головна</RouterLink>
      <RouterLink to="/catalog">Каталог</RouterLink>
      <RouterLink to="/cart">Кошик <span v-if="cartCount > 0">({{ cartCount }})</span></RouterLink>
      <RouterLink v-if="!userState.user" to="/auth">Увійти</RouterLink>
      <RouterLink v-else to="/profile">Кабінет</RouterLink>
      <RouterLink v-if="userState.user && userState.user.email === 'noparsley@gmail.com'" to="/admin">Admin</RouterLink>
      <a v-if="userState.user" href="#" @click.prevent="u.signOut">Вихід</a>
    </nav>
  </header>
</template>

<style scoped>
.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  border-bottom: 1px solid #e5e5e5;
}

.logo {
  font-weight: 700;
  text-decoration: none;
  color: inherit;
}

.nav {
  display: flex;
  gap: 1.5rem;
}

.nav a {
  text-decoration: none;
  color: inherit;
}

.nav a.router-link-active {
  font-weight: 600;
}
</style>
