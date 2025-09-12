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
    Swal.fire({
      icon: "success",
      title: "Login Successful",
      text: "Redirecting to your Complaint Form...",
      timer: 2000,
      showConfirmButton: false
    }).then(() => {
    window.location.href = "complaintform.html";
    });
  }