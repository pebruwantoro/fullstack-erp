export const GenerateSalesOrders = async (token) => {
    return await fetch(`${import.meta.env.VITE_API_BACKEND_PATH}/sales-orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    })
}

export const List = async (token, params = {}) => {
    const baseUrl = `${import.meta.env.VITE_API_BACKEND_PATH}/sales-orders`;
    const query = new URLSearchParams(params).toString();
    const url = query ? `${baseUrl}?${query}`: baseUrl;
   
    return await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    })
}