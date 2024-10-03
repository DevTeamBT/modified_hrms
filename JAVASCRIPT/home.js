// Function to display greeting
async function displayGreeting() {
    const now = new Date();
    const hours = now.getHours();
    let timeGreeting;

    if (hours < 12) {
        timeGreeting = "Good Morning";
    } else if (hours < 16) {
        timeGreeting = "Good Afternoon";
    } else {
        timeGreeting = "Good Evening";
    }

    try {
        // Fetching user data from API
        const response = await fetch('http://172.16.2.6:4000/api/users');
        if (!response.ok) {
            throw new Error('Failed to fetch user details');
        }
        
        const fullName = sessionStorage.getItem('fullName');
        const data = await response.json();
        const userRole = data.user?.roleName || 'Guest';
        const roleGreetings = {
            admin: 'Hello Admin',
            manager: 'Hello Manager',
            employee: 'Hello Employee',
            superadmin: 'Hello Superadmin',
            guest: 'Hello Guest'
        };
        const roleGreeting = roleGreetings[userRole] || 'Hello';
        document.getElementById('greeting').textContent = `${timeGreeting} ${fullName}, Welcome to Bodhtree!`;
    } catch (error) {
        console.error('Error fetching user details:', error);
        document.getElementById('greeting').textContent = `${timeGreeting}, Welcome to Bodhtree!`;
    }
}
 

// Function to display a random quote
function displayQuote() {
    const quotes = [
        "\"Strive not to be a success, but rather to be of value.\" – Albert Einstein",
        "\"The only limit to our realization of tomorrow is our doubts of today.\" – Franklin D. Roosevelt",
        "\"Life is what happens when you're busy making other plans.\" – John Lennon",
        "\"Success is not final, failure is not fatal: It is the courage to continue that counts.\" – Winston Churchill",
        "\"The purpose of our lives is to be happy.\" – Dalai Lama"
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('quote').textContent = randomQuote;
}

document.addEventListener('DOMContentLoaded', function () {
    const logoutButton = document.querySelector('.logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', function (e) {
            e.preventDefault();
            sessionStorage.clear();
            window.history.replaceState(null, null, window.location.href);
            window.location.href = '../HTML/login.html';
        });
    } else {
        console.warn('Logout button not found.');
    }
});


document.addEventListener('DOMContentLoaded', function () {
    // Check if user is logged in by checking sessionStorage
    if (!sessionStorage.getItem('fullName')) {
        // Redirect to login page if no user is logged in
        window.location.href = '../HTML/login.html';
    }
});



// Function to handle sign-in submission
// function submitSignin() {
//     const location = document.getElementById("location").value;

//     if (location) {
//         const now = new Date();
//         const signinTimeElement = document.getElementById('signin-time');
//         const messageElement = document.getElementById('message');
//         const signoutBtn = document.getElementById('signout-btn');
//         const swipesList = document.getElementById('swipes-list');

//         -- Create a sign-in entry
//         const signinEntry = `Signed in at: ${now.toLocaleTimeString()} (Location: ${location.replace('-', ' ')})`;
//         signinTimeElement.textContent = signinEntry;
//         messageElement.textContent = '';
        
//         -- Add to swipes list
//         const li = document.createElement('li');
//         li.textContent = signinEntry;
//         swipesList.appendChild(li);

//         -- Store the sign-in entry in localStorage
//         storeSwipe('signin', signinEntry);

//         signoutBtn.style.display = 'inline';
//     } else {
//         alert("Please choose a location.");
//     }
// }

// -- Function to show sign-out confirmation modal
// function showSignoutConfirmation() {
//     const modal = new bootstrap.Modal(document.getElementById('signoutConfirmationModal'));
//     modal.show();
// }

// -- Function to handle sign-out confirmation
// function confirmSignout() {
//     const now = new Date();
//     const swipesList = document.getElementById('swipes-list');

//     -- Create a sign-out entry
//     const signoutEntry = `Signed out at: ${now.toLocaleTimeString()}`;
    
