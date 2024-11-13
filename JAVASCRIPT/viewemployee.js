// Utility function to get the token from cookies
function getCookie(name) {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + '=')) {
          return cookie.substring(name.length + 1);
      }
  }
  return null; // Return null if the cookie doesn't exist
}

// Corrected function to check token from cookie
function checkToken() {
  // Attempt to get the correct 'authToken' from cookies
  let token = getCookie('authToken'); // Correct cookie name here
  
  // Debugging: Log cookies and token value
  console.log('All cookies:', document.cookie);
  console.log('Token from cookies:', token);
  
  // If the token is not found in cookies, try localStorage as a fallback
  if (!token) {
      console.log('Token not found in cookies. Trying localStorage...');
      token = localStorage.getItem('token');
  }

  console.log('Token found:', token);
  return token;
}

document.addEventListener('DOMContentLoaded', function () {
  const employeeTableBody = document.getElementById('employeeTable').getElementsByTagName('tbody')[0];
  const rowsPerPage = 10; // Adjust the number of rows per page
  let currentPage = 1; // Start at page 1
  let totalPages = 0; // Total pages

  // Function to fetch employee details from the API
  async function fetchEmployeeDetails() {
      const apiUrl = `http://172.16.2.6:4000/users?page=${currentPage}`;
      console.log('Fetching data from URL:', apiUrl); // Log the URL being fetched

      try {
          const response = await fetch(apiUrl);
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          console.log('Data received from API:', data); // Log the entire response data

          // Check if the API response has the expected structure
          if (data && data.users) {
              const employees = data.users || [];
              totalPages = data.totalPages || 0; // Store total pages from response
              console.log('Parsed employees array:', employees); // Log the employees array
              console.log('Total pages:', totalPages); // Log total pages for debugging

              renderTable(employees);
              updatePaginationInfo();
          } else {
              console.error('Unexpected data structure:', data);
          }
      } catch (error) {
          console.error('Error fetching employee details:', error);
      }
  }

  // Function to render the employee table
  function renderTable(employees) {
      employeeTableBody.innerHTML = ''; // Clear current table body

      // Populate table rows for the current page's employees
      employees.forEach(employee => {
          const row = employeeTableBody.insertRow();
          row.setAttribute('data-id', employee._id);

          // Insert employee details into cells
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
          row.insertCell(12).innerText = employee.panNumber;
          row.insertCell(13).innerText = employee.bankName;
          row.insertCell(14).innerText = employee.bankAccountNumber;
          row.insertCell(15).innerText = employee.aadharNumber;
          row.insertCell(16).innerText = employee.active;
          row.insertCell(17).innerText = employee.roleName;

          // Display shift timing and leave balance
          const shiftTiming = employee.shiftTiming.map(shift => `Start: ${shift.startTime}, End: ${shift.endTime}`).join('<br>');
          row.insertCell(18).innerHTML = shiftTiming;

          const leaveBalance = `
              Annual Leave: ${employee.leaveBalance.annualLeave}<br>
              Casual Leave: ${employee.leaveBalance.casualLeave}<br>
              Maternity Leave: ${employee.leaveBalance.maternityLeave}<br>
              Paternity Leave: ${employee.leaveBalance.paternityLeave}<br>
              Sick Leave: ${employee.leaveBalance.sickLeave}
          `;
          row.insertCell(19).innerHTML = leaveBalance;

          const actionsCell = row.insertCell(20);
          const editButton = document.createElement('button');
          editButton.innerText = 'Edit';
          editButton.classList.add('btn', 'btn-primary', 'btn-sm', 'me-2');
          actionsCell.appendChild(editButton);

          const saveButton = document.createElement('button');
          saveButton.innerText = 'Save';
          saveButton.classList.add('btn', 'btn-success', 'btn-sm');
          saveButton.style.display = 'none';
          actionsCell.appendChild(saveButton);

          // Edit functionality
          editButton.addEventListener('click', () => {
              for (let i = 1; i < row.cells.length - 1; i++) {
                  const cell = row.cells[i];
                  const currentValue = cell.innerText;
                  const input = document.createElement('input');
                  input.type = 'text';
                  input.value = currentValue;
                  input.classList.add('form-control', 'form-control-sm');
                  cell.innerText = '';
                  cell.appendChild(input);
              }
              editButton.style.display = 'none';
              saveButton.style.display = 'inline';
          });

          // Save functionality
          saveButton.addEventListener('click', async () => {
              const token = checkToken();
              if (!token) {
                  console.error('No token found. Please log in.');
                  alert('Your session has expired. Please log in again.');
                  return;
              }

              const updatedData = {
                  fullName: row.cells[1].querySelector('input').value,
                  designation: row.cells[2].querySelector('input').value,
                  department: row.cells[3].querySelector('input').value,
                  reportsTo: row.cells[4].querySelector('input').value,
                  dateOfJoining: row.cells[5].querySelector('input').value,
                  officeEmail: row.cells[6].querySelector('input').value,
                  workLocation: row.cells[7].querySelector('input').value,
                  employeeNumber: row.cells[8].querySelector('input').value,
                  probationPeriod: row.cells[9].querySelector('input').value,
                  confirmationDate: row.cells[10].querySelector('input').value,
                  status: row.cells[11].querySelector('input').value,
                  panNumber: row.cells[12].querySelector('input').value,
                  bankName: row.cells[13].querySelector('input').value,
                  bankAccountNumber: row.cells[14].querySelector('input').value,
                  aadharNumber: row.cells[15].querySelector('input').value,
                  active: row.cells[16].querySelector('input').value,
                  roleName: row.cells[17].querySelector('input').value
              };

              editButton.style.display = 'inline';
              saveButton.style.display = 'none';

              const employeeId = row.getAttribute('data-id');
              const updateUrl = `http://172.16.2.6:4000/employee/${employeeId}`;

              try {
                  const response = await fetch(updateUrl, {
                      method: 'PATCH',
                      headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`
                      },
                      body: JSON.stringify(updatedData)
                  });

                  if (!response.ok) {
                      throw new Error(`HTTP error! Status: ${response.status}`);
                  }

                  console.log('Employee data updated successfully!');
              } catch (error) {
                  console.error('Error updating employee data:', error);
              }
          });
      });

      updatePaginationInfo(); // Update pagination information
  }

  // Function to update pagination info on the UI
  function updatePaginationInfo() {
      document.getElementById('pageInfo').innerText = `Page ${currentPage} of ${totalPages}`;
      document.getElementById('prevPage').disabled = currentPage === 1;
      document.getElementById('nextPage').disabled = currentPage === totalPages;
  }

  // Handle previous and next page button clicks
  document.getElementById('prevPage').addEventListener('click', () => {
      if (currentPage > 1) {
          currentPage--;
          fetchEmployeeDetails();
      }
  });

  document.getElementById('nextPage').addEventListener('click', () => {
      if (currentPage < totalPages) {
          currentPage++;
          fetchEmployeeDetails();
      }
  });

  // Initial fetch of employee details
  fetchEmployeeDetails();
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

