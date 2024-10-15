document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'http://172.16.2.6:4000/users';
    const employeeTableBody = document.getElementById('employeeTable').getElementsByTagName('tbody')[0];

    // Function to fetch employee details
    async function fetchEmployeeDetails() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const employees = await response.json();
            populateEmployeeTable(employees);
        } catch (error) {
            console.error('Error fetching employee details:', error);
        }
    }

    // Function to populate the employee table
    function populateEmployeeTable(employees) {
        employees.forEach(employee => {
            const row = employeeTableBody.insertRow();

            // Insert data into the row, ensuring unique cell indices
            row.insertCell(0).innerText = employee._id;
            row.insertCell(1).innerText = employee.fullName;
            row.insertCell(2).innerText = employee.designation;
            row.insertCell(3).innerText = employee.department;
            row.insertCell(4).innerText = employee.reportsTo;
            row.insertCell(5).innerText = employee.dateOfJoining;
            row.insertCell(6).innerText = employee.officeEmail;
            row.insertCell(7).innerText = employee.workLocation;
            row.insertCell(8).innerText = employee.employeeNumber;
            row.insertCell(9).innerText = employee.probationPeriod;
            row.insertCell(10).innerText = employee.confirmationDate;
            row.insertCell(11).innerText = employee.status;
            // row.insertCell(12).innerText = '';
            row.insertCell(12).innerText = employee.panNumber;
            row.insertCell(13).innerText = employee.bankName;
            row.insertCell(14).innerText = employee.bankAccountNumber;
            row.insertCell(15).innerText = employee.aadharNumber;
            row.insertCell(16).innerText = employee.active;
            row.insertCell(17).innerText = employee.roleName;
         



            // row.insertCell(5).innerText = employee.mobileNo; 
            // row.insertCell(9).innerText = employee.bloodGroup;
            // row.insertCell(10).innerText = employee.workType;
            // row.insertCell(11).innerText = employee.gender;
            // row.insertCell(12).innerText = employee.personal_Email;
            // row.insertCell(13).innerText = employee.native;   
            // row.insertCell(16).innerText = employee.address;
            // row.insertCell(17).innerText = employee.annual_ctc;
            // row.insertCell(19).innerText = employee.bankIfscCode;
            // row.insertCell(20).innerText = employee.company;
            // row.insertCell(22).innerText = employee.costCenter;
            // row.insertCell(23).innerText = employee.dateOfBirth;
            // row.insertCell(24).innerText = employee.division;
            // row.insertCell(25).innerText = employee.emergencyContactName;
            // row.insertCell(26).innerText = employee.emergencyContactNumber;
            // row.insertCell(27).innerText = employee.enterseries;
            // row.insertCell(28).innerText = employee.grade;
            // row.insertCell(29).innerText = employee.holidayCategory;
            // row.insertCell(30).innerText = employee.location;
            // row.insertCell(31).innerText = employee.maritalStatus;
            // row.insertCell(32).innerText = employee.nationality; 
            // row.insertCell(34).innerText = employee.paymentType;
            // row.insertCell(35).innerText = employee.pfNumber;
            // row.insertCell(36).innerText = employee.physicalChallenged;
            // row.insertCell(37).innerText = employee.shift;

            // Display shift timing
            const shiftTiming = employee.shiftTiming.map(shift => `Start: ${shift.startTime}, End: ${shift.endTime}`).join('<br>');
            row.insertCell(18).innerHTML = shiftTiming; // Insert shift timings
            
            // Adding leave balance information
            const leaveBalance = `
                Annual Leave: ${employee.leaveBalance.annualLeave}<br>
                Casual Leave: ${employee.leaveBalance.casualLeave}<br>
                Maternity Leave: ${employee.leaveBalance.maternityLeave}<br>
                Paternity Leave: ${employee.leaveBalance.paternityLeave}<br>
                Sick Leave: ${employee.leaveBalance.sickLeave}
            `;
            row.insertCell(19).innerHTML = leaveBalance; // Use innerHTML to display multiline text
        
            // Insert status and UAN number
           
            // row.insertCell(41).innerText = employee.uanNumber;
        });
    }

    fetchEmployeeDetails(); // Call the function to fetch employee details
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