//     -- Add to swipes list
//     const li = document.createElement('li');
//     li.textContent = signoutEntry;
//     swipesList.appendChild(li);

//     -- Store the sign-out entry in localStorage
//     storeSwipe('signout', signoutEntry);

//     -- Hide the sign-out button
//     const signoutBtn = document.getElementById('signout-btn');
//     signoutBtn.style.display = 'none';

//     -- Hide the sign-out confirmation modal
//     const modal = bootstrap.Modal.getInstance(document.getElementById('signoutConfirmationModal'));
//     modal.hide();

//     -- Optionally, you might want to clear the sign-in time or other session data here
//     document.getElementById('signin-time').textContent = '';
//     document.getElementById('message').textContent = '';
// }

// -- Function to store swipe entries in localStorage
// function storeSwipe(type, entry) {
//     const swipes = JSON.parse(localStorage.getItem('swipes')) || [];
//     swipes.push({ type, entry });
//     localStorage.setItem('swipes', JSON.stringify(swipes));
// }

// -- Function to load swipes from localStorage on page load
// function loadSwipes() {
//     const swipes = JSON.parse(localStorage.getItem('swipes')) || [];
//     const swipesList = document.getElementById('swipes-list');
    
//     swipes.forEach(swipe => {
//         const li = document.createElement('li');
//         li.textContent = swipe.entry;
//         swipesList.appendChild(li);
//     });
// }

// --Leave application module

// async function submitLeaveRequest(event) {
//     event.preventDefault();
//     const leaveType = document.getElementById('leave-type').value;
//     const startDate = document.getElementById('start-date').value;
//     const endDate = document.getElementById('end-date').value;
//     const reason = document.getElementById('reason').value;
//     const errorMessageElement = document.getElementById('error-message');

//     -- Clear any previous errors
//     errorMessageElement.style.display = 'none';
//     errorMessageElement.textContent = '';

//     -- Check if all fields are filled
//     if (!leaveType || !startDate || !endDate || !reason) {
//         alert('Please fill all the required fields.');
//         return;
//     }

//     -- Validate start and end date
//     if (new Date(startDate) > new Date(endDate)) {
//         errorMessageElement.textContent = 'End date cannot be earlier than start date.';
//         errorMessageElement.style.display = 'block';
//         return;
//     }

//     try {
//         const apiUrl = 'http://172.16.2.6:4000/apply/leave';
//         console.log('Submitting leave request to:', apiUrl); // Log the API URL

//         const response = await fetch(apiUrl, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 leaveType,
//                 startDate,
//                 endDate,
//                 reason,
//             }),
//         });

//         -- Handle non-OK responses
//         if (!response.ok) {
//             const errorMessage = await response.text();
//             console.error('Server responded with an error:', errorMessage);
//             errorMessageElement.textContent = `Failed to submit leave request: ${errorMessage}`;
//             errorMessageElement.style.display = 'block';
//             return;
//         }

//         const result = await response.json();

//         ---Assuming the server returns some user data, e.g., user object
//         const userData = result.user; // Adjust this based on your actual API response

//         --- Store user data in localStorage (or sessionStorage for session storage)
//         localStorage.setItem('user', JSON.stringify(userData)); // or sessionStorage.setItem() for session-based storage

//         alert('Leave request submitted successfully!');
//         document.getElementById('leaveForm').reset(); // Clear form
//     } catch (error) {
//         console.error('Error submitting leave request:', error);
//         errorMessageElement.textContent = 'Failed to submit leave request. Please try again.';
//         errorMessageElement.style.display = 'block';
//     }
// }


// Initialization
window.onload = () => {
    displayGreeting();
    displayQuote();
    // showCurrentTime();

    // const signinTime = localStorage.getItem('signinTime');
    // const workLocation = localStorage.getItem('workLocation');
    // if (signinTime && workLocation) {
    //     document.getElementById('signin-time').innerText = `You signed in at: ${signinTime} (${workLocation})`;
    //     document.getElementById('signin-btn').style.display = 'none';
    //     document.getElementById('signout-btn').style.display = 'block';
    // }
};