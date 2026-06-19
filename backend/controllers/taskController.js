import pool from '../db.js';

// Получение всех задач
export const getTasks = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка при получении задач:', error);
    res.status(500).json({ error: 'Ошибка сервера при получении задач' });
  }
};

// Создание задачи
export const createTask = async (req, res) => {
  const { title, description } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Поле title обязательно' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *',
      [title, description || '']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка при создании задачи:', error);
    res.status(500).json({ error: 'Ошибка сервера при создании задачи' });
  }
};

// Изменение статуса задачи
export const updateTaskStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const validStatuses = ['new', 'in_progress', 'done'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Неверный статус. Допустимые значения: new, in_progress, done' });
  }

  try {
    const result = await pool.query(
      'UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Задача не найдена' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка при обновлении задачи:', error);
    res.status(500).json({ error: 'Ошибка сервера при обновлении задачи' });
  }
};

// Удаление задачи
export const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Задача не найдена' });
    }
    
    res.json({ message: 'Задача успешно удалена', task: result.rows[0] });
  } catch (error) {
    console.error('Ошибка при удалении задачи:', error);
    res.status(500).json({ error: 'Ошибка сервера при удалении задачи' });
  }
};
