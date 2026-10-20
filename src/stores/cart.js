import { reactive, computed } from 'vue'

const state = reactive({
  items: [],
})

function findItem(id) {
  return state.items.find(i => i.id === id)
}

export function addToCart(product, qty = 1) {
  const existing = findItem(product.id)
  if (existing) {
    existing.quantity += qty
  } else {
    state.items.push({ ...product, quantity: qty })
  }
}

export function removeFromCart(id) {
  const idx = state.items.findIndex(i => i.id === id)
  if (idx !== -1) state.items.splice(idx, 1)
}

export function clearCart() {
  state.items.splice(0, state.items.length)
}

export const cartItems = computed(() => state.items)

export const cartTotal = computed(() =>
  state.items.reduce((s, it) => s + (it.price || 0) * (it.quantity || 1), 0)
)

export const cartCount = computed(() =>
  state.items.reduce((s, it) => s + (it.quantity || 0), 0)
)

export default function useCart() {
  return {
    addToCart,
    removeFromCart,
    clearCart,
    cartItems,
    cartTotal,
    cartCount,
  }
}
