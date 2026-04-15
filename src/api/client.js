
const baseUrl = () => {
    const u = import.meta.env.VITE_API_URL;
    if (u != null && String(u).trim() !== '') {
        return String(u).replace(/\/$/, '');
    }
    if (import.meta.env.DEV) {
        return 'http://localhost:5000';
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
