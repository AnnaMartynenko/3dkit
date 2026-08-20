<script setup></script>

<template>
  <header class="site-header">
    <RouterLink to="/" class="logo">Vue Shop</RouterLink>
    <nav class="nav">
      <RouterLink to="/">Головна</RouterLink>
      <RouterLink to="/catalog">Каталог</RouterLink>
      <RouterLink to="/cart">Кошик</RouterLink>
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
