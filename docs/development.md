# Локальная разработка

Базовая инструкция на 9 ноября 2026 года. Команды выполняются из корня `receipt-tracker` в PowerShell. Значения секретов не приводятся.

## Окружение

- Node.js: точная версия `26.13.0` закреплена в `.nvmrc`, `package.json` и Dockerfile обоих приложений.
- Пакетный менеджер — pnpm `12.18.0`. Версия закреплена в `package.json` и Dockerfile обоих приложений.
- Целевая версия Node.js — `26.13.0`; локальная среда, GitHub Actions и Docker используют одну версию.
- Для локальной PostgreSQL нужны Docker и Docker Compose.
- Prettier и Oxlint уже указаны в зависимостях проекта.

Установка зависимостей:

```powershell
pnpm install
```

Основной `pnpm-lock.yaml` хранится в репозитории.

## Переменные окружения

Скопируйте шаблоны (если локальные файлы уже существуют, сохраните их настройки):

```powershell
Copy-Item .env.example .env
Copy-Item apps/core/.env.example apps/core/.env.development.local
Copy-Item apps/telegram/.env.example apps/telegram/.env.development.local
```

Замените `replace_with_your_local_password` в корневом `.env` и `apps/core/.env.development.local` одним и тем же локальным паролем. Шаблоны содержат только примеры, реальные секреты в них не записывайте.

### Docker Compose

Создайте корневой `.env` и задайте `POSTGRES_PASSWORD` своим локальным значением. Compose использует эту переменную для контейнера PostgreSQL.

Корневой `.env` не является файлом конфигурации Core: приложение отдельно читает файлы из `apps/core/`.

### Core

Несекретные параметры в `apps/core/.env.development` должны соответствовать текущему Compose:

```dotenv
DB_HOST=127.0.0.1
DB_PORT=5433
DB_NAME=receipt_tracker
DB_USERNAME=receipt_tracker
```

В `apps/core/.env.development.local` задайте `DB_PASSWORD`, совпадающий с паролем PostgreSQL. Не записывайте пароль в коммитируемые примеры.

Порядок файлов Core, от более высокого приоритета к более низкому:

1. Путь из `ENV_FILE_PATH`, если задан.
2. `apps/core/.env.<NODE_ENV>.local`.
3. `apps/core/.env.<NODE_ENV>`.
4. `apps/core/.env`.

При отсутствии `NODE_ENV` для выбора файлов используется `development`. Уже заданные переменные процесса имеют приоритет над значениями файлов.

| Переменная        | Поведение                                                       |
| ----------------- | --------------------------------------------------------------- |
| `PORT`            | HTTP-порт Core, по умолчанию `3000`                             |
| `SWAGGER_ENABLED` | Строка `true` включает Swagger, `false` выключает               |
| `NODE_ENV`        | Выбор окружения; при `production` Swagger по умолчанию выключен |

Если `SWAGGER_ENABLED` не задана, Swagger включён во всех окружениях, кроме `production`.

### Telegram

Читает `apps/telegram/.env.<NODE_ENV>.local`, затем `apps/telegram/.env.<NODE_ENV>`. При отсутствии `NODE_ENV` выбирается `development`.

В `apps/telegram/.env.development` используется `PORT=3001`; это также порт по умолчанию. Переменные БД Telegram не нужны. Интеграция бота пока не реализована.

Telegram проверяет окружение через Zod: `PORT` преобразуется в целое число от `1` до `65535` (по умолчанию `3001`), `NODE_ENV` допускает `development`, `test`, `staging` и `production` (по умолчанию `development`). Некорректные значения останавливают запуск приложения.

Файлы `.env` и `.env.*` игнорируются Git во всех каталогах, кроме `.env.example`. Шаблоны `.env.example` сохраняются в репозитории; не помещайте в них секреты.

## PostgreSQL

После настройки корневого `.env`:

```powershell
docker compose up --wait postgres
docker compose ps
docker compose exec postgres pg_isready -U receipt_tracker -d receipt_tracker
```

- Образ: `postgres:17`; контейнер: `receipt-tracker-postgres`.
- С Windows-хоста: `127.0.0.1:5433`; внутри контейнера: `5432`.
- Данные сохраняются в именованном volume `postgres_data`.
- TypeORM использует `synchronize: false`; миграции пока не настроены.

Изменение пароля в `.env` не меняет автоматически пароль в уже инициализированной БД. Не удаляйте volume для устранения проблем подключения: это удалит данные.

## Запуск

Чтобы поднять PostgreSQL в Docker и запустить Core на компьютере в watch-режиме, откройте Docker Desktop и выполните:

```powershell
pnpm core:start:dev
```

`precore:start:dev` ждёт готовности PostgreSQL, затем `core:start:dev` через `cross-env` задаёт `NODE_ENV=development` и вызывает `pnpm start:core`. Если Core уже работает в контейнере, сначала выполните `docker compose stop core`, чтобы освободить порт 3000.

