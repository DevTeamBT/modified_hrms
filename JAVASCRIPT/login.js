async function loginUser(event) {
    event.preventDefault();

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginButton = document.querySelector('button[type="submit"]');
    const resultElement = document.getElementById('result');
    const officeEmail = emailInput.value.trim();
    const enterPassword = passwordInput.value.trim();

    // Clear previous error classes
    emailInput.classList.remove('is-invalid');
    passwordInput.classList.remove('is-invalid');
    loginButton.disabled = true;  // Disable button to prevent multiple submissions

    // Email validation for @bodhtree.com
    const emailPattern = /^[a-zA-Z0-9._%+-]+@bodhtree\.com$/;
    if (!emailPattern.test(officeEmail)) {
        showAlert('Invalid email format. Use a @bodhtree.com email.', 'danger');
        emailInput.classList.add('is-invalid');
        emailInput.focus();
        loginButton.disabled = false;
        return;
    }

    // Password validation (minimum 8 characters, at least one number and one special character)
    const passwordPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordPattern.test(enterPassword)) {
        showAlert('Password must be at least 8 characters long and include at least one number and one special character.', 'danger');
        passwordInput.classList.add('is-invalid');
        passwordInput.focus();
        loginButton.disabled = false;
        return;
    }

    // Show a loading indicator
    resultElement.innerText = 'Logging in...';

    try {
        console.log('Attempting to log in with:', { email: officeEmail, password: enterPassword });
        const response = await fetch('http://172.16.2.6:4000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ officeEmail, enterPassword }),
        });

        if (response.ok) {
            const result = await response.json();
            console.log('API Response:', result);

            // Check if user and roleName are defined
            if (!result.user || !result.user.roleName) {
                console.error('Login response does not contain user or role');
                resultElement.innerText = 'Login failed: invalid response format.';
                return;
            }

            // Check if userId and fullName are available
            if (result.user._id === undefined || result.user.fullName === undefined) {
                console.error('Missing userId or fullName in the response');
                resultElement.innerText = 'Login failed: missing user details.';
                return;
            }

            // Successful login
            const token = result.token;
            if (!token) {
                console.error('Token is undefined in the response');
                resultElement.innerText = 'Login failed: token not received.';
                return;
            }
            console.log('Login successful, token:', token);

            // Decode the token to get the expiration time
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expirationTime = payload.exp * 1000;

            // Set the cookie with expiration
            document.cookie = `authToken=${token}; path=/; expires=${new Date(expirationTime).toUTCString()}; SameSite=None; Secure`;
            localStorage.setItem('loggedInUser', JSON.stringify(result.user));
            sessionStorage.setItem('userId', result.user._id);
            sessionStorage.setItem('fullName', result.user.fullName);

            const userRole = result.user.roleName;
            switch (userRole) {
                case 'admin':
                    window.location.replace('/HTML/admin.html');
                    break;
                case 'employee':
                    window.location.replace('/HTML/employee.html');
                    break;
                case 'manager':
                    window.location.replace('/HTML/manager.html');
                    break;
                case 'superadmin':
                    window.location.replace('/HTML/superadmin.html');
                    break;
                default:
                    resultElement.innerText = 'Invalid role';
            }
        } else {
            if (response.status === 401) {
                showAlert('Incorrect email or password. Please try again.', 'danger');
            } else {
                const errorText = await response.text();
                showAlert('Login failed. Please try again later.', 'danger');
                console.error('Login failed:', errorText);
            }
        }
    } catch (error) {
        console.error('Error during login:', error);
        showAlert('An error occurred during login. Please try again later.', 'danger');
    } finally {
        loginButton.disabled = false;
    }
}

window.addEventListener('load', function () {
    // Add a new entry to the browser's history
    window.history.pushState(null, null, window.location.href);

    // Listen for the popstate event
    window.addEventListener('popstate', function () {
        window.history.pushState(null, null, window.location.href);
    });
});

// Function to display alerts
function showAlert(message, type) {
    const alertContainer = document.getElementById('alert-container');
    alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
}
