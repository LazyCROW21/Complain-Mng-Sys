const refreshTokenREQUEST = async (data) => {
    const url = 'http://localhost:3000/api/users/refresh-token'
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (response.status === 200) {
        return await response.json()
    } else {
        throw await response.json()
    }
}

const refreshToken = async (cb) => {
    const refreshToken = localStorage.getItem('refreshToken')
    if(!refreshToken) {
        return logout()
    }
    try {
        const { accessToken } = await refreshTokenREQUEST({ refreshToken })
        localStorage.setItem('accessToken', accessToken)
        return cb()
    } catch (e) {
        console.error(e)
        logout()
    }
}