Команда `docker compose up --build` запускает PostgreSQL, Core и Telegram в контейнерах. HTTP-сервер Telegram доступен по адресу `http://localhost:3001/`. Compose передаёт ему `HOST=0.0.0.0`, а при локальном запуске используется `localhost`.

Для локального запуска Telegram в watch-режиме сначала остановите его контейнер командой `docker compose stop telegram`, если он работает. Затем в отдельном терминале выполните:

```powershell
pnpm start:telegram
```

`pnpm start:core` и `pnpm start:dev` запускают Core локально в watch-режиме и требуют уже работающий PostgreSQL. `pnpm start:telegram` запускает Telegram в watch-режиме.

При стандартных портах:

- Core: http://localhost:3000/
- Swagger Core: http://localhost:3000/api
- OpenAPI JSON: http://localhost:3000/api-json
- Telegram HTTP: http://localhost:3001/

Корневые маршруты пока возвращают `Hello World!`: они проверяют каркас, а не готовность обработки чеков.

В обоих приложениях включены shutdown hooks. Обычная остановка — `Ctrl+C`; принудительное завершение процесса на Windows может обходить обработчики закрытия.

## Сборка и проверки

```powershell
pnpm build:core
pnpm build:telegram
pnpm lint
pnpm test --runInBand
pnpm test:e2e --runInBand
```

Проверка типов без генерации файлов:

```powershell
pnpm exec tsc -p tsconfig.spec.json --noEmit --incremental false
```

## GitHub Actions

Workflow `.github/workflows/ci.yml` запускается для pull request и push в `main`. Он устанавливает pnpm через `pnpm/action-setup`, выбирает Node.js из `.nvmrc`, использует кэш pnpm и выполняет:

```powershell
pnpm install --frozen-lockfile
pnpm exec tsc -p tsconfig.spec.json --noEmit --incremental false
pnpm build:core
pnpm build:telegram
docker build --file apps/core/Dockerfile --tag receipt-tracker-core:ci .
docker build --file apps/telegram/Dockerfile --tag receipt-tracker-telegram:ci .
```

CI не запускает форматирование, линтер, модульные или e2e-тесты. Docker-образы только собираются для проверки и никуда не публикуются.

### Ручное развёртывание в test

После появления `.github/workflows/deploy.yml` в ветке по умолчанию откройте
**Actions → Deploy → Run workflow**, выберите ветку и сервис
(`core` или `telegram`). В выбранной ветке также должен быть этот workflow.

В GitHub Environment `test` задайте секреты `DOCKERHUB_TOKEN`,
`SSH_PRIVATE_KEY` и `SSH_KNOWN_HOSTS`, а также переменные
`DOCKERHUB_USERNAME`, `SSH_HOST` и `SSH_USER`. По умолчанию используются
SSH-порт `22`, каталог `/home/buho` и файл `docker-compose.production.yml`.
Их можно переопределить через `SSH_PORT`, `DEPLOY_PATH` и `COMPOSE_FILE`.

Workflow собирает образ выбранного сервиса из коммита на момент запуска и
публикует теги `sha-<SHA>` и `latest`. Серверный Compose должен ссылаться на
`<DOCKERHUB_USERNAME>/receipt-tracker-<service>:latest`. Для приватных образов
SSH-пользователю нужен уже настроенный доступ на чтение из Docker Hub.
Workflow скачивает образ, обновляет выбранный сервис вместе с необходимыми
зависимостями и выводит его состояние в лог.

### Ограничение Core e2e

Jest использует окружение `test`. Core e2e импортирует настоящий `AppModule` и требует параметры подключения и доступную PostgreSQL.

На момент подготовки документа `apps/core/.env.test` пустой. Без переданных извне DB-переменных Core e2e завершается с `Configuration key "DB_HOST" does not exist`. Настройка отдельной тестовой БД отложена; будущие тесты не должны изменять development-данные.

Последняя полная проверка e2e до настройки `initSetup`: Telegram проходил, Core останавливался на указанной ошибке. После добавления `initSetup` проверялись сборки, типы, линтер, модульные тесты и запуск; полный e2e повторно не выполнялся.

## Форматирование и локальные файлы

Проверка без изменений:

```powershell
pnpm exec prettier --check "apps/**/*.ts" "libs/**/*.ts"
```

`pnpm format` форматирует TypeScript в `apps/` и `libs/` с записью изменений. Не запускайте массовое форматирование вне соответствующей задачи.

Локальный `.vscode/settings.json` включает Prettier и Format On Save, но исключён из Git. У другого разработчика этот файл автоматически не появится; для VS Code требуется расширение Prettier.

Также исключены `node_modules`, `dist`, кэш `*.tsbuildinfo` и резервный `pnpm-lock.backup.yaml`. Основной `pnpm-lock.yaml` сохраняется в репозитории.

## Поддержка документации

Обновляйте этот документ при изменении команд, портов, переменных окружения и порядка запуска. Общие правила находятся в корневом `AGENTS.md`, архитектурные решения — в [architecture.md](architecture.md).
