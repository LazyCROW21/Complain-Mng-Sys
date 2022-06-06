const logout = async () => {
    let refreshToken = localStorage.getItem('refreshToken')
    if(refreshToken) {
        const url = 'http://localhost:3000/api/users/logout'
        await fetch(url, {
            method: 'DELETE',
            mode: 'cors',
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refreshToken })
        });
    }
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    location.replace('/admin/login.html')
}