async function loginUser(event) {
    event.preventDefault();

    const emailInput = document.getElementById('email').value.trim();
    const passwordInput = document.getElementById('password').value.trim();
    const resultElement = document.getElementById('result'); 

    // Validate input fields
    if (!emailInput || !passwordInput) {
        resultElement.innerText = 'Email and password are required.';
        return;
    }

    // Optionally show a loading indicator
    resultElement.innerText = 'Logging in...';

    try {
        const response = await fetch('http://172.16.2.6:4000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ officeEmail: emailInput, enterPassword: passwordInput }),
        });

        if (response.ok) {
            const result = await response.json();
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
            resultElement.innerText = 'Login successful';
            localStorage.setItem('loggedInUser', JSON.stringify(result.user));
            sessionStorage.setItem('userId', result.user._id);  // Corrected field
            sessionStorage.setItem('fullName', result.user.fullName);  // Corrected field


            const userRole = result.user.roleName;
            switch (userRole) {
                case 'admin':
                    window.location.replace('/HTML/hr.html');
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
            const errorText = await response.text(); // Read response as plain text
            resultElement.innerText = 'Invalid email or password';
            console.error('Login failed:', errorText);
        }
    } catch (error) {
        console.error('Error during login:', error);
        resultElement.innerText = 'An error occurred during login. Please try again later.';
    } finally {
        // Optionally hide the loading indicator
    }
}
window.addEventListener('load', function () {
    // Add a new entry to the browser's history
    window.history.pushState(null, null, window.location.href);

    // Listen for the popstate event, which is triggered by the back button
    window.addEventListener('popstate', function () {
        // Each time the back button is pressed, push the current state again
        window.history.pushState(null, null, window.location.href);
    });
});
