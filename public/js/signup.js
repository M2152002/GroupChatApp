console.log('Welcome to the Chat app');
async function signup(e) {
    try {
        e.preventDefault();
        console.log(e.target.email.value);
        const userName = e.target.name.value;
        const email = e.target.email.value;
        const phoneNumber = e.target.phone.value;
        const password = e.target.password.value;

        const signupDetails = {
            name : userName,
            email : email,
            phoneNumber : phoneNumber,
            password : password
        }
        console.log(signupDetails);
        const response = await axios.post('http://localhost:3000/user/signup', signupDetails)
        if(response.status === 201) { // Created
            alert('Signup successful!');
            document.getElementById('message').innerText = 'Details are submitted to the database';
            localStorage.setItem('users', JSON.stringify(response.data.users));
            window.location.href = './login.html';
        }
        else if (response.status === 202) {
            window.alert("user already exists")
            document.getElementById('message').innerText = 'User already exists, Please Login';
        }
    }
    catch(err){
        document.getElementById('message').innerText = 'Failed to sign up';
        console.error(err);
    }
    e.target.name.value = '';
    e.target.email.value = '';
    e.target.phone.value = '';
    e.target.password.value = '';
}