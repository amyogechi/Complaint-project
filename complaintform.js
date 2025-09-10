// Grab elements
var form = document.getElementById("complaintForm");
var nameField = document.getElementById("name");
var matricField = document.getElementById("matric");
var emailField = document.getElementById("email");
var deptField = document.getElementById("department");
var titleField = document.getElementById("title");
var detailsField = document.getElementById("details");

// Error fields
var nameError = document.getElementById("nameError");
var matricError = document.getElementById("matricError");
var emailError = document.getElementById("emailError");
var deptError = document.getElementById("deptError");
var titleError = document.getElementById("titleError");
var detailsError = document.getElementById("detailsError");

// Validation functions
function validateName() {
  if (nameField.value.trim() === "") {
    nameError.style.display = "block";
    return false;
  } else {
    nameError.style.display = "none";
    return true;
  }
}

function validateMatric() {
  var regno= /./;
  if (!matricField.value.match(regno)) {
    matricError.style.display = "block";
    return false;
  } else {
    matricError.style.display = "none";
    return true;
  }
}

function validateEmail() {
  var emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,}$/;
  if (!emailField.value.match(emailPattern)) {
    emailError.style.display = "block";
    return false;
  } else {
    emailError.style.display = "none";
    return true;
  }
}

function validateDept() {
  if (deptField.value === "") {
    deptError.style.display = "block";
    return false;
  } else {
    deptError.style.display = "none";
    return true;
  }
}

function validateTitle() {
  if (titleField.value.trim() === "") {
    titleError.style.display = "block";
    return false;
  } else {
    titleError.style.display = "none";
    return true;
  }
}

function validateDetails() {
  if (detailsField.value.trim().length < 20) {
    detailsError.style.display = "block";
    return false;
  } else {
    detailsError.style.display = "none";
    return true;
  }
}

// Real-time validation
nameField.addEventListener("input", function() {
     validateName();
    } );
matricField.addEventListener("input", validateMatric);
emailField.addEventListener("input", validateEmail);
deptField.addEventListener("input", validateDept);
titleField.addEventListener("input", validateTitle);
detailsField.addEventListener("input", validateDetails);

// On form submit
form.addEventListener("submit", function(e) {
  e.preventDefault();

  // Run all validations
  var isValid =
    validateName() &&
    validateMatric() &&
    validateEmail() &&
    validateDept() &&
    validateTitle() &&
    validateDetails();

  if (isValid) {
    Swal.fire({
      icon: "success",
      title: "Complaint Submitted",
      text: "Thank you! Your complaint has been recorded.",
      timer: 2500,
      showConfirmButton: false
    });

    form.reset(); // clear fields
  } 
  // else {
  //   Swal.fire({
  //     icon: "error",
  //     title: "Form Incomplete",
  //     text: "Please fix the errors before submitting."
  //   });
  // }
});
