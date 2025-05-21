export function isAuthenticated() {
    return !!localStorage.getItem('auth_token');
}

export function setToken(token) {
    localStorage.setItem('auth_token', token);
}