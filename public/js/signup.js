console.log('Welcome to the Chat app');
async function signup(e) {
    try {
        e.preventDefault();
        console.log(e.target.email.value);
        const userName = e.target.name.value;
        const email = e.target.email.value;
        const phone = e.target.phone.value;
        const password = e.target.password.value;

        const signupDetails = {
            name : userName,
            email : email,
            phone : phone,
            password : password
        }
        console.log(signupDetails);
        const response = await axios.post('http://localhost:3000/user/signup', signupDetails)
        if(response.status === 201) { // Created
            alert('Signup successful!');
            window.location.href = './login.html';
        }
        else {
            alert('Signup failed. User already exists.');
        }
    }
    catch(err){
        document.body.innerHTML += `<div style="color:red;">${err} <div>`;
    }
    e.target.name.value = '';
    e.target.email.value = '';
    e.target.phone.value = '';
    e.target.password.value = '';
}