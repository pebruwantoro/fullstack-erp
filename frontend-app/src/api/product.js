export const List = async (token) => {
    return await fetch(`${import.meta.env.VITE_API_BACKEND_PATH}/products`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    })
}