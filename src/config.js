// Налаштування магазину. Це єдиний файл, який потрібно правити,
// щоб змінити назву, контакти чи посилання.
export const shop = {
  name: '3Dkit',
  tagline: 'Речі, надруковані на 3D-принтері, для всієї родини',
  domain: '3dkit.com.ua',

  // Instagram: вкажіть нік без @
  instagram: '3dkit.com.ua',
  telegram: 'com_ua_3dkit',
  email: 'campus.3dkit@gmail.com',
  phone: '+380509086507',

  // Куди надсилати замовлення (Instagram Direct або Telegram)
  orderChannel: 'instagram',

  delivery: [
    { id: 'nova-poshta', label: 'Нова Пошта — відділення або поштомат', price: null },
    { id: 'ukrposhta', label: 'Укрпошта — відділення', price: null },
    { id: 'nova-poshta-cod', label: 'Нова Пошта — накладений платіж', price: null },
    { id: 'pickup', label: 'Самовивіз — Київ, за домовленістю', price: 0 },
  ],

  payment: [
    { id: 'fop', label: 'На рахунок ФОП' },
    { id: 'cod', label: 'Накладений платіж при отриманні' },
  ],
}

export const socialLinks = [
  { id: 'instagram', label: 'Instagram', url: `https://instagram.com/${shop.instagram}` },
  { id: 'telegram', label: 'Telegram', url: `https://t.me/${shop.telegram}` },
  { id: 'phone', label: 'Телефон', url: `tel:${shop.phone.replace(/\s/g, '')}` },
]
