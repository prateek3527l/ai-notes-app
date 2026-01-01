// 📡 AI NOTES APP - API HELPER MODULE
// =============================================
// Centralized API communication layer
// Handles all HTTP requests to the backend server
// =============================================

// 🔗 API CONFIGURATION
const BASE_URL = 'https://ai-notes-app-dq3a.onrender.com';

// =============================================
// 🚀 CORE API REQUEST FUNCTION
// =============================================

/**
 * 🌐 MAKE API REQUEST
 * Centralized function for all API communications
 * Automatically handles authentication, headers, and error checking
 * 
 * @param {string} endpoint - API endpoint (e.g., '/api/notes')
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {Object|null} data - Request body data (null for GET/DELETE)
 * @returns {Promise<Object>} - Parsed JSON response from server
 * 
 * @example
 * // GET request
 * const notes = await apiRequest('/api/notes');
 * 
 * @example
 * // POST request
 * const newNote = await apiRequest('/api/notes', 'POST', { title: 'Hello', content: 'World' });
 * 
 * @example
 * // DELETE request
 * await apiRequest('/api/notes/123', 'DELETE');
 */
async function apiRequest(endpoint, method = 'GET', data = null) {
    try {
        // 📝 PREPARE REQUEST HEADERS
        const headers = {
            'Content-Type': 'application/json'
        };
        
        // 🔐 ADD AUTHENTICATION TOKEN IF AVAILABLE
        const token = localStorage.getItem('token');
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
        
        // ⚙️ CONFIGURE REQUEST OPTIONS
        const requestOptions = {
            method: method.toUpperCase(),
            headers: headers,
            body: data ? JSON.stringify(data) : null
        };
        
        // 📤 MAKE HTTP REQUEST
        const response = await fetch(BASE_URL + endpoint, requestOptions);
        
        // 📥 PARSE JSON RESPONSE
        const responseData = await response.json();
        
        // ✅ RETURN SUCCESSFUL RESPONSE
        return responseData;
        
    } catch (error) {
        // ❌ HANDLE NETWORK OR FETCH ERRORS
        console.error(`API Request Failed: ${endpoint}`, error);
        
        // Return a consistent error structure
        return {
            success: false,
            error: 'Network error. Please check your connection.',
            details: error.message
        };
    }
}

// =============================================
// 🎯 CONVENIENCE FUNCTIONS (OPTIONAL - ADD IF NEEDED)
// =============================================

/**
 * 📥 GET REQUEST HELPER
 * Convenience wrapper for GET requests
 * 
 * @param {string} endpoint - API endpoint
 * @returns {Promise<Object>} - Response data
 */
async function apiGet(endpoint) {
    return await apiRequest(endpoint, 'GET');
}

/**
 * 📤 POST REQUEST HELPER
 * Convenience wrapper for POST requests
 * 
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body
 * @returns {Promise<Object>} - Response data
 */
async function apiPost(endpoint, data) {
    return await apiRequest(endpoint, 'POST', data);
}

/**
 * 🔄 PUT REQUEST HELPER
 * Convenience wrapper for PUT requests
 * 
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body
 * @returns {Promise<Object>} - Response data
 */
async function apiPut(endpoint, data) {
    return await apiRequest(endpoint, 'PUT', data);
}

/**
 * ❌ DELETE REQUEST HELPER
 * Convenience wrapper for DELETE requests
 * 
 * @param {string} endpoint - API endpoint
 * @returns {Promise<Object>} - Response data
 */
async function apiDelete(endpoint) {
    return await apiRequest(endpoint, 'DELETE');
}

// =============================================
// 🔐 AUTHENTICATION HELPERS (OPTIONAL - ADD IF NEEDED)
// =============================================

/**
 * 👤 GET CURRENT USER FROM TOKEN
 * Extracts user information from JWT token
 * 
 * @returns {Object|null} - User object or null
 */
function getCurrentUser() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
        // Decode JWT token (client-side only, for display purposes)
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
            id: payload.userId,
            email: payload.email,
            exp: payload.exp
        };
    } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
    }
}

/**
 * 📍 CHECK IF USER IS AUTHENTICATED
 * Verifies if a valid token exists
 * 
 * @returns {boolean} - True if authenticated
 */
function isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token; // Convert to boolean
}

/**
 * 🕒 CHECK IF TOKEN IS EXPIRED
 * Validates token expiration time
 * 
 * @returns {boolean} - True if token is expired or invalid
 */
function isTokenExpired() {
    const user = getCurrentUser();
    if (!user || !user.exp) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return user.exp < currentTime;
}

// =============================================
// 📊 API HEALTH CHECK (OPTIONAL - ADD IF NEEDED)
// =============================================

/**
 * ❤️ CHECK API CONNECTION
 * Verifies that the backend API is reachable
 * 
 * @returns {Promise<Object>} - Health status
 */
async function checkApiHealth() {
    try {
        const health = await apiRequest('/health', 'GET');
        return {
            online: true,
            message: 'API is reachable',
            data: health
        };
    } catch (error) {
        return {
            online: false,
            message: 'API is unreachable',
            error: error.message
        };
    }
}

// =============================================
// 📝 LOGGING CONFIGURATION (OPTIONAL - FOR DEVELOPMENT)
// =============================================

const API_LOGGING = true; // Set to false in production

/**
 * 📋 LOG API REQUEST DETAILS
 * Development utility for debugging API calls
 * 
 * @param {string} endpoint - API endpoint
 * @param {string} method - HTTP method
 * @param {Object|null} data - Request data
 * @param {Object} response - Response data
 */
function logApiCall(endpoint, method, data, response) {
    if (!API_LOGGING) return;
    
    console.group('📡 API Call');
    console.log('Endpoint:', endpoint);
    console.log('Method:', method);
    console.log('Request Data:', data);
    console.log('Response:', response);
    console.groupEnd();
}

// =============================================
// 🧪 EXPORT FOR MODULAR USE (IF USING MODULES)
// =============================================

// Uncomment if using ES6 modules:
// export {
//     apiRequest,
//     apiGet,
//     apiPost,
//     apiPut,
//     apiDelete,
//     getCurrentUser,
//     isAuthenticated,
//     isTokenExpired,
//     checkApiHealth
// };