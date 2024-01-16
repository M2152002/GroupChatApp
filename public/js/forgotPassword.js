document.getElementById("forgotp").addEventListener("submit", forgotp);

async function forgotp(e) {
  e.preventDefault();
  var email = document.getElementById('email').value;
  try {
    const res = await axios.post("http://localhost:3000/password/forgotpassword/", { email: email });
    console.log(res.data);
  } 
  catch (err) {
    console.log(err);
    document.body.innerHTML += `<div style="color:red;">${err} <div>`;
  }
}