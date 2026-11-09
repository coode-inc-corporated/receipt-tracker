# Локальная разработка

Базовая инструкция на 9 ноября 2026 года. Команды выполняются из корня `receipt-tracker` в PowerShell. Значения секретов не приводятся.

## Окружение

- Node.js: `.nvmrc` указывает основную версию `26`. При использовании NVM for Windows установите и выберите доступную версию этой ветки.
- Пакетный менеджер — pnpm. Его версия пока не закреплена в `package.json`.
- Последние проверки в среде агента выполнялись с Node.js `24.22.1` и pnpm `11.25.0`. Это результат проверки, а не замена целевой версии из `.nvmrc`.
- Для локальной PostgreSQL нужны Docker и Docker Compose.
- Prettier и Oxlint уже указаны в зависимостях проекта.

Установка зависимостей:

```powershell
pnpm install
```

Основной `pnpm-lock.yaml` хранится в репозитории.

## Переменные окружения

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

Файлы `.env` и `*.local` игнорируются Git. Обычные `.env.development`, `.env.test` и `.env.production` могут попасть в репозиторий: не помещайте в них секреты.

## PostgreSQL

После настройки корневого `.env`:

```powershell
docker compose up -d
docker compose ps
docker compose exec postgres pg_isready -U receipt_tracker -d receipt_tracker
```

- Образ: `postgres:17`; контейнер: `receipt-tracker-postgres`.
- С Windows-хоста: `127.0.0.1:5433`; внутри контейнера: `5432`.
- Данные сохраняются в именованном volume `postgres_data`.
- TypeORM использует `synchronize: false`; миграции пока не настроены.

Изменение пароля в `.env` не меняет автоматически пароль в уже инициализированной БД. Не удаляйте volume для устранения проблем подключения: это удалит данные.

## Запуск

В двух отдельных терминалах:

```powershell
pnpm start:core
```

```powershell
pnpm start:telegram
```

Обе команды включают watch-режим. `pnpm start:dev` также запускает Core в watch-режиме.

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
