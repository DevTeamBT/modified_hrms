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




