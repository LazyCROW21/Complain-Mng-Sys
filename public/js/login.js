if(
    localStorage.getItem('accessToken')
    &&
    localStorage.getItem('refreshToken')
    &&
    localStorage.getItem('user')
) {
    location.replace('/admin/')
}

const url = 'http://localhost:3000/api/users/login'

const login = async (email, password) => {
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        })
    });
    if(response.status === 200) {
        return await response.json();
    } else {
        throw await response.json();
    }
}

const loginForm = document.getElementById('login-form')
const loginMsg = document.getElementById('login-msg')

loginForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let email = document.getElementById('email-inp').value.trim()
    let pwd = document.getElementById('pwd-inp').value.trim()

    login(email, pwd).then((result) => {
        console.log(result)
        localStorage.setItem('accessToken', result.accessToken)
        localStorage.setItem('refreshToken', result.refreshToken)
        localStorage.setItem('user', JSON.stringify(result.user))
        location.replace('/admin/')
    }).catch((error) => {
        loginMsg.textContent = 'Invalid email / password !'
        console.error(error)
    })
})