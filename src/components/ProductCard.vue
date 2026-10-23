<script setup>
import { computed } from 'vue'
import { getCategory } from '../data/categories'
import useCart from '../stores/cart'

function formatPrice(p) {
  return p ? `${p} грн` : ''
}

const props = defineProps({
  product: { type: Object, required: true },
})

const { addToCart, cartItems } = useCart()
const inCart = computed(() => cartItems.value.some(i => i.id === props.product.id))
const category = computed(() => getCategory(props.product.category))
const discount = computed(() => {
  if (!props.product.oldPrice || props.product.oldPrice <= props.product.price) return null
  return Math.round((1 - props.product.price / props.product.oldPrice) * 100)
})
</script>

<template>
  <article class="product-card">
    <RouterLink :to="`/product/${product.id}`" class="card-media">
      <img :src="product.images[0]" :alt="product.title" loading="lazy" />
      <span v-if="!product.inStock" class="sold-out">Немає в наявності</span>
      <span v-else-if="discount" class="discount">−{{ discount }}%</span>
    </RouterLink>

    <div class="card-body">
      <span class="card-category">{{ category?.title }}</span>
      <h3 class="card-title">
        <RouterLink :to="`/product/${product.id}`">{{ product.title }}</RouterLink>
      </h3>

      <div class="card-footer">
        <div class="prices">
          <span class="price">{{ formatPrice(product.price) }}</span>
          <s v-if="product.oldPrice" class="old-price">{{ formatPrice(product.oldPrice) }}</s>
        </div>

        <button
          v-if="product.inStock"
          class="btn-ghost add-btn"
          :class="{ added: inCart }"
          type="button"
          :aria-label="`Додати «${product.title}» до кошика`"
          @click="addToCart(product)"
        >
          <svg v-if="inCart" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m5 12.5 4.5 4.5L19 7" />
          </svg>
          <svg v-else viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          {{ inCart ? 'У кошику' : 'Додати' }}
        </button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.product-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow);
}

.card-media {
  position: relative;
  display: block;
  aspect-ratio: 1 / 1;
  background: var(--surface-2);
  overflow: hidden;
}

.card-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease;
}

.product-card:hover .card-media img {
  transform: scale(1.04);
}

.sold-out,
.discount {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
}

.sold-out {
  background: rgba(32, 28, 23, 0.8);
  color: #fff;
}

.discount {
  background: var(--accent-2);
  color: #2b1600;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 1rem 1.1rem 1.15rem;
  flex: 1;
}

.card-category {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--muted);
}

.card-title {
  font-family: inherit;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.35;
  margin: 0;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: auto;
  padding-top: 0.9rem;
}

.prices {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.price {
  font-size: 1.05rem;
  font-weight: 700;
}

.old-price {
  font-size: 0.82rem;
  color: var(--muted);
}

.add-btn {
  padding: 0.45rem 0.85rem;
  font-size: 0.82rem;
  border-radius: 999px;
}

.add-btn.added {
  border-color: var(--sage);
  color: var(--sage);
}
</style>
