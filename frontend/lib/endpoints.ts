const getBaseUrl = () => {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
};

const apiBuilder = (path: string) => {
    const base = getBaseUrl();
    // For Vercel experimentalServices, we use the routePrefix defined in vercel.json
    const apiBase = base.includes('localhost') ? `${base}/api` : `/_/backend/api`;
    const finalURL = `${apiBase}${path}`
    return finalURL
};

const APIs = {
    login: apiBuilder('/auth/login'),
    partners: apiBuilder('/partners'),
    partnerCheckPhone: apiBuilder('/partners/check-phone')
}

export default APIs
