if (
    !localStorage.getItem('accessToken')
    ||
    !localStorage.getItem('refreshToken')
    ||
    !localStorage.getItem('user')
) {
    location.replace('/admin/login.html')
}

const sendMail = async (data) => {
    const url = 'http://localhost:3000/api/email'
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(data)
    });
    const responseBody = await response.json();
    if(response.status === 401 && responseBody.error.message === 'Token expired') {
        return await refreshToken(() => sendMail(data))
    }
    if (response.status === 200) {
        return responseBody;
    } else {
        throw responseBody;
    }
}

const btn = document.getElementById('send-btn')
btn.addEventListener('click', (e) => {
    const emailInp = document.getElementById('email')
    const subjectInp = document.getElementById('subject')
    const bodyInp = document.getElementById('body')
    let email = emailInp.value.trim()
    let subject = subjectInp.value.trim()
    let body = bodyInp.value.trim()

    if(!email || !subject || !body) {
        return alert('Email, Subject & Body are required!')
    }
    
    sendMail({ email, subject, body }).then((result) => {
        alert('MAIL SEND!')
        location.replace('/admin/index.html')
    }).catch((error) => {
        console.error(error)
        alert('CANNOT SEND EMAIL')
    })
})
