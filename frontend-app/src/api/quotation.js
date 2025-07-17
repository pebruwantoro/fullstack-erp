export const CreateQuotation = async (token, data) => {
    return await fetch(`${import.meta.env.VITE_API_BACKEND_PATH}/quotations`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            products: data,
        })
    })
}