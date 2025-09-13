function togglePassword() {  
    let password = document.getElementById("password");
    if (password.type === "password") {
    password.type = "text";   
   } else {
    password.type = "password"; 
   }
   }
  
  //  SweetAlert success popup
   function loginSuccess() {
    // Get username and password from form
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('password').value;
    // Demo: simple role check (replace with backend auth)
    let role = 'user';
    if (username.toLowerCase() === 'admin') role = 'admin';
    localStorage.setItem('role', role);
    localStorage.setItem('username', username);
    Swal.fire({
      icon: "success",
      title: "Login Successful",
      text: role === 'admin' ? "Redirecting to Admin Dashboard..." : "Redirecting to your Complaint Form...",
      timer: 2000,
      showConfirmButton: false
    }).then(() => {
      if (role === 'admin') {
        window.location.href = "admindashboard.html";
      } else {
        window.location.href = "complaintform.html";
      }
    });
// Handle login form submit
document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.querySelector('form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      loginSuccess();
    });
  }
});
  }