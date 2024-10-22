document.addEventListener('DOMContentLoaded', function() {
    // Fetch the Sidebar
    fetch('templates/sidebar.html')  // Adjust this path as per your project structure
      .then(response => response.text())
      .then(data => {
        document.getElementById('sidebar-placeholder').innerHTML = data;
      })
      .catch(error => console.error('Error loading sidebar:', error));

    // Fetch the Navbar
    fetch('navbar.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('navbar-placeholder').innerHTML = data;

        // Add event listener for logout
        const logoutButton = document.querySelector('.logout-btn');
        if (logoutButton) {
          logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            sessionStorage.clear();
            window.location.href = '../HTML/login.html';
          });
        }
      })
      .catch(error => console.error('Error loading navbar:', error));
  });