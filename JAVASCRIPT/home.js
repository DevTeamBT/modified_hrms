document.addEventListener('DOMContentLoaded', async () => {
    const logoutButton = document.getElementById('logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', showSignoutConfirmation);
    } else {
        console.error('Logout button not found!');
    }

    console.log('Cookies available:', document.cookie);
    const token = getTokenFromCookies('authToken');
    console.log('Token from cookies:', token);

    if (token) {
        if (checkTokenExpiration(token)) {
            alert("Session expired. Please log in again.");
            redirectToLogin();
            return;
        }

        const { userId, role } = decodeToken(token); // Use 'role' instead of 'roleName'
        console.log('User ID from token:', userId);
        console.log('User Role from token:', role);

        try {
            await loadIndex();
            loadSwipes(userId, token); // Pass userId and token
            displayGreeting(userId, role);
            displayQuote();
            checkSigninStatus(userId);
        } catch (error) {
            console.error('Error loading index or other content:', error);
        }
    } else {
        alert("No token found. Please log in again.");
        redirectToLogin();
    }
});

function getTokenFromCookies(name) {
    const cookieString = document.cookie.split('; ').find(row => row.startsWith(name + '='));
    console.log('Cookie string:', cookieString);
    return cookieString ? cookieString.split('=')[1] : null;
}

function decodeToken(token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log("Payload:", payload);
        return {
            userId: payload._id,
            role: payload.roleName
        };
    } catch (error) {
        console.error("Error decoding token:", error);
        return {};
    }
}

function checkTokenExpiration(token) {
    if (!token) return true;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = payload.exp * 1000;
        const currentTime = Date.now();
        return currentTime > expirationTime;
    } catch (error) {
        console.error("Error parsing token:", error);
        return true;
    }
}

async function loadIndex() {
    try {
        const response = await fetch('./HTML/index.html');
        if (!response.ok) throw new Error('Failed to load index.html');
        const indexHTML = await response.text();
        document.getElementById('index-container').innerHTML = indexHTML;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function displayGreeting(userId, role) {
    const now = new Date();
    const hours = now.getHours();
    const timeGreeting = hours < 12 ? "Good Morning" : (hours < 16 ? "Good Afternoon" : "Good Evening");

    try {
        const response = await fetch('http://172.16.2.6:4000/users');
        if (!response.ok) throw new Error('Failed to fetch user details');

        const data = await response.json();
        let fullName = sessionStorage.getItem('fullName') || data.user?.fullName || 'Guest';
        sessionStorage.setItem('fullName', fullName);

        const roleGreetings = {
            admin: 'Hello Admin',
            manager: 'Hello Manager',
            employee: 'Hello Employee',
            superAdmin: 'Hello SuperAdmin',
            guest: 'Hello Guest'
        };
        const roleGreeting = roleGreetings[role] || 'Hello';
        document.getElementById('greeting').textContent = `${timeGreeting} ${fullName}, Welcome to Bodhtree!`;
    } catch (error) {
        console.error('Error fetching user details:', error);
        document.getElementById('greeting').textContent = `${timeGreeting}, Welcome to Bodhtree!`;
    }
}

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

function checkSigninStatus(userId) {
    const lastSigninDate = localStorage.getItem(`${userId}_signinDate`);
    const today = new Date().toISOString().split('T')[0];

    if (lastSigninDate === today) {
        const signinTime = localStorage.getItem(`${userId}_signinTime`);
        const workLocation = localStorage.getItem(`${userId}_workLocation`);
        document.getElementById('signin-time').innerText = `You signed in at: ${signinTime} (${workLocation})`;
        document.getElementById('signin-btn').style.display = 'none';
        document.getElementById('signout-btn').style.display = 'block';
    } else {
        document.getElementById('signin-btn').style.display = 'block';
        document.getElementById('signout-btn').style.display = 'none';
    }
}

async function submitSignin() {
    const location = document.getElementById("location").value;
    const token = getTokenFromCookies('authToken');
    const userId = sessionStorage.getItem('userId');
    const today = new Date().toISOString().split('T')[0];

    if (!token || !userId) {
        alert("Authentication error. Please log in again.");
        redirectToLogin();
        return;
    }

    if (localStorage.getItem(`${userId}_signinDate`) === today) {
        alert("You have already signed in today.");
        return;
    }

    if (location) {
        const signinTime = formatISTTime(new Date());
        const statusValue = location === 'office' ? 'inOffice' : location === 'client-location' ? 'inClientLocation' : location === 'wfh' ? 'workFromHome' : null;

        if (!statusValue) {
            alert("Invalid location selected.");
            return;
        }

        try {
            const response = await fetch('http://172.16.2.6:4000/add/signIn', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ userId, location, status: statusValue })
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                console.error('Sign-in failed:', errorMessage);
                alert('Sign-in failed: ' + errorMessage);
                return;
            }

            const responseData = await response.json();
            const attendanceId = responseData._id;

            if (!attendanceId) {
                console.error("Server did not return an attendance ID.");
                alert("Sign-in was successful, but attendance ID is missing. Please contact support.");
                return;
            }
            console.log("Attendance ID from server:", attendanceId);

            localStorage.setItem(`${userId}_attendanceId`, attendanceId);
            localStorage.setItem(`${userId}_signinTime`, signinTime);
            localStorage.setItem(`${userId}_signinDate`, today);
            localStorage.setItem(`${userId}_workLocation`, location);

            document.getElementById('signin-time').textContent = `Signed in at: ${signinTime} (Location: ${location.replace('-', ' ')})`;
            document.getElementById('signin-btn').style.display = 'none';
            document.getElementById('signout-btn').style.display = 'block';
            await loadSwipes(attendanceId, token);
        } catch (error) {
            console.error('Error during sign-in:', error);
            alert('An error occurred while signing in.');
        }
    } else {
        alert("Please select a location and make sure you are logged in.");
    }

sessionStorage.setItem('userId', userId);

// After sign-in, call loadSwipes with the correct userId
await loadSwipes(_id, token);
}
function showSignoutConfirmation() {
    const modal = new bootstrap.Modal(document.getElementById('signoutConfirmationModal'));
    modal.show(); // Show the modal
}
async function submitSignout() {
    const userId = sessionStorage.getItem('userId');
    const attendanceId = localStorage.getItem(`${userId}_attendanceId`);
    const token = getTokenFromCookies('authToken');
    const location = localStorage.getItem(`${userId}_workLocation`);

    if (!attendanceId) {
        alert("Attendance ID not found. Please sign in first.");
        return;
    }

    if (!token || !location || !userId) {
        alert("Required information is missing. Make sure you have signed in.");
        return;
    }
    const signoutTime = formatISTTime(new Date()); // Get sign-out time

    try {
        const response = await fetch('http://172.16.2.6:4000/add/signOut', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ attendanceId,userId, location })
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error('Sign-out failed:', errorMessage);
            alert('Sign-out failed: ' + errorMessage);
            return;
        }

        alert("You have successfully signed out.");
         // Save and display the sign-out time
         localStorage.setItem(`${userId}_signoutTime`, signoutTime);
         document.getElementById('signin-time').textContent = `Signed out at: ${signoutTime} (Location: ${location.replace('-', ' ')})`;
         // Clear attendance-related data
        localStorage.removeItem(`${userId}_attendanceId`);
        localStorage.removeItem(`${userId}_signinTime`);
        localStorage.removeItem(`${userId}_signinDate`);
        localStorage.removeItem(`${userId}_workLocation`);

        document.getElementById('signin-btn').style.display = 'block';
        document.getElementById('signout-btn').style.display = 'none';
    } catch (error) {
        console.error('Error during sign-out:', error);
        alert('An error occurred while signing out.');
    }
}

