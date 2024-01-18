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
        if(response.status === 200){
            console.log(response.data.user.name);
            localStorage.setItem('username', response.data.user.name);
            localStorage.setItem('token',response.data.token);
            localStorage.setItem('id', response.data.user.id);
            console.log(response.data.token);
            alert('Successfully logged in');
            window.location.href = './mainPage.html';
          }
          else if(201){
            window.alert('invalid password');
          }else{
              throw new Error('failed to login');
          }
    }
    catch(err) {
        console.log(JSON.stringify(err));
        document.body.innerHTML += `<div style="color:red;">${err.message} <div>`;
    }
    e.target.email.value = '';
    e.target.password.value = '';
} 