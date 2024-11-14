import axios from 'axios';

// Base URL for your API
const API_URL = 'http://localhost:5000/api';

// User-related API calls
export const createUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/user/register`, userData);
        return response;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};

export const loginUser = async (loginData) => {
    try {
        const response = await axios.post(`${API_URL}/user/login`, loginData);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userData', JSON.stringify(response.data.user));
        }
        return response;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};


// Todo-related API calls
export const getTodos = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/todo`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching todos:', error);
        throw error;
    }
};

export const addTodo = async (todoData, token) => {
    try {
      const response = await axios.post(
        `${API_URL}/todo`,  // Make sure this is the correct endpoint
        todoData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;  // Make sure your backend sends the task object back
    } catch (error) {
      console.error('Error adding todo:', error);
      throw error;  // This ensures you can catch errors in the Home component
    }
  };
  
export const updateTodo = async (id, updatedData, token) => {
    try {
        const response = await axios.put(`${API_URL}/todo/${id}`, updatedData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating todo:', error);
        throw error;
    }
};

export const deleteTodo = async (id, token) => {
    try {
        const response = await axios.delete(`${API_URL}/todo/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting todo:', error);
        throw error;
    }
};
