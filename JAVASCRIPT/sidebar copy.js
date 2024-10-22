// script.js

$(document).ready(function () {
    $('#employeeForm').parsley();
  
    $('#toggle-button').click(function () {
      $('#sidebar').toggleClass('sidebar-hidden');
      $('#main-content').toggleClass('ml-72');
    });
  
    $('#search-button').click(function () {
      const query = $('#search-input').val();
      console.log('You searched for: ' + query); // Change alert to console log for debugging
    });
  
    $('#logout-button').click(function() {
      console.log('Logged out successfully!'); // Change alert to console log for debugging
    });
  });
  