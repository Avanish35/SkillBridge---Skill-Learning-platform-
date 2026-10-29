import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
});

// Request interceptor to attach JWT token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('skillbridge_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    logout: () => {
        localStorage.removeItem('skillbridge_token');
        localStorage.removeItem('skillbridge_user');
    }
};

export const userAPI = {
    getProfile: () => api.get('/user/profile'),
    updateProfile: (data) => api.put('/user/profile', data),
    getMatches: () => api.get('/user/matches'),
    getAllUsers: () => api.get('/user/all')
};

export const sessionAPI = {
    bookSession: (data) => api.post('/sessions/book', data),
    getMySessions: () => api.get('/sessions/my-sessions')
};

export const courseAPI = {
    getAll: async () => {
        const res = await api.get('/courses');
        // Map backend schema to frontend expectation
        res.data = res.data.map(c => ({
            id: c.id,
            name: c.title, // Map title to name for UI
            category: "Programming",
            level: c.level ? c.level.toLowerCase() : "beginner",
            rating: c.averageRating || 0.0,
            reviewCount: c.reviewCount || 0,
            learners: 420,
            duration: c.duration + " hrs",
            description: c.description,
            instructor: { name: c.instructor },
            authorId: c.authorId, // Crucial for My Hosted Courses filtering
            type: "teach"
        }));
        return res;
    },
    getById: (id) => api.get(`/courses/${id}`),
    create: async (data) => {
        const res = await api.post('/courses', data);
        const c = res.data;
        // Ensure the newly created course matches the frontend schema immediately
        res.data = {
            id: c.id,
            name: c.title,
            category: "Programming",
            level: c.level ? c.level.toLowerCase() : "beginner",
            rating: 0.0,
            reviewCount: 0,
            learners: 0,
            duration: c.duration + " hrs",
            description: c.description,
            instructor: { name: c.instructor },
            authorId: c.authorId,
            type: "teach"
        };
        return res;
    },
    delete: (id) => api.delete(`/courses/${id}`)
};

export const reviewAPI = {
    getByCourse: (courseId) => api.get(`/reviews/course/${courseId}`),
    getByInstructor: (instructorId) => api.get(`/reviews/instructor/${instructorId}`),
    post: (data) => api.post('/reviews', data)
};

// Chat (Groq AI Integration + WebSockets History)
export const chatAPI = {
    // Original Groq AI Hook
    sendMessage: (message) => api.post('/chat', { message }),
    
    // User chat history compatibility endpoints
    getConversations: () => api.get('/conversations'),
    getHistory: (conversationId) => api.get(`/messages/history/${conversationId}`),
    getHistoryWithUser: (recipientId) => api.get(`/messages/history/with/${recipientId}`),
    
    // Mark as read
    markRead: (conversationId) => api.post(`/messages/read/${conversationId}`),

    // User chat STOMP history deletion
    clearHistory: (conversationId) => api.delete(`/messages/history/${conversationId}`)
};

export const adminAPI = {
    getUsers: () => api.get('/admin/users'),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
    updateFounder: (id, data) => api.put(`/admin/founders/${id}`, data),
    // Admin Course Management
    createCourse: (data) => api.post('/courses', data),
    updateCourse: (id, data) => api.put(`/courses/${id}`, data),
    deleteCourse: (id) => api.delete(`/courses/${id}`)
};

export const aiAPI = {
    generatePath: (skill) => api.post('/ai/generate-path', { skill })
};

export const publicAPI = {
    getFounders: () => api.get('/public/founders')
};

export default api;