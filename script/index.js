function togglePassword() {
  let password = document.getElementById("password");
  if (password.type === "password") {
    password.type = "text";
  } else {
    password.type = "password";
  }
}

function loginSuccess() {
  const email = document.getElementById('login-username').value;
  const password = document.getElementById('password').value;
  fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        localStorage.setItem('role', data.role);
        localStorage.setItem('username', data.username);
        localStorage.setItem('email', data.email);
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: data.role === 'admin' ? "Redirecting to Admin Dashboard..." : "Redirecting to your Complaint Form...",
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          // Redirect based on role
          if (data.role === 'admin') {
            window.location.href = "/admindashboard.html";
          } else if (data.role === 'user') {
            window.location.href = "/complaintform.html";
          } else {
            // fallback: unknown role
            window.location.href = "/index.html";
          }
        });
      } else {
        Swal.fire({
          icon: "warning",
          title: "Not Registered",
          text: "You are not registered. Please register first.",
          showConfirmButton: true
        }).then(() => {
          window.location.href = "/registeration.html";
        });
      }
    })
    .catch(() => {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Could not connect to server. Try again."
      });
    });
}

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
