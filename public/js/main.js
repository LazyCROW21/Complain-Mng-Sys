const form = document.getElementById('c-form')
const nameInp = document.getElementById('nameinp')
const emailInp = document.getElementById('emailinp')
const addresslineInp = document.getElementById('addresslineinp')
const cityInp = document.getElementById('cityinp')
const stateInp = document.getElementById('stateinp')
const descriptionInp = document.getElementById('descriptioninp')

const clearForm = () => {
    nameInp.value = ''
    emailInp.value = ''
    addresslineInp.value = ''
    cityInp.value = ''
    stateInp.value = ''
    descriptionInp.value = ''
}

const getFormData = () => {
    return {
        'name': nameInp.value,
        'email': emailInp.value,
        'addressline': addresslineInp.value,
        'city': cityInp.value,
        'state': stateInp.value,
        'description': descriptionInp.value
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const url = 'http://localhost:3000/api/complains'
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(getFormData())
    });
    if(response.status == 201) {
        const complain = await response.json();
        alert(`You complain (id: ${complain._id}) is registered check your email for updates`)
        clearForm()
    } else {
        alert('Some error occurred, try again later!')
    }
})