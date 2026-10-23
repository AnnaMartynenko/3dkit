<script setup>
import { shop } from '../config'

const faq = [
  {
    q: 'Скільки чекати замовлення?',
    a: 'Зазвичай 2–4 дні на друк і ще 1–2 дні на доставку Новою поштою. Якщо потрібно терміново — напиши, спробуємо прискорити.',
  },
  {
    q: 'Чи можна обрати інший колір?',
    a: 'Так. Ми друкуємо багатьма кольорами PLA. Напиши бажаний відтінок у коментарі до замовлення або в Instagram — надішлемо фото палітри.',
  },
  {
    q: 'Чи безпечні іграшки для дітей?',
    a: 'Ми використовуємо PLA рослинного походження, проєктуємо іграшки без гострих кутів і дрібних деталей, що від\'єднуються. Іграшки мають позначку віку, а дуже маленьким дітям рекомендуємо грати під наглядом дорослих.',
  },
  {
    q: 'Чи можна надрукувати щось на замовлення?',
    a: 'Так, якщо це не порушує авторських прав. Надішли ідею, ескіз або посилання на модель — порахуємо вартість.',
  },
]
</script>

<template>
  <section class="page">
    <div class="container">
      <div class="about-hero">
        <div>
          <span class="eyebrow">Про нас</span>
          <h1>Маленька майстерня з великою увагою до деталей</h1>
          <p class="muted">
            {{ shop.name }} — це домашня майстерня, де кожна річ друкується на 3D-принтері
            вручну. Ми віримо, що речі навколо мають бути не лише гарними, а й приємними на дотик.
          </p>
        </div>
        <div class="about-art" aria-hidden="true">
          <img src="/products/trafarety-tematychni-15x20/1.jpg" alt="" />
        </div>
      </div>

      <div class="values">
        <div class="value card">
          <span class="value-icon">🌱</span>
          <h2>Безпечні матеріали</h2>
          <p class="muted">PLA рослинного походження — для іграшок, трафаретів і прикрас. Без різкого запаху.</p>
        </div>
        <div class="value card">
          <span class="value-icon">🎨</span>
          <h2>Колір під тебе</h2>
          <p class="muted">Понад 20 відтінків. Можна змінити розмір або додати ім'я на виробі.</p>
        </div>
        <div class="value card">
          <span class="value-icon">📦</span>
          <h2>Дбайлива доставка</h2>
          <p class="muted">Пакуємо так, щоб нічого не пошкодилося. Нова пошта по всій Україні.</p>
        </div>
      </div>

      <div class="info-grid">
        <div>
          <h2>Як ми працюємо</h2>
          <ol class="steps">
            <li><strong>Ти обираєш</strong> річ у каталозі або пишеш нам із запитом.</li>
            <li><strong>Ми підтверджуємо</strong> колір, розмір і терміни.</li>
            <li><strong>Друкуємо</strong> та перевіряємо кожну деталь вручну.</li>
            <li><strong>Відправляємо</strong> Новою поштою або віддаємо особисто в Києві.</li>
          </ol>
        </div>

        <div>
          <h2>Часті питання</h2>
          <div class="faq">
            <details v-for="item in faq" :key="item.q" class="faq-item">
              <summary>{{ item.q }}</summary>
              <p class="muted">{{ item.a }}</p>
            </details>
          </div>
        </div>
      </div>

      <div class="contact-banner">
        <div>
          <h2>Є ідея або питання?</h2>
          <p class="muted">Напиши нам — відповідаємо протягом дня.</p>
        </div>
        <div class="contact-actions">
          <a :href="`https://instagram.com/${shop.instagram}`" target="_blank" rel="noopener" class="btn">
            Написати в Instagram
          </a>
          <a :href="`mailto:${shop.email}`" class="btn btn-secondary">{{ shop.email }}</a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-hero {
  display: grid;
  grid-template-columns: 1.3fr 0.7fr;
  gap: 2.5rem;
  align-items: center;
  margin-bottom: 3rem;
}

.about-hero p {
  max-width: 56ch;
  font-size: 1.02rem;
}

.about-art img {
  border-radius: var(--radius);
  border: 1px solid var(--line);
  transform: rotate(2deg);
}

.values {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-bottom: 3.5rem;
}

.value {
  padding: 1.5rem;
}

.value-icon {
  font-size: 1.6rem;
  display: block;
  margin-bottom: 0.65rem;
}

.value h2 {
  font-size: 1.15rem;
  margin-bottom: 0.35rem;
}

.value p {
  margin: 0;
  font-size: 0.9rem;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

.steps {
  display: grid;
  gap: 0.75rem;
  padding-left: 1.25rem;
  counter-reset: step;
  list-style: none;
}

.steps li {
  position: relative;
  padding-left: 0.5rem;
  color: var(--muted);
  font-size: 0.95rem;
}

.steps li::before {
  counter-increment: step;
  content: counter(step);
  position: absolute;
  left: -1.25rem;
  top: 0.1rem;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--accent-soft);
  color: var(--accent-dark);
  font-size: 0.72rem;
  font-weight: 700;
  display: grid;
  place-items: center;
}

.steps strong {
  color: var(--ink);
}

.faq {
  display: grid;
  gap: 0.5rem;
}

.faq-item {
  border-bottom: 1px solid var(--line);
  padding: 0.75rem 0;
}

.faq-item summary {
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  list-style: none;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.faq-item summary::-webkit-details-marker {
  display: none;
}

.faq-item summary::after {
  content: '+';
  color: var(--accent);
  font-size: 1.2rem;
  line-height: 1;
}

.faq-item[open] summary::after {
  content: '−';
}

.faq-item p {
  margin: 0.6rem 0 0;
  font-size: 0.9rem;
}

.contact-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
  margin-top: 3.5rem;
  padding: 2.25rem;
  border-radius: var(--radius);
  background: var(--accent-soft);
}

.contact-banner h2 {
  margin-bottom: 0.35rem;
  font-size: 1.5rem;
}

.contact-banner p {
  margin: 0;
  font-size: 0.92rem;
}

.contact-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

@media (max-width: 900px) {
  .about-hero {
    grid-template-columns: 1fr;
  }

  .about-art {
    max-width: 320px;
  }

  .values,
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
