const getBaseUrl = () => {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
};

const apiBuilder = (path: string) => {
    const base = getBaseUrl();
    const apiBase = `${base}/api`;
    const finalURL = `${apiBase}${path}`
    return finalURL
};

const APIs = {
    login: apiBuilder('/auth/login'),
    partners: apiBuilder('/partners'),
    partnerCheckPhone: apiBuilder('/partners/check-phone')
}

export default APIs
