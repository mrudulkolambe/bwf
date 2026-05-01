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

export const clearToken = () => {
    if (typeof document === 'undefined') return;
    document.cookie = 'bwf-auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}
