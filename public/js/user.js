if(
    !localStorage.getItem('accessToken')
    ||
    !localStorage.getItem('refreshToken')
    ||
    !localStorage.getItem('user')
) {
    location.replace('/admin/login.html')
}


const getAllUsers = async () => {
    const url = 'http://localhost:3000/api/users'

    const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    const responseBody = await response.json();
    if(response.status === 401 && responseBody.error.message === 'Token expired') {
        return await refreshToken(() => getAllUsers())
    }
    if (response.status === 200) {
        return responseBody;
    } else {
        throw responseBody;
    }
}

const getUserById = async (id) => {
    const url = 'http://localhost:3000/api/users/' + id
    const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    const responseBody = await response.json();
    if(response.status === 401 && responseBody.error.message === 'Token expired') {
        return await refreshToken(() => getUserById(id))
    }
    if (response.status === 200) {
        return responseBody;
    } else {
        throw responseBody;
    }
}

const addUser = async (data) => {
    const url = 'http://localhost:3000/api/users'
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
        return await refreshToken(() => addUser(data))
    }
    if (response.status === 200) {
        return responseBody;
    } else {
        throw responseBody;
    }
}

const updateUser = async (id, data) => {
    const url = 'http://localhost:3000/api/users/'+id
    const response = await fetch(url, {
        method: 'PATCH',
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
        return await refreshToken(() => updateUser(id, data))
    }
    if (response.status === 200) {
        return responseBody;
    } else {
        throw responseBody;
    }
}

const deleteUser = async (id) => {
    const url = 'http://localhost:3000/api/users/'+id
    const response = await fetch(url, {
        method: 'DELETE',
        mode: 'cors',
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    const responseBody = await response.json();
    if(response.status === 401 && responseBody.error.message === 'Token expired') {
        return await refreshToken(() => deleteUser(id))
    }
    if (response.status === 200) {
        return responseBody;
    } else {
        throw responseBody;
    }
}

const userTable = document.getElementById('user-table')
const userModal = new bootstrap.Modal(document.getElementById('user-modal'))
const auBtn = document.getElementById('au-btn')

auBtn.addEventListener('click', (e) => {
    const nameInp = document.getElementById('au-name')
    const emailInp = document.getElementById('au-email')
    let name = nameInp.value.trim()
    let email = emailInp.value.trim()
    addUser({name, email}).then((result) => {
        alert('USER ADDED!')
        nameInp.value = ''
        emailInp.value = ''
    }).catch((error) => {
        console.error(error)
        alert('Cannot add user')
    }).finally(() => {
        renderUsers()
    })
})

const openModal = (id) => {
    console.log(id)
    let mSaveBtn = document.getElementById('m-save-btn')
    let mDelBtn = document.getElementById('m-del-btn')
    let eles = document.getElementsByClassName('m-data')
    for (let i = 0; i < eles.length; i++) {
        eles[i].textContent = 'loading..'
    }
    mSaveBtn.disabled = true
    mDelBtn.disabled = true
    userModal.show()
    getUserById(id).then((result) => {
        document.getElementById('m-name').textContent = result.name
        document.getElementById('m-email').value = result.email
        mSaveBtn.addEventListener('click', (e) => {
            let email = document.getElementById('m-email').value.trim()
            if(!email) {
                return alert('EMAIL IS REQUIRED')
            }
            updateUser(id, { email }).then((result) => {
                alert('USER UPDATED!')
                userModal.hide()
            }).catch((error) => {
                console.error(error)
                alert('CANNOT UPDATE USER')
            }).finally(() => {
                renderUsers()
            })
        })
        mDelBtn.addEventListener('click', (e) => {
            deleteUser(id).then((result) => {
                alert('USER DELETED!')
                userModal.hide()
            }).catch((error) => {
                console.error(error)
                alert('CANNOT DELETE USER')
            }).finally(() => {
                renderUsers()
            })
        })
        mSaveBtn.disabled = false
        mDelBtn.disabled = false
    }).catch((error) => {
        alert('Error: ' + error)
    })
}

const renderROW = (data) => {
    let r = document.createElement('div')
    let c1 = document.createElement('div')
    let c2 = document.createElement('div')
    let c3 = document.createElement('div')
    let c4 = document.createElement('div')

    r.className = 'row border-bottom my-1 py-1'
    c1.className = 'col-12 col-md-1'
    c2.className = 'col-12 col-md-3'
    c3.className = 'col-12 col-md-7'
    c4.className = 'col-12 col-md-1'
    c1.textContent = data.i
    c2.textContent = data.name
    c3.textContent = data.email
    
    let actionBtn = document.createElement('button')
    actionBtn.innerHTML = `&equiv;`
    actionBtn.className = 'btn btn-outline-dark'
    actionBtn.addEventListener('click', (e) => {
        openModal(data._id)
    })
    
    c4.appendChild(actionBtn)
    
    r.append(c1, c2, c3, c4)

    return r
}

const renderUsers = () => {
    getAllUsers().then((result) => {
        userTable.innerHTML = ''
        for(let i = 0; i < result.length; i++) {
            result[i].i = i + 1
            userTable.appendChild(renderROW(result[i]))
        }
        console.log(result)
    }).catch((error) => {
        userTable.innerHTML = 'Cannot fetch data..'
        console.error(error)
    })
}

renderUsers()