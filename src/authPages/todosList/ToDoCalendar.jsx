
import React, { useState, useEffect } from 'react';
import {  FaClock, FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import './ToDoCalendar.css';
import { createTodo, deleteTodo, getCalendarTodos, updateTodo } from '../../apis/apis';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showToast } from '../../components/toast/Toast';


const ToDoCalendar = () => {


  const [selectedDate, setSelectedDate] = useState(new Date());
  const [todos, setTodos] = useState({});
  const [newTodo, setNewTodo] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('medium');
  const [notification, setNotification] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDateTodos, setSelectedDateTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    deadline: '',
    priority: '',
    notifications: true
  });

  // Fetch todos for the current month
  const fetchMonthTodos = async () => {
    try {
      setLoading(true);
      const month = selectedDate.getMonth() + 1; // JavaScript months are 0-based
      const year = selectedDate.getFullYear();
      const response = await getCalendarTodos(month, year);
      setTodos(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch todos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthTodos();
  }, [selectedDate]);

  const handleAddTodo = async () => {
    if (!newTodo.trim()) return;

    try {
      setLoading(true);
      const todoData = {
        title: newTodo,
        description: newTodo,
        deadline: deadline || null,
        priority,
        notifications: notification,
        category: 'general'
      };

      const response = await createTodo(todoData);

      // Update local state
      const dateKey = formatDate(selectedDate);
      setTodos(prev => ({
        ...prev,
        [dateKey]: [...(prev[dateKey] || []), response.data]
      }));

      // Reset form
      setNewTodo('');
      setDeadline('');
      setPriority('medium');
      setShowAddForm(false);
      setError(null);

      // Show success toast
      showToast({
        type: 'success',
        message: 'Task added successfully!',
        playSound: true
      });
    } catch (err) {
      setError('Failed to create todo');
      // Show error toast
      showToast({
        type: 'error',
        message: 'Failed to create task!',
        playSound: true
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTodo = async (todoId, completed) => {
    try {
      setLoading(true);
      await updateTodo(todoId, { completed: !completed });
      await fetchMonthTodos();
      setError(null);

      showToast({
        type: 'success',
        message: `Task ${!completed ? 'completed' : 'uncompleted'} successfully!`,
        playSound: true
      });
    } catch (err) {
      setError('Failed to update todo');
      showToast({
        type: 'error',
        message: 'Failed to update task!'
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTodo = async (todoId) => {
    try {
      setLoading(true);
      await deleteTodo(todoId);
      await fetchMonthTodos(); // Refresh todos
      setError(null);

      // Show success toast
      showToast({
        type: 'error',
        message: 'Task deleted successfully!',
        playSound: true
      });
    } catch (err) {
      setError('Failed to delete todo');
      // Show error toast
      showToast({
        type: 'error',
        message: 'Failed to delete task!',
        playSound: true
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getMonthlyTasks = () => {
    const allTasks = [];
    Object.values(todos).forEach(dayTasks => {
      if (Array.isArray(dayTasks)) {
        allTasks.push(...dayTasks);
      }
    });
    return allTasks;
  };
  // Add function to group tasks by priority
  const getTasksByPriority = () => {
    const monthlyTasks = getMonthlyTasks();
    return {
      high: monthlyTasks.filter(task => task.priority === 'high'),
      medium: monthlyTasks.filter(task => task.priority === 'medium'),
      low: monthlyTasks.filter(task => task.priority === 'low')
    };
  };

  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
    setEditFormData({
      title: todo.title,
      deadline: todo.deadline ? new Date(todo.deadline).toISOString().slice(0, 16) : '',
      priority: todo.priority,
      notifications: todo.notifications
    });
    setShowAddForm(false);

    // Add smooth scrolling
    setTimeout(() => {
      document.getElementById('edit-form').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };
  const handleUpdateTodo = async () => {
    try {
      setLoading(true);
      const updatedData = {
        title: editFormData.title,
        description: editFormData.title,
        deadline: editFormData.deadline || null,
        priority: editFormData.priority,
        notifications: editFormData.notifications
      };

      await updateTodo(editingTodo._id, updatedData);
      await fetchMonthTodos(); // Refresh todos
      setEditingTodo(null); // Close edit form
      setError(null);

      showToast({
        type: 'success',
        message: 'Task updated successfully!',
        playSound: true
      });
    } catch (err) {
      setError('Failed to update todo');
      showToast({
        type: 'error',
        message: 'Failed to update task!',
        playSound: true
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleTodoIndicatorClick = async (e, date) => {
    e.stopPropagation(); // Prevent calendar day click
    try {
      const day = date.getDate(); // Get the day number
      const tasksForSelectedDate = todos[day] || [];
      setSelectedDateTodos(tasksForSelectedDate);
    } catch (err) {
      setError('Failed to get todos for this date');
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedDate);
    const firstDay = getFirstDayOfMonth(selectedDate);
    const days = [];

    // Add empty days for the start of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Render each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
      const dateKey = formatDate(date);
      const todosForDay = todos[day] || [];
      const hasTodos = todosForDay.length > 0;
      const isSelected = dateKey === formatDate(selectedDate);
      const isToday = formatDate(new Date()) === dateKey;
      days.push(
        <div
          key={day}
          className={`calendar-day ${isSelected ? 'selected' : ''} ${hasTodos ? 'has-todos' : ''} ${isToday ? 'today' : ''}`}
          onClick={() => {
            const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
            setSelectedDate(newDate);
            setSelectedDateTodos(todosForDay); // Also update selected todos
          }}
        >
          <span className="day-number">{day}</span>
          {hasTodos && (
            <div className="todo-indicator-wrapper">
              <span
                className="todo-indicator"
                onClick={(e) => handleTodoIndicatorClick(e, date)}
              >
                {todosForDay.length}
              </span>
              <div className="todo-preview">
                {todosForDay.map((todo, index) => (
                  <div key={todo._id} className={`preview-item priority-${todo.priority}`}>
                    {todo.title}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <>
      <ToastContainer />
      {error && <div className="error-message">{error}</div>}
      <div className="todo-calendar-container">
        <div className="calendar-section">
          <div className="calendar-header">
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))}
              disabled={loading}
            >
              ←
            </button>
            <h2>{selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))}
              disabled={loading}
            >
              →
            </button>
          </div>
          <div className="calendar-grid">
            <div className="weekday">Sun</div>
            <div className="weekday">Mon</div>
            <div className="weekday">Tue</div>
            <div className="weekday">Wed</div>
            <div className="weekday">Thu</div>
            <div className="weekday">Fri</div>
            <div className="weekday">Sat</div>
            {renderCalendar()}
          </div>
        </div>

        <div className="todos-section">
          <div className="todos-header">
            <h3>Tasks for {selectedDate.toLocaleDateString()}</h3>
            <button
              className="add-todo-btn"
              onClick={() => setShowAddForm(!showAddForm)}
              disabled={loading}
            >
              <FaPlus /> Add Task
            </button>
          </div>

          {showAddForm && (
            <div className="add-todo-form">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Enter new task..."
                className="todo-input"
                disabled={loading}
              />
              <input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="deadline-input"
                disabled={loading}
              />
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="priority-select"
                disabled={loading}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <label className="notification-toggle">
                <input
                  type="checkbox"
                  checked={notification}
                  onChange={(e) => setNotification(e.target.checked)}
                  disabled={loading}
                />
                Enable Notifications
              </label>
              <button
                onClick={handleAddTodo}
                className="submit-todo-btn"
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Task'}
              </button>
            </div>
          )}
          {selectedDateTodos.length > 0 && (
            <div className="selected-date-todos">
              <h4>Selected Date Tasks</h4>
              <div className="selected-todos-list">
                {selectedDateTodos.map(todo => (
                  <div key={todo._id} className={`todo-item priority-${todo.priority}`}>
                    <div className="todo-content">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => handleToggleTodo(todo._id, todo.completed)}
                        disabled={loading}
                      />
                      <span className={todo.completed ? 'completed' : ''}>{todo.title}</span>
                    </div>
                    <div className="todo-info-actions">
                      {todo.deadline && (
                        <div className="todo-deadline">
                          <FaClock /> {new Date(todo.deadline).toLocaleString()}
                        </div>
                      )}
                      <div className="todo-actions">
                        <button
                          className="edit-btn"
                          onClick={() => handleEditTodo(todo)}
                          disabled={loading}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteTodo(todo._id)}
                          disabled={loading}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="monthly-overview-section">
            <div className="monthly-header">
              <h3>Monthly Overview</h3>
              <div className="task-stats">
                <span>Total Tasks: {getMonthlyTasks().length}</span>
                <span>Completed: {getMonthlyTasks().filter(task => task.completed).length}</span>
              </div>
            </div>

            <div className="tasks-by-priority">
              {Object.entries(getTasksByPriority()).map(([priority, tasks]) => (
                <div key={priority} className={`priority-group ${priority}`}>
                  <h4>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
                    <span className="task-count">({tasks.length})</span>
                  </h4>
                  <div className="priority-tasks">
                    {tasks.map(task => (
                      <div key={task._id} className="monthly-task-item">
                        <div className="task-title">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleToggleTodo(task._id, task.completed)}
                            disabled={loading}
                          />
                          <span className={task.completed ? 'completed' : ''}>
                            {task.title}
                          </span>
                        </div>
                        {task.deadline && (
                          <div className="task-deadline">
                            <FaClock />
                            {new Date(task.deadline).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {loading ? (
            <div className="loading-spinner">Loading...</div>
          ) : (
            <>{editingTodo && (
              <div id="edit-form" className="edit-todo-form">
                <div className="edit-form-header">
                  <h3>Edit Task</h3>
                  <span className="priority-badge">{editFormData.priority} Priority</span>
                </div>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  placeholder="Edit task..."
                  className="todo-input"
                  disabled={loading}
                />
                <input
                  type="datetime-local"
                  value={editFormData.deadline}
                  onChange={(e) => setEditFormData({ ...editFormData, deadline: e.target.value })}
                  className="deadline-input"
                  disabled={loading}
                />
                <select
                  value={editFormData.priority}
                  onChange={(e) => setEditFormData({ ...editFormData, priority: e.target.value })}
                  className="priority-select"
                  disabled={loading}
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                <label className="notification-toggle">
                  <input
                    type="checkbox"
                    checked={editFormData.notifications}
                    onChange={(e) => setEditFormData({ ...editFormData, notifications: e.target.checked })}
                    disabled={loading}
                  />
                  Enable Notifications
                </label>
                <div className="edit-form-actions">
                  <button
                    onClick={handleUpdateTodo}
                    className="submit-todo-btn"
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Update Task'}
                  </button>
                  <button
                    onClick={() => setEditingTodo(null)}
                    className="cancel-edit-btn"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
              <div className="todos-list">
                {todos[formatDate(selectedDate)]?.map(todo => (
                  <div key={todo._id} className={`todo-item priority-${todo.priority}`}>
                    <div className="todo-content">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => handleToggleTodo(todo._id, todo.completed)}
                        disabled={loading}
                      />
                      <span className={todo.completed ? 'completed' : ''}>{todo.title}</span>
                    </div>
                    <div className="todo-info-actions">
                      {todo.deadline && (
                        <div className="todo-deadline">
                          <FaClock /> {new Date(todo.deadline).toLocaleString()}
                        </div>
                      )}
                      <div className="todo-actions">
                        <button
                          className="edit-btn"
                          onClick={() => handleEditTodo(todo)}
                          disabled={loading}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteTodo(todo._id)}
                          disabled={loading}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ToDoCalendar;