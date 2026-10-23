# 3Dkit — сайт майстерні 3D-друку

Вітрина та прийом замовлень для невеликої майстерні: іграшки, конструктори,
трафарети й сережки. Сайт статичний (Vue 3 + Vite), тому його можна хостити
будь-де — від домашнього комп'ютера до GitHub Pages.

## Швидкий старт

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # збирає сайт у теку dist/
```

## Що де лежить

| Файл | Навіщо |
| --- | --- |
| `src/config.js` | Назва магазину, Instagram, Telegram, пошта, способи доставки й оплати |
| `src/data/products.json` | **Усі товари.** Це єдине місце, яке треба правити для асортименту |
| `src/data/categories.js` | Категорії та їхні назви |
| `public/products/<id>/` | Фото товарів (по одній теці на товар) |
| `scripts/import-instagram.mjs` | Імпорт товарів з експорту Instagram |
| `docs/deploy.md` | Як опублікувати сайт на своєму сервері та підключити домен |
| `docs/social-posting.md` | Як постити відео в Instagram, Facebook, YouTube і TikTok з одного місця |

## Як додати товар вручну

1. Поклади фото у `public/products/mii-tovar/1.jpg` (можна 2–3 фото: `2.jpg`, `3.jpg`).
2. Додай об'єкт у масив `products` у `src/data/products.json`:

```json
{
  "id": "mii-tovar",
  "title": "Назва товару",
  "category": "toys",
  "price": 350,
  "oldPrice": null,
  "description": "Короткий опис у 2–3 речення.",
  "details": ["Матеріал: PLA", "Вік: 3+"],
  "images": ["/products/mii-tovar/1.jpg"],
  "tags": ["іграшка", "подарунок"],
  "inStock": true,
  "featured": false,
  "ageGroup": "3+",
  "source": { "platform": "manual" }
}
```

`id` — латиницею, без пробілів. `price: null` покаже «Ціна за запитом».
`featured: true` піднімає товар у блок «Найпопулярніше» на головній.

Категорії: `animation` (анімаційні іграшки), `stencils` (трафарети),
`keychains` (брелоки та антистрес), `earrings` (сережки), `other` (інше).

У трафаретів є підкатегорії: `spinner` (вертляві), `alphabet` (алфавіт),
`themed` (тематичні). Вони задаються полем `subcategory`.

## Імпорт товарів з Instagram

Скрипт читає офіційний експорт Instagram (не скрейпінг), витягує підписи,
ціни, хештеги та фото, і додає товари у `products.json`.

**Крок 1.** Експорт робиться не в налаштуваннях Instagram, а в **Accounts Center**:

1. Відкрий [accountscenter.instagram.com/info_and_permissions/dyi](https://accountscenter.instagram.com/info_and_permissions/dyi/) (або *Налаштування → Accounts Center → Your information and permissions*).
2. **Export your information** → **Create export**.
3. Обери профіль **Instagram** → **Next**.
4. **Export to device** → **Next**.
5. **Some of your information** → познач **Posts** (решту можна не чіпати).
6. Date range — **All time**, Format — **JSON**, Media quality — **Lower**.
7. **Start export**. Забирати архів у **Available downloads** (посилання діє 4 дні).

> **Якщо «Start export» неактивна** — найчастіше не вибрано спосіб сповіщення.
> У рядку **Notify** має бути вказана пошта (не «Please pick a delivery method»).
> Також перевір, що **Format = JSON**, а не HTML.

**Крок 2.** Розпакувати архів (вийде тека на кшталт `instagram-username-2026-10-22`).

**Крок 3.** Запустити з кореня проєкту:

```bash
npm run import:instagram -- ~/Downloads/instagram-username-2026-10-22
```

Спочатку можна подивитися, що буде імпортовано, нічого не змінюючи:

```bash
npm run import:instagram -- ~/Downloads/instagram-username-2026-10-22 --dry-run
```

Що робить скрипт:

- бере перше речення підпису як назву, решту — як опис;
- шукає ціну за шаблоном `350 грн` / `350₴` / `350 UAH`;
- визначає категорію за ключовими словами (можна потім виправити);
- копіює до 3 фото з каруселі у `public/products/`;
- **не перезаписує** наявні товари (для цього є `--force`);
- створює `instagram-import.csv` — зручно відкрити в Numbers/Excel і заповнити ціни.

Після імпорту обов'язково перевір `src/data/products.json`: ціни, категорії та
описи. Постійні посилання на оригінальні пости в експорті відсутні, тому поле
`source.permalink` буде порожнім — можна вставити вручну.

Якщо в пості лише відео, він буде пропущений (для нього немає фото).

## Публікація

Деплой уже налаштований через GitHub Actions: кожен пуш у `main` збирає сайт і
копіює `dist/` на сервер по SSH. Потрібні secrets: `SSH_HOST`, `SSH_USER`,
`SSH_PASSWORD`, `SSH_PATH`.

Покрокова інструкція, зокрема як підключити домен без білої IP-адреси —
у [docs/deploy.md](docs/deploy.md).

## Перед запуском продажів

- **ФОП**: для продажу фізичним особам зазвичай достатньо 3-ї групи; уточни в бухгалтера.
- **Оплата**: на старті — передоплата на картку або післяплата. LiqPay/Mono
  підключаються пізніше, коли з'явиться потік замовлень.
- **Іграшки для дітей**: діє Технічний регламент безпеки іграшок — вказуй вік,
  не використовуй дрібні деталі, що від'єднуються, для дітей до 3 років.
- **Сережки**: фурнітура має бути нікель-фрі, щоб не викликати подразнення.
- **Фото**: знімай на однотонному фоні при денному світлі — це найдешевший спосіб
  виглядати професійно.
