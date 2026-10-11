
async function getUserInfo() {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/getUserInfo`, {
        method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        })
        const user = await response.json().data;
        return user;
    }

export default getUserInfo;