document.addEventListener("DOMContentLoaded", async function() {
    const pdfViewer = document.getElementById('pdf-viewer');
    const loadingMessage = document.getElementById('loading-message');
    const downloadLink = document.getElementById('download-link');

    // Show loading message while fetching the PDF
    loadingMessage.style.display = 'block';

    try {
        // Fetch the file details to get the original name and the file URL
        const response = await fetch('http://172.16.2.6:4000/files');

        console.log('Response Status:', response.status);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const fileData = await response.json(); // Assuming the API returns JSON with file details
        console.log('File Data:', fileData); // Log the full response for debugging

        // Check the structure of the response
        if (Array.isArray(fileData) && fileData.length > 0) {
            const fileDetails = fileData[0]; // Assuming we want the first file in the array
            
            // Log the keys in fileDetails for better debugging
            console.log('File Details Keys:', Object.keys(fileDetails));

            const originalName = fileDetails.originalName || null; // Access the original name from the response
            const filePath = fileDetails.fileUrl || null; // Assuming this is the correct URL for the PDF file

            // Log original name and file path
            console.log('Original Name:', originalName);
            console.log('File URL:', filePath);

            if (!originalName || !filePath) {
                throw new Error('Original name or file URL is missing in the response');
            }

            // Fetch the dress code policy PDF using the URL from the API response
            const pdfResponse = await fetch('http://172.16.2.6:4000/files'); // Use the filePath directly

            if (!pdfResponse.ok) {
                throw new Error('Network response for PDF was not ok');
            }

            const blob = await pdfResponse.blob(); // Get the PDF as a Blob
            
            // Create a URL for the PDF blob
            const url = URL.createObjectURL(blob);
            pdfViewer.src = url; // Set the iframe source to the PDF blob
            downloadLink.href = `http://172.16.2.6:4000/download/${fileDetails.id}`; // Set the download link to the file URL
            downloadLink.download = originalName; // Set the download attribute with the original name
        } else {
            throw new Error('Unexpected file data format or empty array');
        }

        loadingMessage.style.display = 'none'; // Hide loading message
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        loadingMessage.textContent = 'Failed to load the Dress Code Policy. Please try again later.';
    }
});

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
