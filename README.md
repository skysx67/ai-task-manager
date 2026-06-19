# Менеджер задач

Проект уровня Junior (Уровень 1). Полноценный Fullstack-менеджер задач с клиентом на React, бэкендом на Node.js (Express) с использованием PostgreSQL, а также автономным скриптом для выгрузки данных.

## Структура проекта

- `database/init.sql` — SQL-скрипт для создания таблицы в БД.
- `backend/server.js` — Точка входа Express, включает статические роуты для React.
- `backend/db.js` — Подключение к базе данных PostgreSQL.
- `backend/routes/` и `backend/controllers/` — Маршруты и логика CRUD для управления задачами.
- `backend/.env` - Конфигурация БД.
- `frontend/src/` — Исходный код Frontend-части (React + Tailwind CSS).
- `python/export_tasks.py` — Скрипт на Python 3 для экспорта задач.

---

## Шаг 1: Подготовка базы данных (PostgreSQL)

1. Убедитесь, что у вас установлен **PostgreSQL** и сервер работает.
2. Подключитесь к своей БД или создайте новую базу данных:
   ```bash
   createdb task_manager
   ```
3. Выполните скрипт инициализации таблицы:
   ```bash
   psql -d task_manager -f database/init.sql
   ```

---

## Шаг 2: Запуск Бэкенда и Фронтенда (Node.js + React)

В этом проекте настроен единый запуск — бэкенд на Express раздает статику React или использует Vite middleware в режиме разработки.

1. Установите все зависимости Node.js:
   ```bash
   npm install
   ```

2. Запустите проект в режиме разработчика (Frontend + Backend):
   ```bash
   npm run dev
   ```

3. Для сборки проекта выполните:
   ```bash
   npm run build
   npm run start
   ```

---

## Шаг 3: Запуск Python-скрипта (Экспорт в CSV)

Скрипт `python/export_tasks.py` подключается напрямую к вашей БД и выгружает все существующие задачи в таблице. Убедитесь, что у вас установлен Python версии 3.

1. Установите библиотеку `psycopg2-binary`:
   ```bash
   pip install psycopg2-binary
   ```
2. Запустите скрипт:
   ```bash
   python python/export_tasks.py
   ```
3. После успешного выполнения в корне вашего проекта появится файл `tasks_export.csv` с выгруженными данными, сохраненный в кодировке `utf-8`.

---

## REST API Эндпоинты

- `GET /tasks` - Получить список задач.
- `POST /tasks` - Создать новую задачу (`{ title: string, description: string }`).
- `PUT /tasks/:id` - Изменить статус задачи (`{ status: 'new' | 'in_progress' | 'done' }`).
- `DELETE /tasks/:id` - Удалить задачу.
