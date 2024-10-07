// Function to display a greeting based on the time of day and user role
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
        const response = await fetch('http://172.16.2.6:4000/users');
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
// Check if the user is logged in on page load
document.addEventListener('DOMContentLoaded', function () {
    const fullName = sessionStorage.getItem('fullName');
    
    // Redirect to login page if no user is logged in
    if (!fullName) {
        console.log('No user logged in. Redirecting to login page...');
        window.location.href = '../HTML/login.html';
    } else {
        console.log('User is logged in:', fullName);
        // Display greeting and quote if user is logged in
        displayGreeting();
        displayQuote();
    }
});

// Logout button functionality
document.addEventListener('DOMContentLoaded', function () {
    const logoutButton = document.querySelector('.logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Logging out...');
            // Clear sessionStorage and redirect to login
            sessionStorage.clear();
            window.location.href = '../HTML/login.html';
        });
    } else {
        console.warn('Logout button not found.');
    }
});

// Prevent navigating back to the previous page after logout
window.onpopstate = function () {
    if (!sessionStorage.getItem('fullName')) {
        window.location.href = '../HTML/login.html';
    }
};
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


