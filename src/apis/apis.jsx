import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/v1';
// const BASE_URL = "https://gym-mrck.onrender.com/api/v1"

// Add token from localStorage to default headers
const token = localStorage.getItem('token');
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        // 'Access-Control-Allow-Origin': '*',
        // 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
    },
    // withCredentials: true
});
// Add request interceptor to dynamically update token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};



export const sendOTP = async (email) => {
    try {
        const response = await api.post('/user/sendotp', { "email" : email });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const signup = async (userData) => {
    try {
        const response = await api.post('/user/signup', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const login = async (credentials) => {
    try {
        const response = await api.post('/user/login', credentials);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

//get user details by id
export const getUserById = async (userId) => {
    try {
        const response = await api.get(`/user/${userId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

//sercgyms by location and category
export const searchGyms = async ({ area, city, page = 1, limit = 10, sortBy = 'ratings.average' }) => {
    try {
        const response = await api.get('/gyms/search/location', {
            params: {
                area,
                city,
                page,
                limit,
                sortBy
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get nearby gyms based on coordinates ( not workking  )
export const getNearbyGyms = async ({ latitude, longitude, radius = 10, page = 1, limit = 5 }) => {
    try {
        const response = await api.get('/gyms/nearby', {
            params: {
                latitude,
                longitude,
                radius,
                page,
                limit
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

//get approved gyms by page and limit and sort by rating and distance from use
export const getApprovedGyms = async (page = 1, limit = 5) => {
    try {
        const response = await api.get('/gyms/approved', {
            params: {
                page,
                limit
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

//geographical lopaction finder using locationiq api
export const getLocationDetails = async (latitude, longitude) => {
    try {
        const response = await axios.get('https://us1.locationiq.com/v1/reverse', {
            params: {
                lat: latitude,
                lon: longitude,
                key: "pk.88f655e1c2a39a18eba810792c609ad0", // Consider moving this to environment variables
                format: 'json'
            },
            headers: {
                accept: 'application/json'
            }
        });
        
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

//upadte user address in database using current location 
export const updateUserAddress = async (addressData) => {
    try {
        const response = await api.put('/user/address', {
            currentAddress: addressData
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Create a new todo
export const createTodo = async (todoData) => {
    try {
        const response = await api.post('/user/todos', todoData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get completed todos
export const getCompletedTodos = async () => {
    try {
        const response = await api.get('/user/todos/completed');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get uncompleted todos
export const getUncompletedTodos = async () => {
    try {
        const response = await api.get('/user/todos/uncompleted');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Delete a todo
export const deleteTodo = async (todoId) => {
    try {
        const response = await api.delete(`/user/todos/${todoId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Update a todo
export const updateTodo = async (todoId, updateData) => {
    try {
        const response = await api.patch(`/user/todos/${todoId}`, updateData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get todos by calendar month
export const getCalendarTodos = async (month, year) => {
    try {
        const response = await api.get('/user/todos/calendar', {
            params: {
                month,
                year
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get todos by specific date
export const getTodosByDate = async (date) => {
    try {
        const response = await api.get('/user/todos/by-date', {
            params: {
                date
            }
        });
        
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

//register gym in deatabase
export const registerGym = async (gymData) => {
    try {
        const response = await api.post('/gyms/register', gymData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

//get gym details by id
export const getGymById = async (gymId) => {
    try {
        const response = await api.get(`/gyms/${gymId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};


// payment creation method
export const createGymPaymentOrder = async (gymId, amount, currency = "INR") => {
    try {
        const response = await api.post(`/payment/gym-registration/${gymId}`, {
            amount,
            currency,
            keyId: process.env.REACT_APP_RAZORPAY_KEY_ID
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('Failed to create payment order');
    }
};

// payment verification method
export const verifyGymPayment = async (paymentDetails) => {
    try {
        const response = await api.post('/payment/verify-payment', paymentDetails);
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('Payment verification failed');
    }
};

export default api;

