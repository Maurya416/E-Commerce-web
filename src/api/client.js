/**
 * Backend URL:
 * - Set VITE_API_URL in .env (e.g. http://127.0.0.1:5000) to override.
 * - If unset in dev, defaults to http://127.0.0.1:5000 (direct; backend must be running).
 * - Production build: leave unset only if API is same origin; else set VITE_API_URL.
 */
const baseUrl = () => {
    const u = import.meta.env.VITE_API_URL;
    if (u != null && String(u).trim() !== '') {
        return String(u).replace(/\/$/, '');
    }
    if (import.meta.env.DEV) {
        return 'https://2dmv5gbn-5000.inc1.devtunnels.ms';
    }
    return '';
};

export async function fetchApi(path, options = {}) {
    const prefix = baseUrl();
    const url = prefix ? `${prefix}${path}` : path;
    const token = localStorage.getItem('token');

    const defaultHeaders = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };

    const config = {
        method: options.method || 'GET',
        headers: { ...defaultHeaders, ...options.headers },
        ...options
    };

    if (options.body && typeof options.body === 'object') {
        config.body = JSON.stringify(options.body);
    }

    let res;
    try {
        res = await fetch(url, config);
    } catch (e) {
        throw new Error(
            `Network error (${url}): ${e.message}. Is the backend running?`
        );
    }

    const text = await res.text();
    let json;
    try {
        json = text ? JSON.parse(text) : {};
    } catch {
        throw new Error(
            `Bad response (${res.status}) from server — not JSON. ${text.slice(0, 80)}`
        );
    }

    if (!res.ok || json.success !== true) {
        throw new Error(json.message || `Request failed (${res.status})`);
    }

    return json.data;
}
