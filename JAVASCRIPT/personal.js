document.addEventListener('DOMContentLoaded', function() {
    fetchEmployeeData();
});

function fetchEmployeeData() {
    // Fetch user ID from a reliable source, e.g., the logged-in user's profile
    const userId = getUserId(); // Implement this function to get the actual user ID

    if (!userId) {
        displayErrorMessage('User ID is not available.');
        return;
    }

    // Use the userId variable to build the API URL
    const apiUrl = `http://172.16.2.6:4000/api/users/${userId}`; // Ensure this URL is correct
    console.log('Fetching employee data for user ID:', userId);
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                // Log the response status for debugging
                console.error('Response status:', response.status);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Oops! We haven't received a valid JSON response.");
            }
            return response.json();
        })
        .then(data => {
            if (data && typeof data === 'object') {
                displayEmployeeData([data]); // Wrap data in an array for consistent handling
            } else {
                throw new Error('Unexpected data structure received.');
            }
        })
        .catch(error => {
            console.error('Error fetching employee data:', error.message);
            displayErrorMessage(error.message);
        });
}

function getUserId() {
    // Implement this function to retrieve the user ID from the session, a cookie, or another method
    return sessionStorage.getItem('userId'); // Replace with logic to obtain the actual user ID
}

function displayEmployeeData(employees) {
    const tableBody = document.querySelector('#employeeTable tbody');
    tableBody.innerHTML = '';

    employees.forEach(employee => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${employee.employeeNumber || '-'}</td>
            <td>${employee.fullName || '-'}</td>
            <td>${employee.designation || '-'}</td>
            <td>${employee.department || '-'}</td>
            <td>${employee.reportsTo || '-'}</td>
            <td>${employee.dateOfJoining || '-'}</td>
            <td>${employee.officeEmail || '-'}</td>
            <td>${employee.workLocation || '-'}</td>
            <td>${employee.probationPeriod || '-'}</td>
            <td>${employee.confirmationDate || '-'}</td>
            <td>${employee.status || '-'}</td>
            <td>${employee.panNumber || '-'}</td>
            <td>${employee.bankName || '-'}</td>
            <td>${employee.bankAccountNumber || '-'}</td>
            <td>${employee.aadharNumber || '-'}</td>
            <td>${employee.active ? 'Yes' : 'No'}</td>
            <td>${employee.roleName || '-'}</td>
            <td>${employee.shiftTiming || '-'}</td>
            <td>${employee.leaveBalance || '-'}</td>
        `;
        tableBody.appendChild(row);
    });
}

function displayErrorMessage(message) {
    const tableBody = document.querySelector('#employeeTable tbody');
    tableBody.innerHTML = `
        <tr>
            <td colspan="20" class="text-center">Error loading employee data: ${message}. Please try again later or contact support.</td>
        </tr>
    `;
}