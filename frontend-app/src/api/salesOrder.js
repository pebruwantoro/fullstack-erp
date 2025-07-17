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