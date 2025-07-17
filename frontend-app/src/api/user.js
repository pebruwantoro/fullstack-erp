export const Login = async ({email, password}) => {
   return await fetch(`${import.meta.env.VITE_API_BACKEND_PATH}/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            email,
            password
        })
   });
}

export const CreateAccount = async ({name, email, password, role}) => {
    return await fetch(`${import.meta.env.VITE_API_BACKEND_PATH}/users/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            name,
            email,
            password,
            role,
        })
    })
}

export const MyProfile = async(token) => {
    return await fetch(`${import.meta.env.VITE_API_BACKEND_PATH}/users/my-profile`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    })
}