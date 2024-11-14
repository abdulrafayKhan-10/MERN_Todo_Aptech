import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { addTodo, updateTodo, deleteTodo } from '../api'; // import API functions

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
      const response = await axios.get('http://localhost:5000/api/todo', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Fetched tasks:', response.data); // Debug log
      setTasks(response.data);
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
      const response = await addTodo({ 
        title: task,
        completed: false,
        category: category
      }, token);
      console.log('Response from addTodo:', response);
      await fetchTasks();
      setTask('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // Function to toggle the completed status of a task
  const toggleTaskCompletion = async (index) => {
    const updatedTasks = tasks.map((t, i) =>
      i === index ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);
    try {
      await updateTodo(tasks[index]._id, { completed: !tasks[index].completed }, token); // Update task status in DB
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

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">To-Do App</h1>

      {!isAuthenticated ? (
        <div className="text-center">
          <h2>Please log in to use the Todo App.</h2>
          <p>
            <a href="/login" className="btn btn-primary">
              Login
            </a>
            <span> or </span>
            <a href="/register" className="btn btn-secondary">
              Register
            </a>
          </p>
        </div>
      ) : (
        <div>
          {/* Todo Input with Category */}
          <div className="input-group mb-3">
            <select
              className="form-select flex-grow-0"
              style={{ width: 'auto' }}
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
              onChange={(e) => setTask(e.target.value)}
            />
            <button className="btn btn-primary" onClick={addTask}>
              Add Task
            </button>
          </div>

          {/* Display tasks grouped by category */}
          {loading ? (
            <p className="text-center">Loading tasks...</p>
          ) : (
            <div>
              {categories.map(cat => {
                const categoryTasks = tasks.filter(t => t.category === cat.id);
                if (categoryTasks.length === 0) return null;
                
                return (
                  <div key={cat.id} className="mb-4">
                    <h5 className="mb-3">{cat.label}</h5>
                    <ul className="list-group">
                      {categoryTasks.map((t, index) => (
                        <li
                          key={t._id}
                          className={`list-group-item d-flex justify-content-between align-items-center`}
                          style={{ 
                            backgroundColor: t.completed ? '#d4edda' : '#f8f9fa',
                            transition: 'background-color 0.3s ease'
                          }}
                        >
                          <div className="d-flex align-items-center">
                            <input
                              type="checkbox"
                              className="form-check-input me-2"
                              checked={t.completed}
                              onChange={() => toggleTaskCompletion(index)}
                            />
                            <span
                              style={{
                                textDecoration: t.completed ? 'line-through' : 'none',
                                cursor: 'pointer'
                              }}
                            >
                              {t.title}
                            </span>
                          </div>
                          <div>
                            <button
                              className="btn btn-warning btn-sm me-2"
                              onClick={() => openUpdateModal(index)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => {
                                setUpdateTaskIndex(index);
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
            <p className="text-center mt-3">No tasks added yet!</p>
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
