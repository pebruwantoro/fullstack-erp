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