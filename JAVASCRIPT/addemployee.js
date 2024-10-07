// Function to post employee details
function postEmployeeDetails(event) {
    console.log('Form submission initiated'); 
    event.preventDefault(); // Prevent default form submission
   
    console.log('Default form submission prevented.');

    const token = localStorage.getItem('authToken'); // Retrieve token from localStorage

    if (!token) {
        console.error('No token found, authorization denied.');
        alert('Authorization failed. Please log in again.');
        return;
    }

    console.log('Authorization Token:', token);

    // Mock token generator (since there was an error previously)
    // const token = Math.random().toString(36).substring(2); // Simple token generation for example purposes

    // Gather input values
    const firstName = document.getElementById('firstName').value.trim(); // Trim to avoid unnecessary spaces
    const lastName = document.getElementById('lastName').value.trim();
    const fullName = `${firstName} ${lastName}`; // Combine first and last names
  // Collecting the required fields
  const officeEmail = document.getElementById('officeEmail').value.trim(); // Ensure this field is collected
  const enterPassword = document.getElementById('password').value.trim(); // Ensure this field is collected
  if (!officeEmail || !enterPassword) {
    console.error("Office Email and Password are required.");
    return; // Stop if required fields are not present
}
   
    // Create employee details object
    const employeeDetails = {
        fullName: fullName,
        officeEmail: officeEmail,
        enterPassword: enterPassword, // Send full name to the server
        dateOfJoining: document.getElementById('dateOfJoining').value,
        employmentType: document.getElementById('workType').value,
        probationPeriod: document.getElementById('probationPeriod').value,
        confirmationDate: document.getElementById('confirmationDate').value,
        department: document.getElementById('department').value,
        designation: document.getElementById('designation').value,
        reportingTo: document.getElementById('reportsTo').value,
        workLocation: document.getElementById('workLocation').value,
        // officeEmail: document.getElementById('officeEmail').value='',
        // enterPassword:document.getElementById('password').value='',
        role: document.getElementById('roleName').value,
        salary: document.getElementById('annual_ctc').value,
        grade: document.getElementById('grade').value,
        mobile: document.getElementById('mobileNo').value,
        personalEmail: document.getElementById('personal_Email').value,
        currentAddress: document.getElementById('currentAddress').value,
        permanentAddress: document.getElementById('permanentAddress').value,
        status: document.getElementById('status').value,
        aadhaarNumber: document.getElementById('aadhaarNumber').value,
        panNumber: document.getElementById('panNumber').value,
        pfNumber: document.getElementById('pfNumber').value,
        uanNumber: document.getElementById('uanNumber').value,
        bankAccountNumber: document.getElementById('bankAccountNumber').value,
        companyName: document.getElementById('company').value,
        employeeNumber: document.getElementById('employeeNumber').value,
        active: true // Set active status to true
    };
    document.getElementById('officeEmail').value = '';
    document.getElementById('password').value = '';

   

    console.log('Employee Details:', employeeDetails);
    
    // Send POST request to your server
    fetch('http://172.16.2.6:4000/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(employeeDetails),
      
    })
    .then(response => {
        console.log('Response Status:', response.status); // Log the status code
        return response.json().then(data => ({ status: response.status, body: data }));
    })
    .then(({ status, body }) => {
        if (status === 200) {
            console.log('Success:', body);
            alert('Employee details submitted successfully!');
            // Optionally, reset the form or redirect the user here
            // document.getElementById('employeeForm').reset(); // Uncomment to reset the form
        } else {
            console.error('Error in submission:', body);
            alert('Failed to submit employee details. Please check the details and try again.');
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        alert('An error occurred while submitting employee details. Please try again.');
    });
}

// Wait for the DOM content to load
document.addEventListener('DOMContentLoaded', () => {
    // Attach event listener to form submit
    document.body.addEventListener('submit', (event) => {
        if (event.target && event.target.id === 'employeeForm') {
            postEmployeeDetails(event);
        }
    });
});
// Get all sidebar links
const links = document.querySelectorAll('.sidebar a');

// Function to remove 'active' class from all links
function removeActiveClasses() {
  links.forEach(link => link.classList.remove('active'));
}

// Function to set active link based on current URL
function setActiveLink() {
  links.forEach(link => {
    // Compare the link's href with the current URL
    if (link.href === window.location.href) {
      link.classList.add('active');
    }
  });
}

// Add click event listener to all links
links.forEach(link => {
  link.addEventListener('click', function(event) {
    event.preventDefault();
    // Remove 'active' class from all links
    removeActiveClasses();

    // Add 'active' class to the clicked link
    this.classList.add('active');

    // Navigate to the clicked link's URL
    window.location.href = this.href;
  });
});

// On page load, set the active link based on the current URL
window.addEventListener('load', setActiveLink);
