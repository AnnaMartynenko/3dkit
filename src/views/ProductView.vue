<script setup>
defineProps({
  id: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <section class="page">
    <h1>Товар #{{ id }}</h1>
    <p>Тут буде детальна інформація про товар.</p>
  </section>
</template>

<style scoped>
.page {
  padding: 2rem;
}
</style>
