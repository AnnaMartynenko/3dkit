<template>
  <section class="page">
    <div class="container">
      <div class="page-head">
        <span class="eyebrow">Умови</span>
        <h1>Доставка та оплата</h1>
        <p>Підтверджуємо деталі замовлення в Instagram чи Telegram перед оплатою.</p>
      </div>

      <div class="grid">
        <article class="card">
          <h2>Доставка</h2>
          <ul class="list">
            <li><strong>Нова Пошта</strong> — до відділення або поштомату</li>
            <li><strong>Укрпошта</strong> — по Україні</li>
            <li><strong>Нова Пошта (накладений платіж)</strong></li>
            <li><strong>Самовивіз</strong> — м. Київ, за домовленістю</li>
          </ul>
        </article>

        <article class="card">
          <h2>Оплата</h2>
          <ul class="list">
            <li><strong>На рахунок ФОП</strong> — реквізити надамо після узгодження замовлення</li>
            <li><strong>Накладений платіж</strong> — при доставці Новою Поштою</li>
          </ul>
        </article>
      </div>

      <article class="card info">
        <h2>Як замовити</h2>
        <ol class="steps">
          <li>Додай товар до кошика та натисни «Оформити замовлення»</li>
          <li>Заповни контакти та обери спосіб доставки й оплати</li>
          <li>Надішли сформоване повідомлення в <a :href="`https://t.me/${shop.telegram}`" target="_blank" rel="noopener">Telegram</a> або <a :href="`https://instagram.com/${shop.instagram}`" target="_blank" rel="noopener">Instagram</a></li>
          <li>Ми підтвердимо наявність, колір та реквізити для оплати</li>
        </ol>
      </article>
    </div>
  </section>
</template>

<script setup>
import { shop } from '../config'
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.card {
  padding: 1.75rem;
}

h2 {
  font-size: 1.4rem;
  margin-bottom: 1rem;
}

.list,
.steps {
  display: grid;
  gap: 0.6rem;
  padding-left: 1.2rem;
}

.list li,
.steps li {
  line-height: 1.7;
}

.info {
  max-width: 880px;
}

@media (max-width: 820px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
