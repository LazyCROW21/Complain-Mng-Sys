if (
    !localStorage.getItem('accessToken') ||
    !localStorage.getItem('refreshToken') ||
    !localStorage.getItem('user')
) {
    location.replace('/admin/login.html')
}

const filterNew = document.getElementById('new-chk')
const filterWorking = document.getElementById('working-chk')
const filterResolved = document.getElementById('resolved-chk')
const filterDiscarded = document.getElementById('discarded-chk')
const filterSort = document.getElementById('sort')
const filterBtn = document.getElementById('filter-btn')

const getFilters = () => {
    let q = ''
    if (
        filterNew.checked || filterWorking.checked ||
        filterResolved.checked || filterDiscarded.checked
    ) {
        q += `?new=${filterNew.checked}&working=${filterWorking.checked}`
        q += `&resolved=${filterResolved.checked}&discarded=${filterDiscarded.checked}`
    }
    if (filterSort.value) {
        if (q) {
            q += `&`
        } else {
            q += '?'
        }
        q += `sort=${filterSort.value}`
    }
    return q
}

filterBtn.addEventListener('click', (e) => {
    renderComplains()
})

const getAllComplains = async () => {
    const url = 'http://localhost:3000/api/complains' + getFilters()
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
        return await refreshToken(() => getAllComplains())
    }
    if (response.status === 200) {
        return responseBody
    } else {
        throw responseBody;
    }
}

const getComplainById = async (id) => {
    const url = 'http://localhost:3000/api/complains/' + id
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
        return await refreshToken(() => getComplainById(id))
    }
    if (response.status === 200) {
        return responseBody;
    } else {
        throw responseBody;
    }
}

const updateComplain = async (id, data) => {
    const url = 'http://localhost:3000/api/complains/' + id
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
        return await refreshToken(() => updateComplain(id, data))
    }
    if (response.status === 200) {
        return responseBody;
    } else {
        throw responseBody;
    }
}

const complainTable = document.getElementById('complain-table')
const complainModal = new bootstrap.Modal(document.getElementById('complain-modal'))

const openModal = (id) => {
    console.log(id)
    let mSaveBtn = document.getElementById('m-save-btn')
    let eles = document.getElementsByClassName('m-data')
    for (let i = 0; i < eles.length; i++) {
        eles[i].textContent = 'loading..'
    }
    mSaveBtn.disabled = true
    complainModal.show()
    getComplainById(id).then((result) => {
        document.getElementById('m-complain-id').textContent = result._id
        document.getElementById('m-complainee').textContent = result.name
        document.getElementById('m-email').textContent = result.email
        document.getElementById('m-address').textContent = result.addressline
        document.getElementById('m-city').textContent = result.city
        document.getElementById('m-state').textContent = result.state
        document.getElementById('m-problem').textContent = result.description
        document.getElementById('m-status').value = result.status
        document.getElementById('m-write').href = 'http://localhost:3000/admin/email.html?email=' + encodeURIComponent(result.email)
        mSaveBtn.addEventListener('click', (e) => {
            let status = document.getElementById('m-status').value
            updateComplain(id, {
                status
            }).then((result) => {
                alert('COMPLAIN UPDATED!')
            }).catch((error) => {
                console.error(error)
                alert('CANNOT UPDATE COMPLAIN')
            }).finally(() => {
                renderComplains()
            })
        })
        mSaveBtn.disabled = false
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
    let c5 = document.createElement('div')

    r.className = 'row border-bottom my-1 py-1'
    c1.className = 'col-12 col-md-1'
    c2.className = 'col-12 col-md-3'
    c3.className = 'col-12 col-md-5'
    c4.className = 'col-12 col-md-2'
    c5.className = 'col-12 col-md-1'
    c1.textContent = data.i
    c2.textContent = data.name
    c3.textContent = data.description
    c4.textContent = data.status

    let actionBtn = document.createElement('button')
    actionBtn.innerHTML = `&equiv;`
    actionBtn.className = 'btn btn-outline-dark'
    actionBtn.addEventListener('click', (e) => {
        openModal(data._id)
    })

    c5.appendChild(actionBtn)

    r.append(c1, c2, c3, c4, c5)

    return r
}

const renderComplains = () => {
    getAllComplains().then((result) => {
        complainTable.innerHTML = ''
        for (let i = 0; i < result.length; i++) {
            result[i].i = i + 1
            complainTable.appendChild(renderROW(result[i]))
        }
    }).catch((error) => {
        complainTable.innerHTML = 'Cannot fetch data..'
        console.error(error)
    })
}

renderComplains()