function formatISTTime(date) {
    const options = { timeZone: 'Asia/Kolkata', hour12: false };
    return date.toLocaleString('en-GB', options);
}

function redirectToLogin() {
    window.location.href = './login.html';
}

function showSignoutConfirmation() {
    const confirmation = confirm("Are you sure you want to sign out?");
    if (confirmation) {
        submitSignout();
    }
}
async function loadSwipes(attendanceId, token) {
    if (!attendanceId || !token) {
        console.error("Attendance ID or Token is missing.");
        document.getElementById('swipes-list').innerHTML = '<p>No swipe history available.</p>';
        return;
    }

    try {
        const response = await fetch(`http://172.16.2.6:4000/swipes/${_id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            if (response.status === 404) {
                console.error("Swipes not found for the given attendance ID.");
                document.getElementById('swipes-list').innerHTML = '<p>No swipe history found for this attendance ID.</p>';
            } else {
                console.error(`Failed to load swipes: ${response.status} - ${response.statusText}`);
                document.getElementById('swipes-list').innerHTML = '<p>Error loading swipe history.</p>';
            }
            return;
        }

        const swipesData = await response.json();
        renderSwipes(swipesData);
    } catch (error) {
        console.error('Error loading swipes:', error);
        document.getElementById('swipes-list').innerHTML = '<p>Error loading swipe history.</p>';
    }
}

function renderSwipes(swipesData) {
    const swipesList = document.getElementById('swipes-list');
    swipesList.innerHTML = '';

    if (!swipesData || swipesData.length === 0) {
        swipesList.innerHTML = '<p>No swipe history found.</p>';
        return;
    }

    swipesData.forEach(swipe => {
        const li = document.createElement('li');
        li.classList.add('swipe');
        li.innerHTML = `<p>${swipe.location} - ${formatISTTime(new Date(swipe.time))}</p>`;
        swipesList.appendChild(li);
    });
}
window.onload = () => {
    displayGreeting();
    displayQuote();
}