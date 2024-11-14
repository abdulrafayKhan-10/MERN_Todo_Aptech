import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { addTodo, updateTodo, deleteTodo, fetchTodos } from '../api'; // import API functions

const Home = ({ isAuthenticated, token }) => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [updateTaskIndex, setUpdateTaskIndex] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('personal'); // Add new state for category

  // Static categories
  const categories = [
    { id: 'personal', label: 'Personal' },
    { id: 'work', label: 'Work' },
    { id: 'shopping', label: 'Shopping' },
    { id: 'health', label: 'Health & Fitness' },
    { id: 'study', label: 'Study' }
  ];

  // Add useEffect to fetch tasks when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated, token]);

  // Fetch tasks from the backend when the component mounts
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await fetchTodos(token);
      console.log('Fetched tasks:', data);
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to add a new task
  const addTask = async () => {
    if (task.trim() === '') return;
    try {
      console.log('Adding task with data:', { 
        title: task,
        completed: false,
        category: category
      }); // Debug log
      
      const response = await addTodo({ 
        title: task,
        completed: false,
        category: category
      }, token);
      
      console.log('Response from addTodo:', response); // Debug log
      await fetchTasks();
      setTask('');
    } catch (error) {
      console.error('Error in addTask:', error); // Debug log
    }
  };

  // Function to toggle the completed status of a task
  const toggleTaskCompletion = async (taskId, currentCompleted) => {
    try {
      await updateTodo(taskId, { completed: !currentCompleted }, token);
      await fetchTasks(); // Refresh the list after update
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  // Function to delete a task
  const handleDeleteTask = async () => {
    try {
      await deleteTodo(tasks[updateTaskIndex]._id, token); // Delete task from DB
      const updatedTasks = tasks.filter((_, i) => i !== updateTaskIndex);
      setTasks(updatedTasks); // Update frontend state
      setShowDeleteModal(false); // Close modal
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Function to open the update modal and set the task to be updated
  const openUpdateModal = (index) => {
    setTask(tasks[index].title);
    setUpdateTaskIndex(index);
    setShowUpdateModal(true);
  };

  // Function to update a task
  const updateTaskHandler = async () => {
    const updatedTasks = tasks.map((t, i) =>
      i === updateTaskIndex ? { ...t, title: task } : t
    );
    setTasks(updatedTasks);
    setShowUpdateModal(false);
    setTask(''); // Clear input field after update
    setUpdateTaskIndex(null);
    try {
      await updateTodo(tasks[updateTaskIndex]._id, { title: task }, token); // Update task in DB
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Add these custom styles
  const styles = {
    header: {
      color: '#2c3e50',
      fontFamily: "'Poppins', sans-serif",
      fontWeight: '600',
      fontSize: '2.5rem',
      textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '2rem'
    },
    categoryHeader: {
      color: '#34495e',
      fontFamily: "'Poppins', sans-serif",
      fontWeight: '500',
      borderBottom: '2px solid #3498db',
      paddingBottom: '0.5rem',
      marginBottom: '1rem'
    },
    taskItem: (completed) => ({
      backgroundColor: completed ? 'rgba(46, 213, 115, 0.1)' : '#ffffff',
      borderLeft: `4px solid ${completed ? '#2ed573' : '#3498db'}`,
      marginBottom: '0.5rem',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      transition: 'all 0.3s ease'
    }),
    categorySelect: {
      width: 'auto',
      borderRadius: '4px',
      marginRight: '8px'
    },
    addTaskInput: {
      borderRadius: '4px',
      border: '1px solid #ced4da'
    },
    addButton: {
      borderRadius: '4px',
      marginLeft: '8px'
    },
    actionButton: {
      borderRadius: '6px',
      padding: '0.4rem 1rem',
      fontWeight: '500'
    },
    loginContainer: {
      backgroundColor: '#ffffff',
      borderRadius: '15px',
      padding: '3rem',
      boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
      textAlign: 'center',
      maxWidth: '600px',
      margin: '0 auto'
    },
    welcomeTitle: {
      color: '#2c3e50',
      fontSize: '2rem',
      marginBottom: '1.5rem',
      fontWeight: '600'
    },
    welcomeText: {
      color: '#7f8c8d',
      fontSize: '1.1rem',
      marginBottom: '2rem',
      lineHeight: '1.6'
    },
    authButton: {
      padding: '0.8rem 2rem',
      fontSize: '1.1rem',
      fontWeight: '500',
      margin: '0 10px'
    },
    divider: {
      color: '#95a5a6',
      margin: '0 15px',
      fontSize: '1.1rem'
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center" style={styles.header}>✨ Todo List</h1>

      {!isAuthenticated ? (
        <div className="container">
          <div style={styles.loginContainer}>
            <img 
              src="https://cdn-icons-png.flaticon.com/512/1950/1950715.png" 
              alt="Todo List Icon" 
              style={{ width: '100px', marginBottom: '1.5rem' }}
            />
            <h2 style={styles.welcomeTitle}>Welcome to Todo List</h2>
            <p style={styles.welcomeText}>
              Stay organized and boost your productivity with our simple and effective todo list application. 
              Login or create an account to start managing your tasks efficiently.
            </p>
            <div className="d-flex justify-content-center align-items-center">
              <a 
                href="/login" 
                className="btn btn-primary"
                style={styles.authButton}
              >
                Login
              </a>
              <span style={styles.divider}>or</span>
              <a 
                href="/register" 
                className="btn btn-outline-primary"
                style={styles.authButton}
              >
                Register
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* Todo Input with Category */}
          <div className="input-group mb-3">
            <select
              className="form-select flex-grow-0"
              style={styles.categorySelect}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              className="form-control"
              placeholder="Add a new task..."
              value={task}
              required
              onChange={(e) => setTask(e.target.value)}
              style={styles.addTaskInput}
            />
            <button 
              className="btn btn-primary"
              style={styles.addButton}
              onClick={addTask}
            >
              Add Task
            </button>
          </div>

          {/* Display tasks grouped by category */}
          {loading ? (
            <div className="text-center p-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div>
              {categories.map(cat => {
                const categoryTasks = tasks.filter(t => t.category === cat.id);
                if (categoryTasks.length === 0) return null;
                
                return (
                  <div key={cat.id} className="mb-4">
                    <h5 style={styles.categoryHeader}>
                      {cat.label}
                    </h5>
                    <ul className="list-group">
                      {categoryTasks.map((t) => (
                        <li
                          key={t._id}
                          className="list-group-item d-flex justify-content-between align-items-center"
                          style={styles.taskItem(t.completed)}
                        >
                          <div className="d-flex align-items-center">
                            <input
                              type="checkbox"
                              className="form-check-input me-3"
                              checked={t.completed}
                              onChange={() => toggleTaskCompletion(t._id, t.completed)}
                            />
                            <span style={{
                              textDecoration: t.completed ? 'line-through' : 'none',
                              color: t.completed ? '#7f8c8d' : '#2c3e50',
                              fontSize: '1.1rem'
                            }}>
                              {t.title}
                            </span>
                          </div>
                          <div>
                            <button
                              className="btn btn-outline-warning btn-sm me-2"
                              style={styles.actionButton}
                              onClick={() => openUpdateModal(tasks.indexOf(t))}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              style={styles.actionButton}
                              onClick={() => {
                                setUpdateTaskIndex(tasks.indexOf(t));
                                setShowDeleteModal(true);
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
          {!loading && tasks.length === 0 && (
            <div className="text-center mt-5">
              <p style={{ color: '#7f8c8d', fontSize: '1.2rem' }}>No tasks added yet! 📝</p>
            </div>
          )}
        </div>
      )}

      {/* Delete Task Modal */}
      <div
        className={`modal fade ${showDeleteModal ? 'show' : ''}`}
        style={{ display: showDeleteModal ? 'block' : 'none' }}
        tabIndex="-1"
        aria-labelledby="deleteModalLabel"
        aria-hidden={!showDeleteModal}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="deleteModalLabel">
                Delete Task
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowDeleteModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              Are you sure you want to delete this task?
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDeleteTask}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Update Task Modal */}
      <div
        className={`modal fade ${showUpdateModal ? 'show' : ''}`}
        style={{ display: showUpdateModal ? 'block' : 'none' }}
        tabIndex="-1"
        aria-labelledby="updateModalLabel"
        aria-hidden={!showUpdateModal}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="updateModalLabel">
                Update Task
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowUpdateModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="form-control"
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowUpdateModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={updateTaskHandler}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
