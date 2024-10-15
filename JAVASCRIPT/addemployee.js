function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }
    return null;
}

function decodeJWT(token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload;
    } catch (error) {
        console.error('Failed to decode JWT token:', error);
        return null;
    }
}

function updateConfirmationDate() {
    const dateOfJoiningInput = document.getElementById('dateOfJoining');
    const probationPeriodInput = document.getElementById('probationPeriod');
    const confirmationDateInput = document.getElementById('confirmationDate');

    const dateOfJoining = new Date(dateOfJoiningInput.value);
    const probationPeriod = parseInt(probationPeriodInput.value, 10);

    if (!isNaN(dateOfJoining.getTime()) && !isNaN(probationPeriod) && probationPeriod >= 0) {
        const confirmationDate = new Date(dateOfJoining);
        confirmationDate.setDate(confirmationDate.getDate() + probationPeriod);
        confirmationDateInput.value = confirmationDate.toISOString().split('T')[0];
    } else {
        confirmationDateInput.value = '';
    }
}

document.getElementById('dateOfJoining')?.addEventListener('change', updateConfirmationDate);
document.getElementById('probationPeriod')?.addEventListener('change', updateConfirmationDate);

function postEmployeeDetails(event) {
    event.preventDefault();

    const token = getCookie('authToken');
    if (!token) {
        alert('Authorization failed. Please log in again.');
        return;
    }

    const payload = decodeJWT(token);
    if (!payload || payload.exp < Date.now() / 1000) {
        alert('Session has expired. Please log in again.');
        return;
    }

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
        aadhaarNumber: document.getElementById('aadhaarNumber')?.value || '',
        panNumber: document.getElementById('panNumber')?.value || '',
        pfNumber: document.getElementById('pfNumber')?.value || '',
        uanNumber: document.getElementById('uanNumber')?.value || '',
        bankAccountNumber: document.getElementById('bankAccountNumber')?.value || '',
        bankName: document.getElementById('bankName')?.value || '',
        active: true
    };

    const photoInput = document.getElementById('photo');
    const photoFile = photoInput?.files[0] || null;

    fetch('http://172.16.2.6:4000/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(employeeDetails),
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Unauthorized: Your session may have expired or you lack necessary permissions.');
            }
            return response.text().then(text => { throw new Error(text); });
        }
        return response.json();
    })
    .then(data => {
        const userId = data._id;

        if (photoFile) {
            const photoFormData = new FormData();
            photoFormData.append('photo', photoFile);

            return fetch(`http://172.16.2.6:4000/upload/photo/${userId}`, {
                method: 'POST',
                body: photoFormData,
                headers: { 'Authorization': `Bearer ${token}` }
            });
        }
        return Promise.resolve({ ok: true, json: () => ({ message: 'No photo uploaded' }) });
    })
    .then(photoResponse => {
        if (!photoResponse.ok) {
            return photoResponse.text().then(text => { throw new Error(`Photo upload failed: ${text}`); });
        }
        return photoResponse.json();
    })
    .then(photoData => {
        alert('Employee details submitted successfully!');
        nextStep();
    })
    .catch(error => {
        alert('Error: ' + error.message);
        if (error.message.includes('Unauthorized')) {
            window.location.href = '/login';
        }
    });
}

function nextStep() {
    console.log('Proceeding to the next step...');
}

function editEmployeeDetails(event) {
    event.preventDefault();
    const inputs = document.querySelectorAll('#employeeForm input, #employeeForm select');
    inputs.forEach(input => input.removeAttribute('readonly'));

    const editButton = document.getElementById('editButton');
    if (editButton) {
        editButton.style.display = 'none';
    }
}

document.getElementById('submitButton')?.addEventListener('click', postEmployeeDetails);
document.getElementById('editButton')?.addEventListener('click', editEmployeeDetails);
document.getElementById('employeeForm')?.addEventListener('submit', postEmployeeDetails);
