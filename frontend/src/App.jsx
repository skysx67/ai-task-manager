import React, { useState, useEffect } from 'react';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  // Получение всех задач
  const fetchTasks = async () => {
    try {
      const response = await fetch('/tasks');
      if (!response.ok) throw new Error('Ошибка при загрузке задач');
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Создание задачи
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Название задачи обязательно');
      return;
    }

    try {
      const response = await fetch('/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      if (!response.ok) throw new Error('Ошибка при создании задачи');
      
      setTitle('');
      setDescription('');
      setError('');
      fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  // Обновление статуса
  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error('Ошибка при обновлении статуса');
      fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  // Удаление задачи
  const handleDeleteTask = async (id) => {
    try {
      const response = await fetch(`/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Ошибка при удалении задачи');
      fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Менеджер задач</h1>
      
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleCreateTask} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Создать задачу</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Название *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
            placeholder="Что нужно сделать?"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Описание</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
            placeholder="Подробности задачи..."
            rows={3}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Создать
        </button>
      </form>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Список задач</h2>
        {tasks.length === 0 ? (
          <p className="text-gray-500">Задач пока нет. Создайте первую!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="p-3 border-b">ID</th>
                  <th className="p-3 border-b">Название</th>
                  <th className="p-3 border-b">Описание</th>
                  <th className="p-3 border-b">Дата</th>
                  <th className="p-3 border-b">Статус</th>
                  <th className="p-3 border-b text-right">Действия</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-gray-500">#{task.id}</td>
                    <td className="p-3 font-medium">{task.title}</td>
                    <td className="p-3 text-gray-600 max-w-xs truncate" title={task.description}>
                      {task.description || ( <span className="text-gray-400 italic">Нет описания</span> )}
                    </td>
                    <td className="p-3 text-gray-500 text-sm">
                      {new Date(task.created_at).toLocaleDateString("ru-RU")}
                    </td>
                    <td className="p-3">
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2 cursor-pointer"
                      >
                        <option value="new">Новая</option>
                        <option value="in_progress">В процессе</option>
                        <option value="done">Готово</option>
                      </select>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded transition-colors cursor-pointer"
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
