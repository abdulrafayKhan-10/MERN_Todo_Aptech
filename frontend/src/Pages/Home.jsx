import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = ({ isAuthenticated }) => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [updateTaskIndex, setUpdateTaskIndex] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // Function to add a new task
  const addTask = () => {
    if (task.trim() === '') return;
    setTasks([...tasks, { text: task, completed: false }]);
    setTask('');
  };

  // Function to toggle the completed status of a task
  const toggleTaskCompletion = (index) => {
    const updatedTasks = tasks.map((t, i) =>
      i === index ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);
  };

  // Function to delete a task
  const deleteTask = () => {
    const updatedTasks = tasks.filter((_, i) => i !== updateTaskIndex);
    setTasks(updatedTasks);
    setShowDeleteModal(false);
  };

  // Function to open the update modal and set the task to be updated
  const openUpdateModal = (index) => {
    setTask(tasks[index].text);
    setUpdateTaskIndex(index);
    setShowUpdateModal(true);
  };

  // Function to update a task
  const updateTask = () => {
    const updatedTasks = tasks.map((t, i) =>
      i === updateTaskIndex ? { ...t, text: task } : t
    );
    setTasks(updatedTasks);
    setShowUpdateModal(false);
    setTask('');
    setUpdateTaskIndex(null);
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
          {/* Todo Input */}
          <div className="input-group mb-3">
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

          {/* Task List */}
          <ul className="list-group">
            {tasks.map((t, index) => (
              <li
                key={index}
                className={`list-group-item d-flex justify-content-between align-items-center ${
                  t.completed ? 'text-decoration-line-through' : ''
                }`}
              >
                <span
                  onClick={() => toggleTaskCompletion(index)}
                  style={{ cursor: 'pointer' }}
                >
                  {t.text}
                </span>
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => openUpdateModal(index)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => { setUpdateTaskIndex(index); setShowDeleteModal(true); }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
          {tasks.length === 0 && (
            <p className="text-center mt-3">No tasks added yet!</p>
          )}
        </div>
      )}

      {/* Delete Task Modal */}
      <div className={`modal fade ${showDeleteModal ? 'show' : ''}`} style={{ display: showDeleteModal ? 'block' : 'none' }} tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden={!showDeleteModal}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="deleteModalLabel">Delete Task</h5>
              <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
            </div>
            <div className="modal-body">
              Are you sure you want to delete this task?
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button type="button" className="btn btn-danger" onClick={deleteTask}>Delete</button>
            </div>
          </div>
        </div>
      </div>

      {/* Update Task Modal */}
      <div className={`modal fade ${showUpdateModal ? 'show' : ''}`} style={{ display: showUpdateModal ? 'block' : 'none' }} tabIndex="-1" aria-labelledby="updateModalLabel" aria-hidden={!showUpdateModal}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="updateModalLabel">Update Task</h5>
              <button type="button" className="btn-close" onClick={() => setShowUpdateModal(false)}></button>
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
              <button type="button" className="btn btn-secondary" onClick={() => setShowUpdateModal(false)}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={updateTask}>Update</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
