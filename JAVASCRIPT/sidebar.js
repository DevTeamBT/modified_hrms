// sidebar.js

document.addEventListener('DOMContentLoaded', () => {
    // Example of toggling sidebar functionality
    const sidebarToggle = document.querySelector('[data-widget="pushmenu"]');
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', () => {
        document.querySelector('.main-sidebar').classList.toggle('collapsed');
      });
    }
  });
  