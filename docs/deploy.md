# Публікація сайту на своєму сервері

Сайт статичний: після `npm run build` достатньо роздавати теку `dist/` через
nginx. У проєкті вже є GitHub Actions, який робить це автоматично.

## 1. Що має бути на сервері

- nginx (або Caddy) як веб-сервер;
- тека, куди GitHub Actions копіює файли, наприклад `/var/www/3dkit`;
- SSH-доступ з паролем (саме його використовує workflow).

Мінімальний конфіг nginx:

```nginx
server {
    listen 80;
    server_name 3dkit.ua www.3dkit.ua;

    root /var/www/3dkit;
    index index.html;

    # Важливо для Vue Router: будь-який шлях віддає index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Кешування зібраних файлів
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Фото товарів
    location /products/ {
        expires 30d;
        add_header Cache-Control "public";
    }
}
```

Без рядка `try_files ... /index.html` сторінка `/catalog` після перезавантаження
видасть 404 — це найчастіша помилка при деплої SPA.

## 2. Секрети GitHub Actions

У репозиторії: *Settings → Secrets and variables → Actions → New repository secret*.

| Secret | Приклад | Що це |
| --- | --- | --- |
| `SSH_HOST` | `192.168.1.50` або `server.example.com` | Адреса сервера |
| `SSH_USER` | `anna` | SSH-користувач |
| `SSH_PASSWORD` | `••••••` | Пароль (краще зробити окремого користувача) |
| `SSH_PATH` | `/var/www` | Тека, куди копіюється `dist` |

Workflow копіює теку `3dkit/` у `SSH_PATH`, тому сайт опиниться в
`/var/www/3dkit`. Переконайся, що nginx дивиться саме туди.

Пуш у `main` → сайт оновлюється. Якщо деплой не запускається, перевір, що ти на
гілці `main`, а не в detached HEAD.

## 3. Домен без білої IP-адреси (рекомендовано)

Домашній інтернет зазвичай не має постійної публічної IP, а провайдер може
блокувати порти 80/443. Cloudflare Tunnel вирішує обидві проблеми безкоштовно.

1. Додай домен у Cloudflare (безкоштовний тариф), зміни NS-сервери в реєстратора.
2. На сервері встанови `cloudflared`:

```bash
brew install cloudflared          # macOS
# або для Linux: див. https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/
```

3. Авторизуйся та створи тунель:

```bash
cloudflared tunnel login
cloudflared tunnel create 3dkit
```

4. Створи `~/.cloudflared/config.yml`:

```yaml
tunnel: 3dkit
credentials-file: /Users/<user>/.cloudflared/<tunnel-id>.json

ingress:
  - hostname: 3dkit.ua
    service: http://localhost:80
  - hostname: www.3dkit.ua
    service: http://localhost:80
  - service: http_status:404
```

5. Прив'яжи домен і запусти як службу:

```bash
cloudflared tunnel route dns 3dkit 3dkit.ua
cloudflared tunnel route dns 3dkit www.3dkit.ua
sudo cloudflared service install
```

HTTPS-сертифікат Cloudflare видасть автоматично.

## 4. Альтернатива: Caddy замість nginx

Caddy сам отримує сертифікати Let's Encrypt. Конфіг `Caddyfile`:

```
3dkit.ua, www.3dkit.ua {
    root * /var/www/3dkit
    encode gzip
    try_files {path} /index.html
    file_server
}
```

Для цього варіанта потрібні відкриті порти 80 і 443 та публічна IP-адреса.

## 5. Перевірка після деплою

- `https://3dkit.ua/` — головна;
- `https://3dkit.ua/catalog` — відкривається після перезавантаження (перевірка SPA);
- `https://3dkit.ua/product/flipbook-metelyk` — сторінка товару;
- фото з `/products/...` завантажуються;
- у консолі браузера немає помилок 404.
