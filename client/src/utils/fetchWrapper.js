

async function getNewAccessToken() {
    const API_URL = import.meta.env.VITE_API_URL;
    const refreshTokenUrl = `${API_URL}/api/refreshToken`;

    const response = await fetch(refreshTokenUrl); //this would store the token in the cookie
    if (response.status !== 200) //session expired
        return null;
    const result = await response.json();
    return result.data.accessToken;
}

async function fetchWrapper(requestUrl, requestOptions) {
    try {
        let response = await fetch(requestUrl, requestOptions)
        if (response.status === 401) { //Unauthorized access
            //access token expired --> request for new access token
            const retryOptions = {
                ...requestOptions,
                headers: {
                    ...requestOptions.headers,
                    Authorization: `Bearer ${await getNewAccessToken()}`
                }
            }
            response = await fetch(requestUrl, retryOptions);
        }
        return response;
    } catch (error) {
        console.error('Error in fetching with refresh toekn:\n', error);
        throw error;
    }
}

function fetchPromiseWrapper(requestUrl, requestOptions = {}) {
    return new Promise(async (resolve, reject) => {
        let response = await fetch(requestUrl, requestOptions);
        if (response.status === 401) {
            const newAccessToken = await getNewAccessToken();
            if (!newAccessToken)
                reject(new Error('Session expired, login again'));
            const retryOptions = {
                ...requestOptions,
                headers: {
                    ...requestOptions.headers,
                    Authorization: `Bearer ${newAccessToken}`
                }
            }
            //make the API call again
            response = await fetch(requestUrl, retryOptions);
        }
        resolve(response);
    });
}

module.exports = { fetchWrapper, fetchPromiseWrapper };