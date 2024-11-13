// Function to show the image and highlight the selected item
function showImage(imageSrc, listItem) {
    const imgElement = document.getElementById('policy-image');

    // Display the image
    if (imageSrc) {
        imgElement.src = imageSrc;        // Set the image source
        imgElement.style.display = 'block'; // Make the image visible
        // Scroll to the image container smoothly
        imgElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        imgElement.src = '';               // Clear the image source
        imgElement.style.display = 'none';  // Hide the image
    }

    // Remove highlight from all list items
    const allItems = document.querySelectorAll('#content li');
    allItems.forEach(item => item.classList.remove('highlight'));

    // Highlight the clicked item
    listItem.classList.add('highlight');
}

// Add event listeners to all list items
document.querySelectorAll('#content li').forEach(item => {
    item.addEventListener('click', function() {
        const imageSrc = this.getAttribute('onclick').match(/'([^']+)'/)[1];
        showImage(imageSrc, this);  // Pass the clicked list item for highlighting
    });
});

// Prevent right-click context menu on the image
document.getElementById('policy-image').addEventListener('contextmenu', function(event) {
    event.preventDefault(); // Prevent the default context menu from appearing
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


// Function to show the image and highlight the selected item
function showImage(imageSrc, listItem) {
const imgElement = document.getElementById('policy-image');

// Display the image
if (imageSrc) {
    imgElement.src = imageSrc;        // Set the image source
    imgElement.style.display = 'block'; // Make the image visible
    // Scroll to the image container smoothly
    imgElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
} else {
    imgElement.src = '';               // Clear the image source
    imgElement.style.display = 'none';  // Hide the image
}

// Remove highlight from all list items
const allItems = document.querySelectorAll('#content li');
allItems.forEach(item => item.classList.remove('highlight'));

// Highlight the clicked item
listItem.classList.add('highlight');
}

// Add event listeners to all list items
document.querySelectorAll('#content li').forEach(item => {
item.addEventListener('click', function() {
    const imageSrc = this.getAttribute('onclick').match(/'([^']+)'/)[1];
    showImage(imageSrc, this);  // Pass the clicked list item for highlighting
});
});

// Prevent right-click context menu on the image
document.getElementById('policy-image').addEventListener('contextmenu', function(event) {
event.preventDefault(); // Prevent the default context menu from appearing
});
