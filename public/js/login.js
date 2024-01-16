async function login(e) {
    try {
        e.preventDefault();
        console.log(e.target.name);

        const loginDetails = {
            email: e.target.email.value,
            password: e.target.password.value
        }
        // console.log(loginDetails)
        const response = await axios.post('http://localhost:3000/user/login', loginDetails)
            alert(response.data.message);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userID', response.data.userid);
            localStorage.setItem('userName', response.data.userName);
            window.location.href ='./mainPage.html';
    }
    catch(err) {
        console.log(JSON.stringify(err));
        document.body.innerHTML += `<div style="color:red;">${err.message} <div>`;
    }
} 