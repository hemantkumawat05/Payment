import axios from "axios";

export const BACKEND_URL = "http://localhost:3000";

export const getCookie = (name) => {
    if (typeof document === "undefined") return null;
    const cookies = document.cookie ? document.cookie.split(";") : [];
    for (let c of cookies) {
        c = c.trim();
        if (c.startsWith(`${name}=`)) {
            return decodeURIComponent(c.substring(name.length + 1));
        }
    }
    return null;
};

const api = axios.create({
    baseURL: BACKEND_URL,
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        const method = config.method?.toLowerCase();
        if (["post", "delete", "put", "patch"].includes(method)) {
            const csrfToken = getCookie("csrfToken");
            if (csrfToken) {
                config.headers = config.headers || {};
                config.headers["x-csrf-token"] = csrfToken;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

let isRefreshing = false;
let isRefreshingCSRFToken = false;

let failedQueue = [];
let csrfFailedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

const processCSRFQueue = (error, token = null) => {
    csrfFailedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    csrfFailedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (!originalRequest) {
            return Promise.reject(error);
        }

        // Prevent infinite loop if refresh endpoints themselves fail
        if (
            originalRequest.url?.includes("/api/user/refresh") ||
            originalRequest.url?.includes("/api/user/refresh-csrf")
        ) {
            return Promise.reject(error);
        }

        const status = error.response?.status;
        const errorCode = error.response?.data?.code || "";

        if ((status === 403 || status === 401) && !originalRequest._retry) {
            // Case 1: CSRF Token Error
            if (errorCode.startsWith("CSRF_") || error.response?.data?.message?.includes("CSRF")) {
                if (isRefreshingCSRFToken) {
                    return new Promise((resolve, reject) => {
                        csrfFailedQueue.push({ resolve, reject });
                    }).then(() => {
                        const newCsrf = getCookie("csrfToken");
                        if (newCsrf && originalRequest.headers) {
                            originalRequest.headers["x-csrf-token"] = newCsrf;
                        }
                        return api(originalRequest);
                    });
                }

                originalRequest._retry = true;
                isRefreshingCSRFToken = true;

                try {
                    await api.post("/api/user/refresh-csrf");
                    processCSRFQueue(null);
                    const newCsrf = getCookie("csrfToken");
                    if (newCsrf && originalRequest.headers) {
                        originalRequest.headers["x-csrf-token"] = newCsrf;
                    }
                    return api(originalRequest);
                } catch (csrfErr) {
                    processCSRFQueue(csrfErr);
                    console.error("Failed to refresh CSRF token:", csrfErr);
                    return Promise.reject(csrfErr);
                } finally {
                    isRefreshingCSRFToken = false;
                }
            }

            // Case 2: Access Token Expired -> Use Refresh Token
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => {
                    const currentCsrf = getCookie("csrfToken");
                    if (currentCsrf && originalRequest.headers) {
                        originalRequest.headers["x-csrf-token"] = currentCsrf;
                    }
                    return api(originalRequest);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await axios.post(`${BACKEND_URL}/api/user/refresh`, {}, { withCredentials: true });
                processQueue(null);
                const currentCsrf = getCookie("csrfToken");
                if (currentCsrf && originalRequest.headers) {
                    originalRequest.headers["x-csrf-token"] = currentCsrf;
                }
                return api(originalRequest);
            } catch (refreshErr) {
                processQueue(refreshErr, null);
                return Promise.reject(refreshErr);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;