import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createTodo, modifyTodo, removeTodo, retrieveTodos } from '../api'; // Modified API function names

const Home = ({ isAuthenticated, token }) => {
  const [taskList, setTaskList] = useState([]);
  const [currentTask, setCurrentTask] = useState('');
  const [editingMode, setEditingMode] = useState(false);
  const [taskIndexToEdit, setTaskIndexToEdit] = useState(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [taskCategory, setTaskCategory] = useState('personal');

  const availableCategories = [
    { id: 'personal', label: 'Personal' },
    { id: 'work', label: 'Work' },
    { id: 'shopping', label: 'Shopping' },
    { id: 'health', label: 'Health & Fitness' },
    { id: 'study', label: 'Study' },
  ];

  useEffect(() => {
    if (isAuthenticated) {
      loadTasks();
    }
  }, [isAuthenticated, token]);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const tasks = await retrieveTodos(token);
      setTaskList(tasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (currentTask.trim() === '') return;
    try {
      const newTask = {
        title: currentTask,
        completed: false,
        category: taskCategory,
      };
      await createTodo(newTask, token);
      loadTasks();
      setCurrentTask('');
    } catch (error) {
      console.error('Error adding new task:', error);
    }
  };

  const toggleTaskStatus = async (taskId, isCompleted) => {
    try {
      await modifyTodo(taskId, { completed: !isCompleted }, token);
      loadTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const confirmDeleteTask = async () => {
    try {
      await removeTodo(taskList[taskIndexToEdit]._id, token);
      setTaskList((prevTasks) => prevTasks.filter((_, index) => index !== taskIndexToEdit));
      setDeleteDialogVisible(false);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const initiateEditTask = (index) => {
    setCurrentTask(taskList[index].title);
    setTaskIndexToEdit(index);
    setEditDialogVisible(true);
  };

  const saveTaskChanges = async () => {
    try {
      await modifyTodo(taskList[taskIndexToEdit]._id, { title: currentTask }, token);
      setTaskList((prevTasks) =>
        prevTasks.map((task, index) =>
          index === taskIndexToEdit ? { ...task, title: currentTask } : task
        )
      );
      setEditDialogVisible(false);
      setCurrentTask('');
      setTaskIndexToEdit(null);
    } catch (error) {
      console.error('Error saving task changes:', error);
    }
  };

  const styles = {
    title: {
      color: '#2c3e50',
      fontFamily: "'Poppins', sans-serif",
      fontWeight: '600',
      fontSize: '2.5rem',
      textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '2rem',
    },
    categoryTitle: {
      color: '#34495e',
      fontFamily: "'Poppins', sans-serif",
      fontWeight: '500',
      borderBottom: '2px solid #3498db',
      paddingBottom: '0.5rem',
      marginBottom: '1rem',
    },
    taskStyle: (isCompleted) => ({
      backgroundColor: isCompleted ? 'rgba(46, 213, 115, 0.1)' : '#ffffff',
      borderLeft: `4px solid ${isCompleted ? '#2ed573' : '#3498db'}`,
      marginBottom: '0.5rem',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      transition: 'all 0.3s ease',
    }),
    selectCategory: {
      width: 'auto',
      borderRadius: '4px',
      marginRight: '8px',
    },
    inputField: {
      borderRadius: '4px',
      border: '1px solid #ced4da',
    },
    addButtonStyle: {
      borderRadius: '4px',
      marginLeft: '8px',
    },
    buttonStyle: {
      borderRadius: '6px',
      padding: '0.4rem 1rem',
      fontWeight: '500',
    },
    authContainer: {
      backgroundColor: '#ffffff',
      borderRadius: '15px',
      padding: '3rem',
      boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
      textAlign: 'center',
      maxWidth: '600px',
      margin: '0 auto',
    },
    authTitle: {
      color: '#2c3e50',
      fontSize: '2rem',
      marginBottom: '1.5rem',
      fontWeight: '600',
    },
    authText: {
      color: '#7f8c8d',
      fontSize: '1.1rem',
      marginBottom: '2rem',
      lineHeight: '1.6',
    },
    dividerText: {
      color: '#95a5a6',
      margin: '0 15px',
      fontSize: '1.1rem',
    },
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center" style={styles.title}>✨ Manage Your Tasks</h1>

      {!isAuthenticated ? (
        <div className="container">
          <div style={styles.authContainer}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/1950/1950715.png"
              alt="Task Manager Icon"
              style={{ width: '100px', marginBottom: '1.5rem' }}
            />
            <h2 style={styles.authTitle}>Welcome to Your Task Manager</h2>
            <p style={styles.authText}>
              Organize your life and achieve your goals efficiently with our intuitive task manager. Log in or sign up to get started!
            </p>
            <div className="d-flex justify-content-center align-items-center">
              <a href="/login" className="btn btn-primary" style={styles.buttonStyle}>Login</a>
              <span style={styles.dividerText}>or</span>
              <a href="/register" className="btn btn-outline-primary" style={styles.buttonStyle}>Register</a>
            </div>
          </div>
        </div>
      ) : (
        // Authenticated User's Task List
        <div>
          <div className="input-group mb-3">
            <select
              className="form-select flex-grow-0"
              style={styles.selectCategory}
              value={taskCategory}
              onChange={(e) => setTaskCategory(e.target.value)}
            >
              {availableCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              className="form-control"
              placeholder="Enter a task..."
              value={currentTask}
              onChange={(e) => setCurrentTask(e.target.value)}
              style={styles.inputField}
            />
            <button className="btn btn-primary" style={styles.addButtonStyle} onClick={handleAddTask}>
              Add Task
            </button>
          </div>
          {isLoading ? (
            <div className="text-center p-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div>
              {availableCategories.map((category) => {
                const tasksInCategory = taskList.filter((task) => task.category === category.id);
                if (tasksInCategory.length === 0) return null;

                return (
                  <div key={category.id} className="mb-4">
                    <h5 style={styles.categoryTitle}>{category.label}</h5>
                    <ul className="list-group">
                      {tasksInCategory.map((task) => (
                        <li
                          key={task._id}
                          className="list-group-item d-flex justify-content-between align-items-center"
                          style={styles.taskStyle(task.completed)}
                        >
                          <div className="d-flex align-items-center">
                            <input
                              type="checkbox"
                              className="form-check-input me-3"
                              checked={task.completed}
                              onChange={() => toggleTaskStatus(task._id, task.completed)}
                            />
                            <span>{task.title}</span>
                          </div>
                          <div>
                            <button
                              className="btn btn-sm btn-outline-secondary me-2"
                              onClick={() => initiateEditTask(index)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => {
                                setDeleteDialogVisible(true);
                                setTaskIndexToEdit(index);
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
