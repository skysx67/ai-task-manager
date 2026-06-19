import psycopg2
import csv
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path='backend/.env')
from datetime import datetime

# Настройки подключения к БД из переменных окружения или по умолчанию
DB_HOST = os.environ.get("SQL_HOST", os.environ.get("DB_HOST", "localhost"))
DB_NAME = os.environ.get("SQL_DB_NAME", os.environ.get("DB_NAME", "task_manager"))
DB_USER = os.environ.get("SQL_USER", os.environ.get("DB_USER", "postgres"))
DB_PASSWORD = os.environ.get("SQL_PASSWORD", os.environ.get("DB_PASSWORD", "123"))
DB_PORT = os.environ.get("SQL_PORT", os.environ.get("DB_PORT", "5432"))

def export_tasks_to_csv():
    conn = None
    try:
        # Подключение к БД
        print(f"Подключение к базе данных {DB_NAME} на {DB_HOST}...")
        conn = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            port=DB_PORT
        )
        cursor = conn.cursor()

        # Выполняем выборку всех задач
        cursor.execute("SELECT id, title, description, status, created_at FROM tasks ORDER BY created_at DESC;")
        records = cursor.fetchall()
        
        if not records:
            print("В базе данных нет задач для экспорта.")
            return

        filename = "tasks_export.csv"
        
        # Сохранение в CSV
        with open(filename, mode='w', encoding='utf-8', newline='') as file:
            writer = csv.writer(file)
            # Заголовки
            writer.writerow(['ID', 'Title', 'Description', 'Status', 'Created At'])
            
            # Данные
            for row in records:
                writer.writerow(row)
                
        print(f"Экспорт успешно завершен! Сохранено {len(records)} задач в файл {filename}")

    except Exception as error:
        print(f"Ошибка при работе с PostgreSQL: {error}")
    finally:
        if conn is not None:
            conn.close()
            print("Соединение с PostgreSQL закрыто.")

if __name__ == "__main__":
    export_tasks_to_csv()
