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
