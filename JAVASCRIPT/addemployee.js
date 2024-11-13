document.addEventListener("DOMContentLoaded", function() {
    // Function to get cookie by name
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    // Utility function to check if the token is expired
    function isTokenExpired(token) {
        try {
            const payload = decodeJWT(token);
            const currentTime = Math.floor(Date.now() / 1000);
            return payload.exp && payload.exp < currentTime;
        } catch (error) {
            console.error('Error decoding token:', error);
            return true; // Consider the token expired if there's an error
        }
    }

    // Utility function to decode the JWT token (simple base64 decoding)
    function decodeJWT(token) {
        const base64Url = token.split('.')[1]; // Get the payload part of the JWT
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }

    function validateForm() {
        let isValid = true;
        const requiredFields = document.querySelectorAll('#employeeForm input[required], #employeeForm select[required]');
        let firstInvalidField = null;
    
        // Reset styles and error messages for all required fields
        requiredFields.forEach(field => {
            field.style.border = '';
            const errorMessageElement = document.getElementById(field.id + 'Error');
            if (errorMessageElement) {
                errorMessageElement.textContent = '';
                errorMessageElement.style.display = 'none';
            }
        });
      // Loop through all required fields
      requiredFields.forEach(field => {
        if (!field.value.trim()) { // Check if the field is empty
            console.log(`Field ${field.id} is empty`);
            field.style.border = '2px solid red'; // Highlight with red border
            const errorMessageElement = document.getElementById(field.id + 'Error');
            if (errorMessageElement) {
                errorMessageElement.textContent = `Please fill the ${field.id.replace(/([A-Z])/g, ' $1').toLowerCase()}.`; // Set specific error message
                errorMessageElement.style.display = 'block'; // Show error message
            }
            if (!firstInvalidField) {
                firstInvalidField = field; // Store the first invalid field
            }
            isValid = false;
        }
    });
    
        // Validate password (at least one uppercase letter, one number, and one special character)
        const passwordField = document.getElementById('password');
        if (passwordField) {
            const passwordValue = passwordField.value.trim();
            const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).{1,}$/; // Regex for password validation
            if (!passwordRegex.test(passwordValue)) {
                passwordField.style.border = '2px solid red'; // Highlight with red border
                const errorMessageElement = document.getElementById('passwordError');
                if (errorMessageElement) {
                    errorMessageElement.textContent = 'Password must contain at least one uppercase letter, one number, and one special character.'; // Set error message
                    errorMessageElement.style.display = 'block'; // Show error message
                }
                if (!firstInvalidField) {
                    firstInvalidField = passwordField;
                }
                isValid = false;
            }
        }
    
        const aadharInput = document.getElementById('aadharNumber');
        const aadharError = document.getElementById('aadharError');
        const aadharValue = aadharInput.value.trim();
        aadharError.style.display = 'none'; // Reset error message
        aadharError.textContent = '';

        if (!/^\d{12}$/.test(aadharValue)) {
            aadharError.textContent = 'Please enter a valid 12-digit Aadhaar number.';
            aadharError.style.display = 'block';
            isValid = false; // Indicate validation failure
        }                  
            // Validate PAN number (10 alphanumeric)
        const panField = document.getElementById('panNumber');
        if (panField && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(panField.value.trim().toUpperCase())) {
            panField.style.border = '2px solid red';
            const errorMessageElement = document.getElementById('panNumberError');
            if (errorMessageElement) {
                errorMessageElement.textContent = 'Invalid PAN number format.'; // Set error message
                errorMessageElement.style.display = 'block'; // Show error message
            }
            if (!firstInvalidField) {
                firstInvalidField = panField;
            }
            isValid = false;
        }
    
        // Validate Bank Account number (minimum 9 digits)
        const bankAccountField = document.getElementById('bankAccountNumber');
        if (bankAccountField && !/^\d{9,}$/.test(bankAccountField.value.trim())) {
            bankAccountField.style.border = '2px solid red';
            const errorMessageElement = document.getElementById('bankAccountNumberError');
            if (errorMessageElement) {
                errorMessageElement.textContent = 'Bank Account number must be at least 9 digits.'; // Set error message
                errorMessageElement.style.display = 'block'; // Show error message
            }
            if (!firstInvalidField) {
                firstInvalidField = bankAccountField;
            }
            isValid = false;
        }
    
        // Validate UAN number (12 digits)
        const uanField = document.getElementById('uanNumber');
        if (uanField && !/^\d{12}$/.test(uanField.value.trim())) {
            uanField.style.border = '2px solid red';
            const errorMessageElement = document.getElementById('uanNumberError');
            if (errorMessageElement) {
                errorMessageElement.textContent = 'UAN number must be 12 digits.'; // Set error message
                errorMessageElement.style.display = 'block'; // Show error message
            }
            if (!firstInvalidField) {
                firstInvalidField = uanField;
            }
            isValid = false;
        }
    
        // Validate PF number (alphanumeric)
        const pfField = document.getElementById('pfNumber');
        if (pfField && !/^[a-zA-Z0-9]+$/.test(pfField.value.trim())) {
            pfField.style.border = '2px solid red';
            const errorMessageElement = document.getElementById('pfNumberError');
            if (errorMessageElement) {
                errorMessageElement.textContent = 'PF number must be alphanumeric.'; // Set error message
                errorMessageElement.style.display = 'block'; // Show error message
            }
            if (!firstInvalidField) {
                firstInvalidField = pfField;
            }
            isValid = false;
        }
    
        // Focus on the first invalid field
        if (firstInvalidField) {
            firstInvalidField.focus();
        }
    
        return isValid;
    }
    
           // Function to validate both employee number and office email uniqueness
    function validateEmployeeNumberAndEmail() {
        const employeeNumberField = document.getElementById('employeeNumber');
        const emailField = document.getElementById('officeEmail');
        const employeeNumberErrorElement = document.getElementById('employeeNumberError');
        const emailErrorElement = document.getElementById('officeEmailError');

        return new Promise((resolve, reject) => {
            const employeeNumber = employeeNumberField?.value.trim();
            const officeEmail = emailField?.value.trim();

            // Clear previous error messages
            employeeNumberField.style.border = '';
            emailField.style.border = '';
            employeeNumberErrorElement.style.display = 'none';
            emailErrorElement.style.display = 'none';

            // Only validate if the employee number and email have values
            if (!employeeNumber && !officeEmail) {
                resolve(true);  // If both fields are empty, consider it valid
                return;
            }

            // Validate employee number and email
            fetch(`http://172.16.2.6:4000/users?employeeNumber=${encodeURIComponent(employeeNumber)}&officeEmail=${encodeURIComponent(officeEmail)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                console.log('response ', response)
                if (!response.ok) {
                    console.error(`HTTP error! status: ${response.status}`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                let isValid = true;

                // Validate if employee number exists
                if (data.employeeNumberExists) {
                    employeeNumberField.style.border = '2px solid red';
                    employeeNumberErrorElement.textContent = 'Employee number already exists.';
                    employeeNumberErrorElement.style.display = 'block';
                    isValid = false;
                }

                // Validate if office email exists
                if (data.officeEmailExists) {
                    emailField.style.border = '2px solid red';
                    emailErrorElement.textContent = 'Office email already exists.';
                    emailErrorElement.style.display = 'block';
                    isValid = false;
                }

                resolve(isValid);  // Resolve the promise with validation result
            })
            .catch(error => {
                console.error('Error validating employee number and email:', error);
                employeeNumberErrorElement.textContent = 'Error occurred during validation. Please try again.';
                emailErrorElement.textContent = 'Error occurred during validation. Please try again.';
                employeeNumberErrorElement.style.display = 'block';
                emailErrorElement.style.display = 'block';
                reject(error);
            });
        });
    }

    // Form submission logic with validation for employee number and email
    document.getElementById('employeeForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Always prevent default submission

        if (validateForm()) {
            validateEmployeeNumberAndEmail().then(employeeNumberAndEmailIsValid => {
                if (employeeNumberAndEmailIsValid) {
                    // If both form and employee number/email are valid, submit the form
                    postEmployeeDetails(event);
                }
            }).catch(error => {
                console.error('Error during employee number and email validation:', error);
            });
        }
    });

    // Update confirmation date based on date of joining and probation period
    function updateConfirmationDate() {
        const dateOfJoiningInput = document.getElementById('dateOfJoining');
        const probationPeriodInput = document.getElementById('probationPeriod');
        const confirmationDateInput = document.getElementById('confirmationDate');

        const dateOfJoining = new Date(dateOfJoiningInput?.value);
        const probationPeriod = parseInt(probationPeriodInput?.value, 10);

        if (!isNaN(dateOfJoining.getTime()) && !isNaN(probationPeriod) && probationPeriod >= 0) {
            const confirmationDate = new Date(dateOfJoining);
            confirmationDate.setDate(confirmationDate.getDate() + probationPeriod);
            confirmationDateInput.value = confirmationDate.toISOString().split('T')[0];
        } else {
            confirmationDateInput.value = '';
        }
    }

    // Function to post employee details to the backend
    function postEmployeeDetails(event) {
        event.preventDefault(); // Prevent form submission reload

        if (!validateForm()) {
            console.log("Form validation failed");
            return;  // Stop submission if validation fails
        }

        const token = getCookie('authToken');
        if (!token || isTokenExpired(token)) {
            console.log("Token expired or invalid.");
            alert('Session has expired. Please log in again.');
            return;
        }

        // Gather employee details from the form
        const employeeDetails = {
            employeeNumber: document.getElementById('employeeNumber')?.value || '',
            fullName: `${document.getElementById('firstName')?.value || ''} ${document.getElementById('lastName')?.value || ''}`,
            dateOfJoining: document.getElementById('dateOfJoining')?.value || '',
            employmentType: document.getElementById('workType')?.value || '',
            probationPeriod: document.getElementById('probationPeriod')?.value || '',
            confirmationDate: document.getElementById('confirmationDate')?.value || '',
            department: document.getElementById('department')?.value || '',
            designation: document.getElementById('designation')?.value || '',
            reportingTo: document.getElementById('reportsTo')?.value || '',
            workLocation: document.getElementById('workLocation')?.value || '',
            role: document.getElementById('roleName')?.value || '',
            companyName: document.getElementById('company')?.value || '',
            officeEmail: document.getElementById('officeEmail')?.value || '',
            enterPassword: document.getElementById('password')?.value || '',
            salaryCTC: document.getElementById('annual_ctc')?.value || '',
            grade: document.getElementById('grade')?.value || '',
            personalEmail: document.getElementById('personal_Email')?.value || '',
            mobile: document.getElementById('mobileNo')?.value || '',
            currentAddress: document.getElementById('currentAddress')?.value || '',
            permanentAddress: document.getElementById('permanentAddress')?.value || '',
            maritalStatus: document.getElementById('status')?.value || '',
            aadharNumber: document.getElementById('aadharNumber')?.value || '',
            panNumber: document.getElementById('panNumber')?.value || '',
            pfNumber: document.getElementById('pfNumber')?.value || '',
            uanNumber: document.getElementById('uanNumber')?.value || '',
            bankAccountNumber: document.getElementById('bankAccountNumber')?.value || '',
            bankName: document.getElementById('bankName')?.value || '',
            active: true
        };
        console.log("Employee Details:", employeeDetails)
        fetch('http://172.16.2.6:4000/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
          body: JSON.stringify(employeeDetails),
        })
        .then(response => {
            console.log('response ', response)
            if (response.status === 400) {
                // Custom handling for duplicate employee number or email
                return response.json().then(errorData => {
                    throw new Error(errorData.message || 'Employee number or office email already exists.');
                });
            }
            if (!response.ok) {
                console.error(`HTTP error! status: ${response.status}`);
                throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Employee data successfully submitted:', data);
            alert('Employee data successfully submitted');
        })
        .catch(error => {
            if (error.message.includes('already exists')) {
                // Handle case when employee number or email already exists
                alert('Error: Employee number or office email already exists.');
            } else {
                console.error('Error submitting employee data:', error);
                alert('Failed to submit data. Please try again.');
            }
        });
    }

      // Event listener for the form submission
    const form = document.getElementById('employeeForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Get the token and check if it's expired
        const token = getCookie('token');
        if (!token || isTokenExpired(token)) {
            alert('Session expired. Please log in again.'); // Alert user about expiration
            return; // Prevent form submission if token is expired
        }

        // Validate the form
        if (validateForm()) {
            form.submit(); // Submit the form if valid
        }
    });

   // Add event listeners for submit and edit buttons
   const submitButton = document.getElementById('submitButton');
   const editButton = document.getElementById('editButton');
   const employeeForm = document.getElementById('employeeForm');

   if (submitButton) {
       submitButton.addEventListener('click', postEmployeeDetails);
   }
   if (editButton) {
       editButton.addEventListener('click', editEmployeeDetails);
   }
   if (employeeForm) {
       employeeForm.addEventListener('submit', postEmployeeDetails);
   }

   // Watch for changes on date of joining and probation period
   if (document.getElementById('dateOfJoining')) {
       document.getElementById('dateOfJoining').addEventListener('change', updateConfirmationDate);
   }
   if (document.getElementById('probationPeriod')) {
       document.getElementById('probationPeriod').addEventListener('change', updateConfirmationDate);
   }
});
  // Add the event listener for form submission
  document.getElementById('employeeForm').addEventListener('submit', function(event) {
   if (!validateForm()) {
       event.preventDefault(); // Prevent form submission if validation fails
   }
});

// Update the form submission event listener
document.getElementById('employeeForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Always prevent default submission

    validateForm().then(formIsValid => {
        if (formIsValid) {
            validateEmployeeNumber().then(employeeNumberIsValid => {
                if (employeeNumberIsValid) {
                    // If both form and employee number are valid, submit the form
                    postEmployeeDetails(event);
                }
            }).catch(error => {
                console.error('Error during employee number validation:', error);
            });
        }
    });
});



const toggleButton = document.getElementById('toggle-button');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('main-content');

toggleButton.addEventListener('click', () => {
  sidebar.classList.toggle('sidebar-hidden');
  mainContent.classList.toggle('ml-0');
});



document.addEventListener("DOMContentLoaded", function() {
  const menuItems = document.querySelectorAll(".sidebar a");

  menuItems.forEach(item => {
    item.addEventListener("click", function() {
      // Remove active class from all menu items
      menuItems.forEach(i => i.classList.remove("active"));
      // Add active class to the clicked menu item
      this.classList.add("active");
    });
  });
});

