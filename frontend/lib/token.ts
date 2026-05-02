export const getToken = () => {
    if (typeof document === 'undefined') return null;
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.split('=');
        if (key && value) {
            acc[key.trim()] = value.trim();
        }
        return acc;
    }, {} as Record<string, string>);
    return cookies['bwf-auth-token'];
}

export const setToken = (token: string) => {
    if (typeof document === 'undefined') return;
    const isSecure = window.location.protocol === 'https:';
    document.cookie = `bwf-auth-token=${token}; path=/; max-age=2592000; SameSite=Lax${isSecure ? '; Secure' : ''}`;
}

export const clearToken = () => {
    if (typeof document === 'undefined') return;
    document.cookie = 'bwf-auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}
