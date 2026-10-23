export const categories = [
  {
    id: 'animation',
    title: 'Анімаційні іграшки',
    description: 'Фліпбуки, трауматропи й зоотропи, що оживають у руках',
    emoji: '🎞️',
  },
  {
    id: 'stencils',
    title: 'Трафарети',
    description: 'Для малювання на папері — вертляві, алфавітні та тематичні',
    emoji: '🎨',
    subcategories: [
      { id: 'spinner', title: 'Вертляві' },
      { id: 'alphabet', title: 'Алфавіт' },
      { id: 'themed', title: 'Тематичні' },
    ],
  },
  {
    id: 'boxes',
    title: 'Шкатулки та органайзери',
    description: 'Для зберігання прикрас і дрібниць',
    emoji: '📦',
  },
  {
    id: 'keychains',
    title: 'Брелоки та антистрес',
    description: 'Маленькі рятівники для ключів і нервів',
    emoji: '🔑',
  },
  {
    id: 'earrings',
    title: 'Сережки',
    description: 'Легкі прикраси ручної роботи на щодень',
    emoji: '✨',
  },
  {
    id: 'other',
    title: 'Інше',
    description: 'Авторські дрібниці та речі на замовлення',
    emoji: '🎁',
  },
]

export function getCategory(id) {
  return categories.find((category) => category.id === id) ?? null
}

export function getSubcategory(categoryId, subId) {
  const category = getCategory(categoryId)
  return category?.subcategories?.find((sub) => sub.id === subId) ?? null
}
